// Wraps out/ObjectExplorer into the thing a person downloads, and signs it.
//
//   mac    dist/ObjectExplorer.app inside a .dmg, signed and notarized
//   win    dist/ObjectExplorer.exe with icon and version metadata
//   linux  dist/ObjectExplorer-<version>-<arch>.AppImage with icon and .desktop entry
//
// macOS needs the .app: a bare binary gets no icon, no Dock name, and cannot be stapled.
// Windows keeps the bare .exe, which is the whole point — nothing for Defender to eat except
// one signed file. Windows signing happens in CI (azure/trusted-signing-action), so this
// script only writes the resources. Linux has no signing at all, which is what makes the
// AppImage easy: one executable file that carries its own icon and menu entry.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { appimageCpu, fetchAppimageTool } from "./appimage-tool.mjs"
import { exePath } from "./sea.mjs"
import { targetArch, targetPlatform } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(root, "dist")
// assets/, not build/: build is output and is gitignored, so an icon living there never
// reaches a CI runner — which is exactly how 0.3.5 failed on mac and windows
const assetsDir = path.join(root, "assets")
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version
const appName = "ObjectExplorer"
const appId = "com.knockdata.objectexplorer"

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await pack()
}

export async function pack() {
	fs.rmSync(distDir, { recursive: true, force: true })
	fs.mkdirSync(distDir, { recursive: true })

	if (targetPlatform === "darwin") {
		packMac()
	} else if (targetPlatform === "win32") {
		packWindows()
	} else {
		await packLinux()
	}
}

function dirSize(dir) {
	let total = 0
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			total += dirSize(full)
		} else {
			total += fs.statSync(full).size
		}
	}
	return total
}

// A mac needs a mac: codesign, hdiutil and notarytool only exist on macOS, and an unsigned
// .app is not something anyone can open. The arch is free though — an Apple Silicon machine
// builds the Intel dmg with TARGET_ARCH=x64, which is how CI ships both without touching the
// macos-13 queue.
function packMac() {
	if (process.platform === "darwin") {
		buildApp()
	} else {
		throw new Error("a mac build needs a mac: codesign, hdiutil and notarytool have no substitute")
	}
}

function buildApp() {
	const appPath = path.join(distDir, `${appName}.app`)
	const macosDir = path.join(appPath, "Contents", "MacOS")
	const resourcesDir = path.join(appPath, "Contents", "Resources")
	fs.mkdirSync(macosDir, { recursive: true })
	fs.mkdirSync(resourcesDir, { recursive: true })

	fs.copyFileSync(exePath, path.join(macosDir, appName))
	fs.chmodSync(path.join(macosDir, appName), 0o755)
	fs.copyFileSync(path.join(assetsDir, "icon.icns"), path.join(resourcesDir, "icon.icns"))
	fs.writeFileSync(path.join(appPath, "Contents", "Info.plist"), infoPlist())

	// an identity means a real Developer ID build; "-" is the ad-hoc signature an Apple
	// Silicon mac needs just to let the binary run at all
	const identity = process.env.CODESIGN_IDENTITY || "-"
	execFileSync("codesign", [
		"--force",
		"--timestamp",
		"--options", "runtime",
		"--entitlements", path.join(assetsDir, "entitlements.plist"),
		"--sign", identity,
		appPath,
	], { stdio: "inherit" })
	console.log("signed with:", identity)

	const dmg = path.join(distDir, `${appName}-${version}-${targetArch}.dmg`)
	// hdiutil sizes the volume from -srcfolder on its own, and its estimate leaves no room for
	// filesystem overhead — the copy into /Volumes/ObjectExplorer then fails with ENOSPC on a
	// runner that has plenty of disk. 200 MB of slack costs nothing; UDZO compresses the empty
	// space away.
	const megabytes = Math.ceil(dirSize(appPath) / 1e6) + 200
	execFileSync("hdiutil", ["create", "-volname", appName, "-srcfolder", appPath, "-ov", "-format", "UDZO", "-size", `${megabytes}m`, dmg], { stdio: "inherit" })

	if (process.env.APPLE_API_KEY) {
		notarize(dmg)
	} else {
		console.log("no APPLE_API_KEY, skipping notarization")
	}
	console.log("dist:", dmg)
}

function notarize(dmg) {
	execFileSync("xcrun", [
		"notarytool", "submit", dmg,
		"--key", process.env.APPLE_API_KEY,
		"--key-id", process.env.APPLE_API_KEY_ID,
		"--issuer", process.env.APPLE_API_ISSUER,
		"--wait",
	], { stdio: "inherit" })
	execFileSync("xcrun", ["stapler", "staple", dmg], { stdio: "inherit" })
}

// Nothing to do but name the file: the icon and the version strings went in at
// scripts/win-resources.mjs, before the SEA blob, and the signature is applied by the release
// workflow.
function packWindows() {
	const target = path.join(distDir, `${appName}-${version}-${targetArch}.exe`)
	fs.copyFileSync(exePath, target)
	console.log("dist:", target, "— signing happens in the release workflow")
}

// An AppImage is one executable file: the runtime, with a squashfs of the AppDir appended.
// appimagetool does the squashfs and the concatenation; everything before that is just laying
// out the four things the AppDir has to contain.
async function packLinux() {
	const appDir = path.join(distDir, `${appName}.AppDir`)
	const binDir = path.join(appDir, "usr", "bin")
	fs.mkdirSync(binDir, { recursive: true })

	fs.copyFileSync(exePath, path.join(binDir, appName))
	fs.chmodSync(path.join(binDir, appName), 0o755)
	// the runtime mounts the image and execs AppRun; a relative symlink resolves inside the mount
	fs.symlinkSync(path.join("usr", "bin", appName), path.join(appDir, "AppRun"))
	// the desktop entry says Icon=icon, so the file beside it has to be icon.png
	fs.copyFileSync(path.join(assetsDir, "icon.png"), path.join(appDir, "icon.png"))
	fs.symlinkSync("icon.png", path.join(appDir, ".DirIcon"))
	fs.writeFileSync(path.join(appDir, `${appName}.desktop`), desktopEntry())

	const target = path.join(distDir, `${appName}-${version}-${targetArch}.AppImage`)
	const { tool, runtime } = await fetchAppimageTool(targetArch)
	// APPIMAGE_EXTRACT_AND_RUN because appimagetool is itself an AppImage and a runner has no
	// libfuse2 to mount one; ARCH because it will not guess the architecture from a SEA binary
	execFileSync(tool, ["--runtime-file", runtime, appDir, target], {
		stdio: "inherit",
		env: { ...process.env, ARCH: appimageCpu(targetArch), APPIMAGE_EXTRACT_AND_RUN: "1" },
	})
	console.log("dist:", target)
}

function infoPlist() {
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleExecutable</key>
	<string>${appName}</string>
	<key>CFBundleIdentifier</key>
	<string>${appId}</string>
	<key>CFBundleName</key>
	<string>${appName}</string>
	<key>CFBundleDisplayName</key>
	<string>${appName}</string>
	<key>CFBundleIconFile</key>
	<string>icon</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>${version}</string>
	<key>CFBundleVersion</key>
	<string>${version}</string>
	<key>LSMinimumSystemVersion</key>
	<string>11.0</string>
	<key>NSHighResolutionCapable</key>
	<true/>
</dict>
</plist>
`
}

function desktopEntry() {
	return `[Desktop Entry]
Type=Application
Name=${appName}
Comment=The VSCode for Cloud Storage
Exec=${appName}
Icon=icon
Categories=Utility;
Terminal=false
`
}
