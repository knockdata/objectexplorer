// Over-the-air updates from the npm registry.
//
// Runs in the server worker, not on the main thread: by the time the window is up the main
// thread is inside webview_run and will never run another timer or promise.
//
// A newer bundle is downloaded to its own folder and picked up on the next launch. Nothing
// is swapped mid-session — the running server keeps serving the folder it started with.
//
// The two halves are separate because the Check for Updates dialog drives them separately:
// it asks the registry when it opens, and downloads only when the user says so. The launch
// does both in a row, through VersionManager.upgrade().
import { fetchUntar } from "./tar.js"
import { packageName, ffmpegName, duckdbName, sqliteName, bundleDirFor, isValidBundle, ffmpegDirFor, isValidFfmpeg, duckdbDirFor, isValidDuckdb, sqliteDirFor, isValidSqlite } from "./bundle.js"
import { log, logError } from "./log.js"

const registryUrl = "https://registry.npmjs.org"

// Downloads the bundle and whatever engines it wants. The caller has already decided this
// version is newer than what is on disk.
export async function downloadUpdate(latest) {
	const destDir = bundleDirFor(latest.version)
	log("newer bundle available:", latest.version, "->", destDir)
	await fetchUntar(latest.tarball, destDir, log)
	log("update ready, will be used on next launch:", isValidBundle(destDir))
	await fetchFfmpeg(latest.ffmpegVersion)
	await fetchDuckdb(latest.duckdbVersion)
	await fetchSqlite(latest.sqliteVersion)
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

// Same story as ffmpeg: a newer bundle can want a newer engine. Only the universal package
// is fetched here — it carries the wasm, which is enough to keep duckdb working. A newer
// native addon arrives with the next full app release, where the SEA embeds it.
async function fetchDuckdb(version) {
	const destDir = version ? duckdbDirFor(version) : null
	if (destDir && !isValidDuckdb(destDir)) {
		log("bundle wants a different duckdb:", version, "->", destDir)
		const duckdb = await fetchPackage(duckdbName, version)
		if (duckdb) {
			await fetchUntar(duckdb.tarball, destDir, log)
			log("duckdb ready:", isValidDuckdb(destDir))
		}
	} else {
		log("no duckdb update:", version)
	}
}

// and the same for sqlite
async function fetchSqlite(version) {
	const destDir = version ? sqliteDirFor(version) : null
	if (destDir && !isValidSqlite(destDir)) {
		log("bundle wants a different sqlite:", version, "->", destDir)
		const sqlite = await fetchPackage(sqliteName, version)
		if (sqlite) {
			await fetchUntar(sqlite.tarball, destDir, log)
			log("sqlite ready:", isValidSqlite(destDir))
		}
	} else {
		log("no sqlite update:", version)
	}
}

export async function fetchLatest() {
	const latest = await fetchPackage(packageName, "latest")
	if (latest) {
		// the pin is exact; a range prefix ("^0.12.10") would be stripped here
		const ffmpegVersion = String(latest.dependencies[ffmpegName] ?? "").replace(/^[^0-9]*/, "")
		const duckdbVersion = String(latest.dependencies[duckdbName] ?? "").replace(/^[^0-9]*/, "")
		const sqliteVersion = String(latest.dependencies[sqliteName] ?? "").replace(/^[^0-9]*/, "")
		return { ...latest, ffmpegVersion, duckdbVersion, sqliteVersion }
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
