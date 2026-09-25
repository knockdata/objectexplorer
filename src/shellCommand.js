// The `oe` shell command: a small script on PATH that runs this binary as the command line, so
// `oe …` does what `npx @knockdata/objectexplorer …` does, with no node or npm on the machine.
// The command palette's "Shell Command: Install 'oe' command in PATH" puts it there, the way
// VSCode puts `code` there; nothing is written until someone asks.
//
//   macOS    /usr/local/bin/oe, through the system's administrator prompt when that folder is
//            not writable
//   linux    ~/.local/bin/oe
//   windows  %LOCALAPPDATA%\Microsoft\WindowsApps\oe.cmd, a folder already on every user's PATH
//
// The script names the binary it runs. An AppImage and an MSIX install move with every update, so
// each start rewrites a script that is ours when it names another binary and needs no prompt.
// A file of the same name that is not ours is never touched.
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { log, logError } from "./log.js"

const MARKER = "ObjectExplorer shell command"

// command: what runs this binary — [executable] from the binary, [node, main.js] from sources
export default function ShellCommand(options) {
	const { command } = options
	const shimPath = shimPathFor(process.platform)
	let lastError = ""

	return { status, install, uninstall, refresh }

	function status() {
		const current = readShim()
		return {
			name: "oe",
			path: shimPath,
			installed: current !== null && current.includes(MARKER),
			foreign: current !== null && current.includes(MARKER) === false,
			error: lastError,
		}
	}

	function install() {
		const current = readShim()
		if (current !== null && current.includes(MARKER) === false) {
			lastError = `${shimPath} already exists and is not ObjectExplorer's; remove it first`
		}
		else {
			lastError = ""
			try {
				writeShim(shimText(command))
				log("shell command installed:", shimPath)
			}
			catch (error) {
				logError("shell command install failed:", error)
				lastError = String(error.message ?? error)
			}
		}
		return status()
	}

	function uninstall() {
		const current = readShim()
		if (current !== null && current.includes(MARKER)) {
			lastError = ""
			try {
				removeShim()
				log("shell command removed:", shimPath)
			}
			catch (error) {
				logError("shell command removal failed:", error)
				lastError = String(error.message ?? error)
			}
		}
		else {
			// nothing of ours to remove
		}
		return status()
	}

	// at start: an installed script that names another binary is pointed at this one, when that
	// needs no prompt
	function refresh() {
		const current = readShim()
		const wanted = shimText(command)
		if (current !== null && current.includes(MARKER) && current !== wanted && isWritable(path.dirname(shimPath))) {
			try {
				fs.writeFileSync(shimPath, wanted, { mode: 0o755 })
				log("shell command pointed at this binary:", shimPath)
			}
			catch (error) {
				logError("shell command refresh failed:", error)
			}
		}
		else {
			// not installed, already right, or behind a prompt
		}
	}

	function readShim() {
		try {
			return fs.readFileSync(shimPath, "utf8")
		}
		catch (error) {
			return null
		}
	}

	function writeShim(text) {
		const folder = path.dirname(shimPath)
		if (process.platform === "darwin" && isWritable(folder) === false) {
			const staged = path.join(os.tmpdir(), `objectexplorer-oe-${process.pid}`)
			fs.writeFileSync(staged, text, { mode: 0o755 })
			asAdministrator(`mkdir -p ${quote(folder)} && cp ${quote(staged)} ${quote(shimPath)} && chmod 755 ${quote(shimPath)}`)
			fs.rmSync(staged, { force: true })
		}
		else {
			fs.mkdirSync(folder, { recursive: true })
			fs.writeFileSync(shimPath, text, { mode: 0o755 })
		}
	}

	function removeShim() {
		if (process.platform === "darwin" && isWritable(path.dirname(shimPath)) === false) {
			asAdministrator(`rm -f ${quote(shimPath)}`)
		}
		else {
			fs.rmSync(shimPath, { force: true })
		}
	}
}

function shimPathFor(platform) {
	if (platform === "darwin") {
		return "/usr/local/bin/oe"
	}
	else if (platform === "win32") {
		const localAppData = process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local")
		return path.join(localAppData, "Microsoft", "WindowsApps", "oe.cmd")
	}
	else {
		return path.join(os.homedir(), ".local", "bin", "oe")
	}
}

// The binary is gui-subsystem on Windows: it has no console of its own to print into, but it does
// write into a pipe, so its output is piped through findstr to reach the terminal.
function shimText(command) {
	if (process.platform === "win32") {
		const run = command.map((part) => `"${part}"`).join(" ")
		return `@echo off\r\nrem ${MARKER}\r\n${run} cli %* 2>&1 | findstr "^"\r\n`
	}
	else {
		const run = command.map(quote).join(" ")
		return `#!/bin/sh\n# ${MARKER}\nexec ${run} cli "$@"\n`
	}
}

function isWritable(folder) {
	try {
		fs.accessSync(folder, fs.constants.W_OK)
		return true
	}
	catch (error) {
		return false
	}
}

// the system's own password prompt; cancelling it is an error with the reason macOS gives
function asAdministrator(script) {
	const appleScript = `do shell script "${script.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}" with administrator privileges`
	execFileSync("/usr/bin/osascript", ["-e", appleScript], { stdio: "pipe" })
}

function quote(text) {
	return `'${String(text).replace(/'/g, `'\\''`)}'`
}
