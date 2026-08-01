// Over-the-air updates from the npm registry.
//
// Runs in the server worker, not on the main thread: by the time the window is up the main
// thread is inside webview_run and will never run another timer or promise.
//
// A newer bundle is downloaded to its own folder and picked up on the next launch. Nothing
// is swapped mid-session — the running server keeps serving the folder it started with.
import { fetchUntar } from "./tar.js"
import { packageName, bundleDirFor, isValidBundle, isNewer, newestBundle, versionOf } from "./bundle.js"
import { log, logError } from "./log.js"

const registryUrl = "https://registry.npmjs.org"

export async function checkUpdate() {
	const latest = await fetchLatest()
	const current = versionOf(newestBundle())

	if (latest && isNewer(latest.version, current)) {
		const destDir = bundleDirFor(latest.version)
		log("newer bundle available:", latest.version, "->", destDir)
		await fetchUntar(latest.tarball, destDir, log)
		log("update ready, will be used on next launch:", isValidBundle(destDir))
	} else {
		log("no update: current", current, "latest", latest && latest.version)
	}
}

async function fetchLatest() {
	// the npm registry API needs the scope's "/" percent-encoded: @scope%2Fname
	const url = `${registryUrl}/${packageName.replace("/", "%2F")}/latest`
	log("checking for updates:", url)
	try {
		const response = await fetch(url)
		const latest = await response.json()
		if (latest && latest.version && latest.dist && latest.dist.tarball) {
			return { version: latest.version, tarball: latest.dist.tarball }
		} else {
			return null
		}
	} catch (error) {
		logError("update check failed:", error)
		return null
	}
}
