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
	buildDmg(appPath, dmg)

	if (process.env.APPLE_API_KEY) {
		notarize(dmg)
	} else {
		console.log("no APPLE_API_KEY, skipping notarization")
	}
	console.log("dist:", dmg)
}

// What a person sees when they double-click the download: one window holding the app and an
// alias to /Applications, so installing is a drag from left to right. hdiutil cannot lay that
// window out, so the image is built read-write, mounted, arranged by Finder over AppleScript
// (which writes the .DS_Store that remembers the layout), and only then compressed to the
// read-only UDZO that ships.
function buildDmg(appPath, dmg) {
	const stageDir = path.join(distDir, "dmg")
	fs.mkdirSync(stageDir, { recursive: true })
	// ditto, not cp: it keeps the code signature and the bundle's extended attributes intact
	execFileSync("ditto", [appPath, path.join(stageDir, `${appName}.app`)], { stdio: "inherit" })
	fs.symlinkSync("/Applications", path.join(stageDir, "Applications"))

	// hdiutil sizes the volume from -srcfolder on its own, and its estimate leaves no room for
	// filesystem overhead — the copy into /Volumes/ObjectExplorer then fails with ENOSPC on a
	// runner that has plenty of disk. 200 MB of slack costs nothing; UDZO compresses the empty
	// space away.
	const megabytes = Math.ceil(dirSize(stageDir) / 1e6) + 200
	const writableDmg = path.join(distDir, "writable.dmg")
	execFileSync("hdiutil", ["create", "-volname", appName, "-srcfolder", stageDir, "-ov", "-format", "UDRW", "-size", `${megabytes}m`, writableDmg], { stdio: "inherit" })

	// mounted here rather than at /Volumes/ObjectExplorer: another ObjectExplorer volume may
	// already be mounted — the name then becomes "ObjectExplorer 1" — and a Finder that still
	// remembers a window for that path reuses it and never writes the .DS_Store this needs
	const mountPoint = path.join(distDir, "mount")
	fs.mkdirSync(mountPoint, { recursive: true })
	const attached = execFileSync("hdiutil", ["attach", writableDmg, "-noautoopen", "-mountpoint", mountPoint], { encoding: "utf8" })
	console.log(attached.trim())
	layout(mountPoint)
	volumeIcon(mountPoint)
	detach(mountPoint, deviceOf(attached))
	fs.rmSync(mountPoint, { recursive: true, force: true })

	waitForRelease(writableDmg)
	convert(writableDmg, dmg)
	fs.rmSync(writableDmg)
	fs.rmSync(stageDir, { recursive: true, force: true })
}

// Without an icon of its own the volume gets the system's generic disk-image icon — the down
// arrow that reads as "a download" — in the window title, the sidebar and on the desktop. Finder
// uses .VolumeIcon.icns instead, but only once the custom-icon flag is set: byte 8 of the 32-byte
// FinderInfo attribute, which is what `SetFile -a C` writes and xattr can write without Xcode.
// This runs after the layout, not before: Finder's "update" deletes the icns it has already read.
function volumeIcon(mountPoint) {
	const customIcon = "0000000000000000040000000000000000000000000000000000000000000000"
	fs.copyFileSync(path.join(assetsDir, "icon.icns"), path.join(mountPoint, ".VolumeIcon.icns"))
	execFileSync("xattr", ["-wx", "com.apple.FinderInfo", customIcon, mountPoint], { stdio: "inherit" })
}

// Finder scripting needs a logged-in GUI session, which a CI runner may not have. A dmg with a
// default window is still a working dmg — the /Applications alias is in it either way — so a
// failure here is a warning, not a broken release.
function layout(mountPoint) {
	try {
		execFileSync("osascript", ["-e", finderLayout(mountPoint)], { stdio: ["ignore", "inherit", "pipe"] })
		console.log("dmg window arranged for drag-to-Applications")
	} catch (error) {
		console.log("no Finder available, dmg keeps the default window layout:", String(error.stderr).trim())
	}
}

// `hdiutil attach` prints "/dev/disk4  \tGUID_partition_scheme" and one line per slice. The
// whole-disk device on the first line is what detaches the image; a mountpoint only detaches
// while it is still mounted, which is exactly what a busy volume is not sure about.
function deviceOf(attachOutput) {
	const match = attachOutput.match(/^\/dev\/disk\d+/m)
	if (match) {
		return match[0]
	} else {
		return ""
	}
}

function isMounted(mountPoint) {
	const mounted = execFileSync("mount", { encoding: "utf8" })
	return mounted.includes(` on ${mountPoint} `)
}

// Finder holds the volume for a moment after writing .DS_Store, and a busy volume refuses to
// detach. Two things made this fail a whole mac build: it can hold on for longer than the ten
// seconds this used to wait, and once it lets go every further `hdiutil detach` fails too —
// with "no such file or directory", because the volume is already gone. So each attempt asks
// whether the volume is still mounted before deciding anything, and the device node is tried
// once the mountpoint stops resolving.
function detach(mountPoint, device) {
	// Finder writes .DS_Store lazily; sync makes sure it is on the image before it is unmounted
	execFileSync("sync", [], { stdio: "inherit" })

	for (let attempt = 0; attempt < 15 && isMounted(mountPoint); attempt++) {
		const target = attempt < 5 ? mountPoint : device || mountPoint
		try {
			execFileSync("hdiutil", ["detach", target], { stdio: "inherit" })
		} catch (error) {
			console.log(`detach attempt ${attempt + 1} failed, volume still busy`)
			execFileSync("sleep", ["2"])
		}
	}

	if (isMounted(mountPoint)) {
		console.log("volume never let go, forcing the detach")
		execFileSync("hdiutil", ["detach", device || mountPoint, "-force"], { stdio: "inherit" })
	} else {
		console.log("volume detached")
	}
}

// hdiutil detach returns as soon as the volume is unmounted, but the disk image framework keeps
// the backing file open for a moment longer while it tears the device down. A convert started in
// that window fails with "Resource temporarily unavailable" — which is what killed the 0.3.9 mac
// x64 build, right after the log had said "volume detached". The image leaves `hdiutil info` only
// when it is truly released, so that is what we wait on.
function waitForRelease(writableDmg) {
	for (let attempt = 0; attempt < 30 && stillAttached(writableDmg); attempt++) {
		execFileSync("sleep", ["1"])
	}

	if (stillAttached(writableDmg)) {
		console.log("the image is still attached after 30s, converting anyway")
	} else {
		console.log("image released")
	}
}

function stillAttached(writableDmg) {
	const info = execFileSync("hdiutil", ["info"], { encoding: "utf8" })
	return info.includes(writableDmg)
}

// Even a released image can lose the race on a loaded runner, and the next attempt a few seconds
// later succeeds — so this retries instead of taking the whole release down with it. Each attempt
// starts from no output file, because hdiutil refuses to overwrite one.
function convert(writableDmg, dmg) {
	let converted = false

	for (let attempt = 0; attempt < 5 && converted === false; attempt++) {
		fs.rmSync(dmg, { force: true })
		try {
			execFileSync("hdiutil", ["convert", writableDmg, "-format", "UDZO", "-o", dmg], { stdio: "inherit" })
			converted = true
		} catch (error) {
			console.log(`convert attempt ${attempt + 1} failed, waiting for the image to be released`)
			execFileSync("sleep", ["5"])
		}
	}

	if (converted) {
		console.log("converted:", dmg)
	} else {
		throw new Error(`hdiutil convert failed 5 times: ${dmg}`)
	}
}

// toolbar and statusbar off: the window opens as plain icons on a plain background, with no
// Finder chrome — the back arrows, the view switcher and the share/download button — above them.
function finderLayout(mountPoint) {
	return `tell application "Finder"
	tell folder (POSIX file "${mountPoint}" as alias)
		open
		set current view of container window to icon view
		set toolbar visible of container window to false
		set statusbar visible of container window to false
		set bounds of container window to {200, 150, 800, 550}
		set viewOptions to icon view options of container window
		set arrangement of viewOptions to not arranged
		set icon size of viewOptions to 128
		set text size of viewOptions to 13
		set position of item "${appName}.app" of container window to {150, 170}
		set position of item "Applications" of container window to {450, 170}
		close
		open
		update without registering applications
		delay 2
	end tell
end tell`
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
