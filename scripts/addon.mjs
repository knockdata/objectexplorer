// Builds native/webview_napi.c plus the platform backend into
// out/webview_napi-<platform>-<arch>.node.
//
// mac and linux go through native/Makefile. Windows has no make on the runners, so
// scripts/addon-windows.mjs drives cl.exe instead — and does by hand the three things CMake
// used to do for us: find MSVC, turn the vendored .def files into node.lib, and delay-load
// node.exe. See native/napi/ for why no node headers are downloaded.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { buildWindowsAddon } from "./addon-windows.mjs"
import { canCompileAddon, targetArch, targetPlatform } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const nativeDir = path.join(root, "native")
const outDir = path.join(root, "out")
export const addonName = `webview_napi-${targetPlatform}-${targetArch}.node`

// node says x64, clang says x86_64
const clangArch = targetArch === "x64" ? "x86_64" : targetArch

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await buildAddon()
}

export async function buildAddon() {
	fs.mkdirSync(outDir, { recursive: true })
	const target = path.join(outDir, addonName)

	if (canCompileAddon) {
		const built = await compile()
		fs.copyFileSync(built, target)
		console.log("addon:", target, fs.statSync(target).size, "bytes")
	} else if (fs.existsSync(target)) {
		// the backends call Cocoa, WebKitGTK or WebView2, so building for another platform needs
		// that platform's own SDK. Reuse an addon someone else compiled.
		console.log("addon: reusing prebuilt", target, fs.statSync(target).size, "bytes")
	} else {
		throw new Error(`cross build needs a prebuilt ${addonName} in out/; the ${targetPlatform} job of a release run has one`)
	}
	return target
}

async function compile() {
	if (targetPlatform === "win32") {
		return buildWindowsAddon({ nativeDir, arch: targetArch })
	} else {
		// -arch is what turns an arm64 mac into an x86_64 build; one Xcode targets both
		execFileSync("make", ["-C", nativeDir, `ARCH=${clangArch}`], { stdio: "inherit" })
		return path.join(nativeDir, "build", clangArch, "webview_napi.node")
	}
}
