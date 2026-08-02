// Over-the-air updates from the npm registry.
//
// Runs in the server worker, not on the main thread: by the time the window is up the main
// thread is inside webview_run and will never run another timer or promise.
//
// A newer bundle is downloaded to its own folder and picked up on the next launch. Nothing
// is swapped mid-session — the running server keeps serving the folder it started with.
import { fetchUntar } from "./tar.js"
import { packageName, ffmpegName, bundleDirFor, isValidBundle, isNewer, newestBundle, versionOf, ffmpegDirFor, isValidFfmpeg } from "./bundle.js"
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
		await fetchFfmpeg(latest.ffmpegVersion)
	} else {
		log("no update: current", current, "latest", latest && latest.version)
	}
}

// A newer bundle can want a different @ffmpeg/core than the one embedded in the binary. It is
// downloaded into its own version folder next to the new bundle, which the next launch picks
// up; the running session keeps serving what it started with, same as the bundle itself.
async function fetchFfmpeg(version) {
	const destDir = version ? ffmpegDirFor(version) : null
	if (destDir && !isValidFfmpeg(destDir)) {
		log("bundle wants a different ffmpeg:", version, "->", destDir)
		const core = await fetchPackage(ffmpegName, version)
		if (core) {
			await fetchUntar(core.tarball, destDir, log)
			log("ffmpeg ready:", isValidFfmpeg(destDir))
		}
	} else {
		log("no ffmpeg update:", version)
	}
}

async function fetchLatest() {
	const latest = await fetchPackage(packageName, "latest")
	if (latest) {
		// the pin is exact; a range prefix ("^0.12.10") would be stripped here
		const ffmpegVersion = String(latest.dependencies[ffmpegName] ?? "").replace(/^[^0-9]*/, "")
		return { ...latest, ffmpegVersion }
	} else {
		return null
	}
}

async function fetchPackage(name, tag) {
	// the npm registry API needs the scope's "/" percent-encoded: @scope%2Fname
	const url = `${registryUrl}/${name.replace("/", "%2F")}/${tag}`
	log("registry:", url)
	try {
		const response = await fetch(url)
		const doc = await response.json()
		if (doc && doc.version && doc.dist && doc.dist.tarball) {
			return { version: doc.version, tarball: doc.dist.tarball, dependencies: doc.dependencies ?? {} }
		} else {
			return null
		}
	} catch (error) {
		logError("registry request failed:", error)
		return null
	}
}
