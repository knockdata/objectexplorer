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
// `ObjectExplorer cli …` is none of that: it runs the bundle's command line, the same as
// `npx @knockdata/objectexplorer …`, and is what the `oe` shell command calls (shellCommand.js).
//
// No JS bridge between the two: the UI reaches the backend over http://127.0.0.1 exactly as
// it does in a browser. That is why the native binding needs only eight calls.
import fs from "node:fs"
import path from "node:path"
import sea from "node:sea"
import { pathToFileURL } from "node:url"
import { Worker, SHARE_ENV } from "node:worker_threads"
import { createWindow, applyWindowsArgs, showAlert, allowForeground } from "./webview.js"
import { extractAddon } from "./addon.js"
import { filesFromArgs, handOver, newToken, writeRunning, clearRunning } from "./openFiles.js"
import { registerLinuxDesktop } from "./linuxDesktop.js"
import { openBrowser } from "./browser.js"
import { resolveBundleDir, resolveDuckdbDir, resolveSqliteDir } from "./bundle.js"
import { userData, logFile } from "./paths.js"
import { isDuplicateLaunch, launchGuardWindowMs } from "./launchGuard.js"
import { log, logError, fileOnly } from "./log.js"
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

// argv[2] on, both as a single executable and from sources: argv[1] is the binary or main.js
const cli = process.argv[2] === "cli"

// "Open with ObjectExplorer" on Windows and linux: the files this launch was started on
const openPaths = filesFromArgs(process.argv.slice(2))
// what a second launch has to show before this window opens its files (openFiles.js)
const openToken = newToken()

async function main() {
	if (cli) {
		fileOnly()
	}
	else {
		// the launcher's lines go to the terminal too
	}
	log("ObjectExplorer", version, "bundle", bundleVersion, process.platform, process.arch)
	log("argv:", process.argv.slice(1).join(" "))

	if (cli) {
		await runCli(process.argv.slice(3))
	}
	// before the debounce: a second file opened right after the first is not a double launch
	else if (openPaths.length > 0 && await handOverToRunning()) {
		log("the running window took the files, exiting")
		process.exit(0)
	}
	else if (isDuplicateLaunch()) {
		log("launched again within", launchGuardWindowMs + "ms", "of the previous launch, exiting")
		process.exit(0)
	}
	else {
		await runApp()
	}
}

// The launch that owns the foreground lets the running window take it, then hands the files over.
async function handOverToRunning() {
	allowForeground(readAsset)
	return await handOver(openPaths)
}

async function runApp() {
	const bundleDir = await resolveBundleDir(readAsset)
	const duckdbDir = await resolveDuckdbDir(readAsset)
	const sqliteDir = await resolveSqliteDir(readAsset)
	// the file manager's Open With, which an AppImage has to put there itself
	registerLinuxDesktop(bundleDir, readAsset)
	const windowed = args.mode !== "server" && args.mode !== "browser"
	const { port, openPort } = await startServer(bundleDir, duckdbDir, sqliteDir, windowed)
	const url = `http://127.0.0.1:${port}`
	log("app url:", url)

	if (args.mode === "server") {
		log("mode=server, no window; the worker keeps the process alive")
	} else if (args.mode === "browser") {
		log("mode=browser, skipping the native window")
		openBrowser(url)
	} else {
		openWindow(url, openPort)
	}
}

// `ObjectExplorer cli …`, which is what the `oe` shell command runs (shellCommand.js): the bundle's
// own cli.js, the same file `npx @knockdata/objectexplorer …` runs, with the engines this binary
// unpacked. It runs in a worker because a worker can import() the bundle; its arguments are appended
// to the worker's process.argv, after the two entries cli.js skips.
async function runCli(cliArgs) {
	const bundleDir = await resolveBundleDir(readAsset)
	const duckdbDir = await resolveDuckdbDir(readAsset)
	const sqliteDir = await resolveSqliteDir(readAsset)
	const cliUrl = pathToFileURL(path.join(bundleDir, "cli.js")).href
	const source = `import(require("node:worker_threads").workerData.cliUrl)`
	const worker = new Worker(source, {
		eval: true,
		env: SHARE_ENV,
		argv: [...cliArgs, `duckdbDir=${duckdbDir}`, `sqliteDir=${sqliteDir}`],
		workerData: { cliUrl },
	})
	worker.on("error", function (error) {
		console.error(error.message)
		process.exit(1)
	})
	worker.on("exit", function (code) {
		process.exit(code)
	})
}

// What runs this binary again, for the `oe` script to name. An AppImage runs from a mount that
// changes every launch; APPIMAGE is the file itself.
function selfCommand() {
	if (sea.isSea()) {
		return [process.env.APPIMAGE ?? process.execPath]
	} else {
		return [process.execPath, path.resolve(process.argv[1])]
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

// What starting this app again takes, alongside process.execPath. As a single executable argv[1]
// is the executable itself and the arguments follow it; run from sources — `node src/main.js` —
// argv[1] is the script, and node needs it to have a program to run at all.
function launchArgs() {
	if (sea.isSea()) {
		return process.argv.slice(2)
	} else {
		return process.argv.slice(1)
	}
}

function startServer(bundleDir, duckdbDir, sqliteDir, windowed) {
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
		// the launch arguments go with it: a worker's own process.argv is [execPath, "[worker
		// eval]"], and VersionManager restarts the app with the arguments it was started with
		//
		// addonFile: with a window, the worker loads the window's addon too, to hand it the files a
		// second launch opens (openFiles.js)
		workerData: {
			bundleDir, duckdbDir, sqliteDir, port: preferredPort, launchArgs: launchArgs(), selfCommand: selfCommand(),
			addonFile: windowed ? extractAddon("webview_napi", readAsset) : null, openToken,
		},
	})
	// a worker that outlives the main thread's blocking run() keeps the process alive on its
	// own, so nothing here needs to hold a reference
	return new Promise(function (resolve, reject) {
		worker.once("message", function (message) {
			if (message.error) {
				reject(new Error(message.error))
			} else {
				resolve(message)
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
function openWindow(url, openPort) {
	applyWindowsArgs(path.join(userData, "webview2-args.txt"), readFileOrNull)

	let window = null
	try {
		window = createWindow({
			title: "ObjectExplorer - The VSCode for Cloud Storage",
			icon: readIcon(),
			width: 1400,
			height: 900,
			readAsset,
		})
	} catch (error) {
		logError("native window unavailable:", error)
	}

	if (window) {
		writeRunning(openPort, openToken)
		if (openPaths.length > 0) {
			window.openFiles(openPaths)
		} else {
		}
		window.navigate(url)
		log("entering the window loop, this thread blocks until the window closes")
		window.run()
		log("window closed")
		clearRunning()
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
		return Buffer.from(readAsset("logo-full.png"))
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
