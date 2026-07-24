// The Windows half of scripts/addon.mjs: cl.exe instead of make.
//
// CMake used to hide three things on this platform. Each is an explicit step here:
//
//   1. find MSVC              vswhere -> vcvarsall.bat
//   2. node import lib        lib /def: over the .def files vendored in native/napi
//   3. delay-load node.exe    native/delay-load-hook.c, see that file
//
// The commands go into a .bat rather than one long cmd /c string: vcvarsall only takes effect
// for the rest of its own shell, and a file is something you can read after a failed build.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fetchWebview2Sdk } from "./webview2-sdk.mjs"

export async function buildWindowsAddon({ nativeDir, arch }) {
	const buildDir = path.join(nativeDir, "build", arch)
	fs.mkdirSync(buildDir, { recursive: true })

	const sdk = await fetchWebview2Sdk(arch)
	const nodeLib = writeNodeLibDef(nativeDir, buildDir)
	const target = path.join(buildDir, "webview_napi.node")

	const script = path.join(buildDir, "build.bat")
	fs.writeFileSync(script, batch({ nativeDir, arch, buildDir, sdk, nodeLib, target }))
	execFileSync("cmd", ["/d", "/c", script], { cwd: nativeDir, stdio: "inherit" })
	return target
}

// Both vendored .def files carry their own NAME/EXPORTS header, and lib wants one file with one
// of each.
function writeNodeLibDef(nativeDir, buildDir) {
	const napiDir = path.join(nativeDir, "napi")
	const symbols = ["node_api.def", "js_native_api.def"].flatMap(function (name) {
		const lines = fs.readFileSync(path.join(napiDir, name), "utf8").split(/\r?\n/)
		return lines.filter(function (line) {
			const text = line.trim()
			return text !== "" && text !== "EXPORTS" && text.startsWith("NAME ") === false
		})
	})
	const def = path.join(buildDir, "node_api.def")
	fs.writeFileSync(def, ["NAME NODE.EXE", "EXPORTS", ...symbols, ""].join("\r\n"))
	return path.join(buildDir, "node.lib")
}

function batch({ nativeDir, arch, buildDir, sdk, nodeLib, target }) {
	const machine = arch === "arm64" ? "ARM64" : "X64"
	const objects = `${buildDir}${path.sep}`
	// /MT because WebView2LoaderStatic.lib needs the static CRT, which also means a user machine
	// needs no Visual C++ redistributable
	const compile = [
		"cl /nologo /O2 /W3 /MT /DUNICODE /D_UNICODE",
		`/I "${path.join(nativeDir, "napi")}" /I "${sdk.include}"`,
		`/Fo"${objects}"`,
		"webview_napi.c webview-windows.c delay-load-hook.c",
		"/link /DLL",
		`/OUT:"${target}"`,
		`"${nodeLib}" "${sdk.loader}"`,
		"delayimp.lib /DELAYLOAD:node.exe",
		"ole32.lib oleaut32.lib user32.lib shell32.lib version.lib advapi32.lib shlwapi.lib",
	].join(" ")

	return [
		"@echo off",
		`call "${vcvarsall()}" ${arch} || exit /b 1`,
		`lib /nologo /def:"${path.join(buildDir, "node_api.def")}" /machine:${machine} /out:"${nodeLib}" || exit /b 1`,
		`${compile} || exit /b 1`,
		"",
	].join("\r\n")
}

function vcvarsall() {
	const vswhere = path.join(process.env["ProgramFiles(x86)"], "Microsoft Visual Studio", "Installer", "vswhere.exe")
	const installed = execFileSync(vswhere, ["-latest", "-products", "*", "-property", "installationPath"], { encoding: "utf8" }).trim()
	const script = path.join(installed, "VC", "Auxiliary", "Build", "vcvarsall.bat")

	if (fs.existsSync(script)) {
		return script
	} else {
		throw new Error(`no MSVC C++ tools in ${installed}; install the "Desktop development with C++" workload`)
	}
}
