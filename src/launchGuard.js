// The debounce against Windows' install-time double launch; see below for why it is not a lock.
import fs from "node:fs"
import { launchGuardFile } from "./paths.js"

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
export const launchGuardWindowMs = 3000

export function isDuplicateLaunch() {
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
