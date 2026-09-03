// The HTTP server, running on its own thread.
//
// webview_run blocks the main thread for the whole session, so everything with an event loop
// lives here: the backend, the folder dialog it calls back into, and the update check. The
// only thing sent back to the main thread is the port, and it is sent before the main thread
// enters the blocking loop.
//
// Bundled to its own file by scripts/sea.mjs and embedded as the SEA asset "worker.js".
// The body is wrapped in start() rather than using top-level await: the bundle is CommonJS,
// which is what `new Worker(source, { eval: true })` evaluates.
import path from "node:path"
import fs from "node:fs"
import { pathToFileURL } from "node:url"
import { parentPort, workerData } from "node:worker_threads"

import VersionManager from "./VersionManager.js"
import { userData } from "./paths.js"
import { log, logError } from "./log.js"

async function start() {
	const { bundleDir, ffmpegDir, duckdbDir, sqliteDir, port, launchArgs } = workerData
	const appDir = path.join(bundleDir, "app")
	const serverPath = path.join(bundleDir, "server", "WebServer.mjs")

	// the demo dataset ships inside the bundle; when a bundle has no demo/ folder the backend
	// proxies demo requests to objectexplorer.com instead
	const demoDir = path.join(bundleDir, "demo")
	let demoPath = null
	if (fs.existsSync(demoDir)) {
		demoPath = demoDir
	}

	// an absolute path is not a valid ESM specifier on Windows ("C:\..." parses as scheme
	// "c:"), so the backend is addressed as a file:// URL
	log("loading backend:", serverPath)
	const { WebServer } = await import(pathToFileURL(serverPath).href)

	// `desktop`, not `package`: the CLI serves the same bundle into a real browser, and only
	// this host runs inside the native webview — where window.open has nowhere to go, so the
	// UI has to hand an external url back to the server to open in the default browser.
	// The backend serves the Check for Updates dialog out of this, and the launch check below
	// is the same call the dialog's Upgrade button makes.
	const versionManager = VersionManager({ bundleDir, launchArgs })

	const server = await WebServer({
		mode: "prod",
		appMode: "desktop",
		appDir,
		publicDir: appDir,
		demoPath,
		userData,
		ffmpegDir,
		duckdbDir,
		sqliteDir,
		port,
		portRetry: true,
		versionManager,
	})

	const listenPort = await server.start()
	log("server listening on", listenPort)
	parentPort.postMessage({ port: listenPort })

	// the window is up by now, so a slow registry call costs the user nothing
	await versionManager.upgrade()
}

start().catch(function (error) {
	logError("server worker failed:", error)
	parentPort.postMessage({ error: String(error) })
})
