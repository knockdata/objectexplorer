// Downloads the Microsoft WebView2 SDK into out/webview2-cache. Windows only.
//
// This is the one thing the native layer cannot vendor. WebView2 is reached through
// CreateCoreWebView2EnvironmentWithOptions, exported by Microsoft's loader, and there is no
// supported way in without it. Linking WebView2LoaderStatic.lib keeps the shipped binary a
// single file — nothing extra sits next to the .exe.
//
// The nuget package is a plain zip served over https, so this needs no nuget tooling, only the
// bsdtar that ships with Windows 10+.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cacheDir = path.join(root, "out", "webview2-cache")
export const webview2Version = "1.0.3485.44"

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	console.log(await fetchWebview2Sdk("x64"))
}

// returns { include, loader } — the header directory and the static loader for this arch
export async function fetchWebview2Sdk(arch) {
	const sdkDir = path.join(cacheDir, webview2Version)
	const include = path.join(sdkDir, "build", "native", "include")
	const loader = path.join(sdkDir, "build", "native", arch, "WebView2LoaderStatic.lib")

	if (fs.existsSync(loader)) {
		console.log("webview2 sdk cached:", sdkDir)
	} else {
		fs.mkdirSync(sdkDir, { recursive: true })
		const url = `https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/${webview2Version}`
		console.log("downloading", url)
		const download = path.join(cacheDir, `webview2-${webview2Version}.zip`)
		fs.writeFileSync(download, Buffer.from(await (await fetch(url)).arrayBuffer()))
		execFileSync("tar", ["-xf", download, "-C", sdkDir], { stdio: "inherit" })
		fs.rmSync(download)
	}

	return { include, loader }
}
