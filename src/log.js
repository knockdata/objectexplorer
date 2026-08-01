// Appends to ~/.objectexplorer/app.log and to stdout.
//
// The same file the server writes (server/src/logger.js), so one file holds the whole story:
// the launcher unpacking the bundle and starting the server, and then the server serving. Both
// writers append synchronously, so lines never interleave mid-line. The format matches too —
// `YYYY-MM-DD HH:MM:SS LEVEL message` — otherwise a merged file cannot be read in one pass.
//
// fs.writeSync on fd 1 rather than console.log: this also runs inside the server worker, and
// a worker's console.log is proxied through the main thread, which spends the whole session
// blocked inside webview_run. Anything written that way would never appear.
import fs from "node:fs"
import { logFile } from "./paths.js"

function timestamp() {
	const now = new Date()
	const pad = (value) => String(value).padStart(2, "0")
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function write(level, parts) {
	const line = `${timestamp()} ${level} ${parts.join(" ")}\n`
	fs.appendFileSync(logFile, line)
	try {
		fs.writeSync(1, line)
	} catch (error) {
		// no console attached (packaged app launched from Finder) — the file is the record
	}
}

export function log(...parts) {
	write("INFO ", parts)
}

// an Error stringifies to "{}" through join, so render it by hand or the line says nothing
export function logError(...parts) {
	write("ERROR", parts.map(function (part) {
		if (part instanceof Error) {
			return part.stack || `${part.name}: ${part.message}`
		}
		else {
			return part
		}
	}))
}
