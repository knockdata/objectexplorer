// The native window. Thin closure over native/webview_napi.c — see native/webview.h for why
// the binding has only six calls and no error codes.
//
// run() blocks this thread until the window closes, so nothing else on the main thread runs
// after it. The HTTP server lives in a worker for exactly that reason.
import { loadAddon } from "./addon.js"
import { log } from "./log.js"

export function createWindow({ title, width, height, debug, readAsset }) {
	const addon = loadAddon("webview_napi", readAsset)
	const handle = addon.create(debug)
	addon.setTitle(handle, title)
	addon.setSize(handle, width, height)
	log("window created", width, "x", height)

	return {
		navigate: function (url) {
			addon.navigate(handle, url)
		},
		run: function () {
			addon.run(handle)
			addon.destroy(handle)
		},
	}
}

// WebView2 reads its Chromium switches from this variable at creation time. The default
// disables the GPU: the Windows VMs this binary exists for have no GPU at all, and the
// explorer UI never needed one — a GPU-less machine taking the hardware path is what crashed
// the Electron build on first paint. Override with ~/.objectexplorer/webview2-args.txt.
export function applyWindowsArgs(argsFile, readFile) {
	if (process.platform === "win32") {
		const fromFile = readFile(argsFile)
		const args = fromFile === null ? "--disable-gpu" : fromFile.trim()
		process.env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = args
		log("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:", args, fromFile === null ? "(default)" : `(${argsFile})`)
	} else {
		// mac and linux take no equivalent; webkit picks its own rendering path
	}
}
