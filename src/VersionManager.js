// What "Check for Updates" reads and drives, handed to the backend as `versionManager` so the
// dialog can reach it over http like everything else.
//
// Two steps, deliberately apart: check asks the registry and downloads nothing, upgrade
// downloads. Neither swaps anything in the running session — bundle.js picks the newest folder
// at launch and the server then serves that one folder for the whole session — so every answer
// carries restartRequired, and the dialog says so out loud.
//
// The engines are simpler than the bundle: resolveFfmpegDir/resolveDuckdbDir/resolveSqliteDir
// always return the version embedded in this binary, so what is running is the version.js
// constant, and a downloaded newer one is only ever "ready", never live.
import { versionOf, newestBundle, isNewer, ffmpegDirFor, isValidFfmpeg, duckdbDirFor, isValidDuckdb, sqliteDirFor, isValidSqlite } from "./bundle.js"
import { fetchLatest, downloadUpdate } from "./update.js"
import { ffmpegVersion, duckdbVersion, sqliteVersion } from "./version.js"
import { log, logError } from "./log.js"

export default function VersionManager({ bundleDir }) {
	// the folder this session is actually serving, not the newest one on disk
	const running = versionOf(bundleDir)
	let latest = null
	let checkedAt = null
	let error = ""

	return { getStatus, check, upgrade }

	// Never touches the network: the dialog opens on this, then calls check.
	function getStatus() {
		const ready = readyBundle()
		const target = ready ?? running
		return {
			host: "desktop",
			running,
			ready,
			latest: latest && latest.version,
			upgradable: Boolean(latest && isNewer(latest.version, target)),
			restartRequired: ready !== null,
			command: "",
			checkedAt,
			error,
			components: components(ready),
		}
	}

	async function check() {
		latest = await fetchLatest()
		checkedAt = new Date().toISOString()
		if (latest) {
			error = ""
			log("checked for updates: running", running, "latest", latest.version)
		} else {
			error = "The npm registry could not be reached."
			logError("checked for updates: the registry answered nothing")
		}
		return getStatus()
	}

	async function upgrade() {
		if (latest) {
			// the dialog checked when it opened, so this is the version the user saw
		} else {
			await check()
		}

		const target = readyBundle() ?? running
		if (latest && isNewer(latest.version, target)) {
			try {
				await downloadUpdate(latest)
				error = ""
			} catch (failure) {
				logError("upgrade failed:", failure)
				error = String(failure.message ?? failure)
			}
		} else {
			log("nothing to upgrade: running", running, "ready", readyBundle(), "latest", latest && latest.version)
		}
		return getStatus()
	}

	// A bundle downloaded by an earlier session or by the button below, waiting for a restart.
	function readyBundle() {
		const newest = versionOf(newestBundle())
		if (isNewer(newest, running)) {
			return newest
		} else {
			return null
		}
	}

	// One row per thing that carries its own version, in the order a user cares about them.
	function components(readyVersion) {
		const rows = [
			{ name: "ObjectExplorer", running, latest: latest && latest.version, ready: readyVersion },
			{ name: "duckdb", running: duckdbVersion, latest: latest && latest.duckdbVersion, ready: readyEngine(latest && latest.duckdbVersion, duckdbVersion, duckdbDirFor, isValidDuckdb) },
			{ name: "sqlite", running: sqliteVersion, latest: latest && latest.sqliteVersion, ready: readyEngine(latest && latest.sqliteVersion, sqliteVersion, sqliteDirFor, isValidSqlite) },
			{ name: "ffmpeg", running: ffmpegVersion, latest: latest && latest.ffmpegVersion, ready: readyEngine(latest && latest.ffmpegVersion, ffmpegVersion, ffmpegDirFor, isValidFfmpeg) },
		]
		return rows.map(row => ({ ...row, state: stateOf(row) }))
	}

	// Downloaded and complete on disk, but a version this session did not start with.
	function readyEngine(wanted, current, dirFor, isValid) {
		if (wanted && isNewer(wanted, current) && isValid(dirFor(wanted))) {
			return wanted
		} else {
			return null
		}
	}
}

// The one word each row carries. "unknown" is before the first check answered.
function stateOf(row) {
	if (row.ready) {
		return "ready"
	} else if (row.latest && isNewer(row.latest, row.running)) {
		return "available"
	} else if (row.latest) {
		return "current"
	} else {
		return "unknown"
	}
}
