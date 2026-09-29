// "Open with ObjectExplorer": the file a launch was given, and where it goes.
//
// macOS never comes through here from Finder — it sends the running app an Apple Event, and
// native/open-mac.m hands the paths to the page itself. Windows and linux start a new process with
// the path as an argument, so this is the half that finds the window already open:
//
//   second launch                           running app (server worker)
//   -------------                           ---------------------------
//   read objectexplorer.running.json
//   POST 127.0.0.1:<port>/open   ───────>   addon.openFiles(paths) → the page opens them
//   exit
//
// The running app writes that file once its window exists and removes it when the window closes.
// A file left by a crash names a port nobody answers, and the launch then opens a window of its
// own. The token keeps any other local program from making the window open files: the file is
// readable by this user only.
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { randomBytes } from "node:crypto"
import { runningFile } from "./paths.js"
import { log, logError } from "./log.js"

// The arguments that name a file. A path may itself hold an "=", so being a file on disk is the
// test, not the shape of the argument.
export function filesFromArgs(args) {
	return args.filter(function (arg) {
		try {
			return fs.statSync(arg).isFile()
		} catch (error) {
			return false
		}
	}).map(arg => path.resolve(arg))
}

export function newToken() {
	return randomBytes(16).toString("hex")
}

// true when the window that is already open took the files
export async function handOver(paths) {
	const running = readRunning()
	if (running) {
		try {
			const response = await fetch(`http://127.0.0.1:${running.port}/open`, {
				method: "POST",
				headers: { "Content-Type": "application/json", "X-Token": running.token },
				body: JSON.stringify(paths),
				signal: AbortSignal.timeout(3000),
			})
			log("handed", paths.length, "file(s) to the running window:", response.status)
			return response.ok
		} catch (error) {
			log("no running window answered on", running.port, "-", error.message)
			return false
		}
	} else {
		return false
	}
}

function readRunning() {
	try {
		return JSON.parse(fs.readFileSync(runningFile, "utf8"))
	} catch (error) {
		return null
	}
}

export function writeRunning(port, token) {
	try {
		fs.writeFileSync(runningFile, JSON.stringify({ port, token, pid: process.pid }), { mode: 0o600 })
	} catch (error) {
		logError("could not write", runningFile, error)
	}
}

// only ours: a window opened later may have written its own since
export function clearRunning() {
	const running = readRunning()
	if (running && running.pid === process.pid) {
		fs.rmSync(runningFile, { force: true })
	} else {
	}
}

// In the server worker, which has an event loop while the main thread is blocked in the window's.
// Resolves with the port it listens on, loopback only.
export function listenForOpen(addonFile, token) {
	const holder = { exports: {} }
	process.dlopen(holder, addonFile)
	const addon = holder.exports

	const server = http.createServer(function (req, res) {
		const allowed = req.method === "POST" && req.url === "/open" && req.headers["x-token"] === token
		if (allowed) {
			let body = ""
			req.on("data", chunk => body += chunk)
			req.on("end", function () {
				const paths = parsePaths(body)
				log("open: a second launch handed over", paths.join(", "))
				addon.openFiles(JSON.stringify(paths))
				res.end("ok")
			})
		} else {
			res.statusCode = 403
			res.end()
		}
	})
	return new Promise(function (resolve) {
		server.listen(0, "127.0.0.1", () => resolve(server.address().port))
	})
}

function parsePaths(body) {
	try {
		const paths = JSON.parse(body)
		return Array.isArray(paths) ? paths.filter(one => typeof one === "string") : []
	} catch (error) {
		return []
	}
}
