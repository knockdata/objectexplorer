// Appends to ~/.objectexplorer/one.log and to stdout.
//
// fs.writeSync on fd 1 rather than console.log: this also runs inside the server worker, and
// a worker's console.log is proxied through the main thread, which spends the whole session
// blocked inside webview_run. Anything written that way would never appear.
import fs from "node:fs"
import { logFile } from "./paths.js"

export function log(...parts) {
	const line = `${new Date().toISOString()} ${parts.join(" ")}\n`
	fs.appendFileSync(logFile, line)
	try {
		fs.writeSync(1, line)
	} catch (error) {
		// no console attached (packaged app launched from Finder) — the file is the record
	}
}
