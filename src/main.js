// ObjectExplorer as one native binary.
//
//   main thread                            worker thread
//   -----------                            -------------
//   unpack the app bundle
//   start the worker              ──────>  start the objectexplorer HTTP server
//   wait for the port             <──────  postMessage({ port })
//   open the native window
//   run()  — blocks until close            keeps serving, checks for updates
//
// mode= picks what the main thread does with the url: the native window by default,
// browser for the default browser, server for neither. See README.
//
// No JS bridge between the two: the UI reaches the backend over http://127.0.0.1 exactly as
// it does in a browser. That is why the native binding needs only seven calls.
import fs from "node:fs"
import path from "node:path"
import sea from "node:sea"
import { Worker } from "node:worker_threads"
import { createWindow, applyWindowsArgs } from "./webview.js"
import { openBrowser } from "./browser.js"
import { resolveBundleDir } from "./bundle.js"
import { userData } from "./paths.js"
import { log } from "./log.js"
import { version, bundleVersion } from "./version.js"

// split each arg on the first "=" only, so a value may itself contain "="
const args = Object.fromEntries(process.argv.slice(2).map(function (arg) {
	const separator = arg.indexOf("=")
	if (separator === -1) {
		return [arg, ""]
	} else {
		return [arg.slice(0, separator), arg.slice(separator + 1)]
	}
}))

const preferredPort = args.port ? +args.port : 9421

async function main() {
	log("ObjectExplorer", version, "bundle", bundleVersion, process.platform, process.arch)
	log("argv:", process.argv.slice(1).join(" "))

	const bundleDir = await resolveBundleDir(readAsset)
	const port = await startServer(bundleDir)
	const url = `http://127.0.0.1:${port}`
	log("app url:", url)

	if (args.mode === "server") {
		log("mode=server, no window; the worker keeps the process alive")
	} else if (args.mode === "browser") {
		log("mode=browser, skipping the native window")
		openBrowser(url)
	} else {
		openWindow(url)
	}
}

// Reads a file embedded in the binary. Running the sources from plain node has no SEA to
// read from, so the same files are taken off disk out of out/ — the folder scripts/sea.mjs
// builds them into. Development only, hence the plain relative path.
function readAsset(name) {
	if (sea.isSea()) {
		return sea.getRawAsset(name)
	} else {
		return fs.readFileSync(path.resolve("out", name))
	}
}

function startServer(bundleDir) {
	const source = Buffer.from(readAsset("worker.js")).toString("utf8")
	const worker = new Worker(source, {
		eval: true,
		workerData: { bundleDir, port: preferredPort },
	})
	// a worker that outlives the main thread's blocking run() keeps the process alive on its
	// own, so nothing here needs to hold a reference
	return new Promise(function (resolve, reject) {
		worker.once("message", function (message) {
			if (message.error) {
				reject(new Error(message.error))
			} else {
				resolve(message.port)
			}
		})
		worker.once("error", reject)
	})
}

// The native window is the only part that can fail on a machine-specific basis — a Windows VM
// with no WebView2 runtime, a linux box with no webkitgtk. Falling back to the browser keeps
// the binary useful there instead of dead.
function openWindow(url) {
	applyWindowsArgs(path.join(userData, "webview2-args.txt"), readFileOrNull)
	try {
		const window = createWindow({
			title: "ObjectExplorer",
			width: 1400,
			height: 900,
			debug: args.debug === "true",
			readAsset,
		})
		window.navigate(url)
		log("entering the window loop, this thread blocks until the window closes")
		window.run()
		log("window closed")
		process.exit(0)
	} catch (error) {
		log("native window unavailable, falling back to the browser:", error.message)
		openBrowser(url)
	}
}

function readFileOrNull(file) {
	if (fs.existsSync(file)) {
		return fs.readFileSync(file, "utf8")
	} else {
		return null
	}
}

main().catch(function (error) {
	log("startup failed:", error.stack)
	process.exit(1)
})
