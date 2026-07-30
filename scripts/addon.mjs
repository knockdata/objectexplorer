// Builds native/webview_napi.c into out/webview_napi-<platform>-<arch>.node.
// cmake-js is here only to supply node headers and the CMAKE_JS_* variables; the build
// itself is native/CMakeLists.txt.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { canCompileAddon, targetArch, targetPlatform } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const nativeDir = path.join(root, "native")
const outDir = path.join(root, "out")
export const addonName = `webview_napi-${targetPlatform}-${targetArch}.node`

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	buildAddon()
}

export function buildAddon() {
	fs.mkdirSync(outDir, { recursive: true })
	const target = path.join(outDir, addonName)

	if (canCompileAddon) {
		// the package entry point, not node_modules/.bin — node 24 refuses to spawn a .cmd shim
		const cmakeJs = path.join(root, "node_modules", "cmake-js", "bin", "cmake-js")
		// --arch is what turns an arm64 mac into an x86_64 build: cmake-js translates it to
		// CMAKE_OSX_ARCHITECTURES, which the webview subproject picks up too. One build
		// directory per arch, so switching arch locally cannot reuse a stale cmake cache.
		const buildDir = path.join("build", targetArch)
		execFileSync(process.execPath, [cmakeJs, "compile", "--CDCMAKE_BUILD_TYPE=Release", "--arch", targetArch, "--out", buildDir], { cwd: nativeDir, stdio: "inherit" })

		const built = path.join(nativeDir, buildDir, "Release", "webview_napi.node")
		fs.copyFileSync(built, target)
		console.log("addon:", target, fs.statSync(target).size, "bytes")
	} else if (fs.existsSync(target)) {
		// webview links against Cocoa, WebKitGTK or WebView2-COM, so building for another
		// platform needs that platform's own SDK. Reuse an addon someone else compiled.
		console.log("addon: reusing prebuilt", target, fs.statSync(target).size, "bytes")
	} else {
		throw new Error(`cross build needs a prebuilt ${addonName} in out/; the ${targetPlatform} job of a release run has one`)
	}
	return target
}
