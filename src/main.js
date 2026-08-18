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
// it does in a browser. That is why the native binding needs only eight calls.
import fs from "node:fs"
import path from "node:path"
import sea from "node:sea"
import { Worker, SHARE_ENV } from "node:worker_threads"
import { createWindow, applyWindowsArgs, showAlert } from "./webview.js"
import { openBrowser } from "./browser.js"
import { resolveBundleDir, resolveFfmpegDir, resolveDuckdbDir, resolveSqliteDir } from "./bundle.js"
import { userData, logFile } from "./paths.js"
import { log, logError } from "./log.js"
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

	if (isDuplicateLaunch()) {
		log("launched again within", launchGuardWindowMs + "ms", "of the previous launch, exiting")
		process.exit(0)
		return
	}

	const bundleDir = await resolveBundleDir(readAsset)
	const ffmpegDir = await resolveFfmpegDir(readAsset)
	const duckdbDir = await resolveDuckdbDir(readAsset)
	const sqliteDir = await resolveSqliteDir(readAsset)
	const port = await startServer(bundleDir, ffmpegDir, duckdbDir, sqliteDir)
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

// ObjectExplorer allows as many instances as a user opens — this is not a single-instance
// app. The one case worth guarding is Windows handing out two live processes for what looks
// like one launch: MSIX's App Installer auto-opens the app the moment install finishes, while
// its own UI is at that same moment inviting a click on the Start tile — the ordinary thing to
// do right after installing something. So the guard is a debounce, not a lock: a launch that
// lands within launchGuardWindowMs of the previous one is treated as that same install-time
// double-fire and exits quietly; anything after the window — a minute later, or a deliberate
// second window opened five seconds apart — runs normally alongside whatever is already open.
//
// No lock is held for the session and nothing is cleaned up on exit: window.run() blocks this
// thread in native code for as long as the window is open, so a timer-based cleanup would never
// fire until close. Comparing against the guard file's mtime instead needs no timer at all —
// the next launch, whenever it comes, does the one comparison and overwrites the timestamp for
// whichever launch comes after it.
const launchGuardFile = path.join(userData, "objectexplorer.last-launch")
const launchGuardWindowMs = 3000

function isDuplicateLaunch() {
	let previousAge = null
	try {
		previousAge = Date.now() - fs.statSync(launchGuardFile).mtimeMs
	} catch (error) {
		previousAge = null
	}

	try {
		fs.writeFileSync(launchGuardFile, String(process.pid))
	} catch (error) {
		// non-fatal — worst case this debounce just doesn't fire this time
	}

	return previousAge !== null && previousAge < launchGuardWindowMs
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

function startServer(bundleDir, ffmpegDir, duckdbDir, sqliteDir) {
	const source = Buffer.from(readAsset("worker.js")).toString("utf8")
	// SHARE_ENV, because the backend publishes OBJECTFS_SERVER into the environment once it knows
	// which port it settled on (server/WebServer.js startAndPublishAddress), and duckdb's objectfs
	// extension reads that with the C getenv. Without SHARE_ENV a worker writes to a private copy
	// of process.env: the C side keeps seeing nothing, objectfs falls back to 127.0.0.1:8080, and
	// every path only this server can resolve — a folder root, an s3:// object, a .sav — fails with
	// "No files found that match the pattern". The port is never passed from here for the same
	// reason: preferredPort is a wish, and portRetry may settle on another one.
	const worker = new Worker(source, {
		eval: true,
		env: SHARE_ENV,
		workerData: { bundleDir, ffmpegDir, duckdbDir, sqliteDir, port: preferredPort },
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
// with no WebView2 runtime, a linux box with no webkitgtk. Only creating it is allowed to fail
// here: navigate and run used to sit inside this try as well, which turned a hiccup anywhere in
// the session — including at window close — into a browser tab nobody asked for. A desktop app
// that opens a tab by itself is a bug, so the failure is now told to the user and that is all.
function openWindow(url) {
	applyWindowsArgs(path.join(userData, "webview2-args.txt"), readFileOrNull)

	let window = null
	try {
		window = createWindow({
			title: "ObjectExplorer - The VSCode for Cloud Storage",
			icon: readIcon(),
			width: 1400,
			height: 900,
			debug: args.debug === "true",
			readAsset,
		})
	} catch (error) {
		logError("native window unavailable:", error)
	}

	if (window) {
		window.navigate(url)
		log("entering the window loop, this thread blocks until the window closes")
		window.run()
		log("window closed")
		process.exit(0)
	} else {
		showAlert({ title: "ObjectExplorer cannot open its window", text: noWindowMessage(url), readAsset })
		process.exit(1)
	}
}

// The url is in here because the server did start: a user who installs the runtime, or who just
// wants at the app right now, can paste this into a browser and everything works.
function noWindowMessage(url) {
	if (process.platform === "win32") {
		return `The Microsoft Edge WebView2 Runtime is missing or could not start.\n\nInstall it from https://go.microsoft.com/fwlink/p/?LinkId=2124703 and start ObjectExplorer again.\n\nObjectExplorer is running at ${url} in the meantime.\n\nThe details are in ${logFile}.`
	} else {
		return `The system webview could not start.\n\nObjectExplorer is running at ${url} in the meantime.\n\nThe details are in ${logFile}.`
	}
}

// null rather than a throw: an icon that cannot be read is a window with the platform's default
// icon, not a window that never opens. Reading it inside the createWindow arguments is what
// turned a missing asset into "native window unavailable" and a browser tab.
function readIcon() {
	try {
		return Buffer.from(readAsset("64.png"))
	} catch (error) {
		logError("no window icon:", error)
		return null
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
	logError("startup failed:", error)
	process.exit(1)
})
