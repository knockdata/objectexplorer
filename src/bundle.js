// Where the product itself comes from.
//
// The whole app — backend, built frontend, sqlite wasm, demo data — is the
// @knockdata/objectexplorer npm package. The build embeds that package's tarball in the
// binary (scripts/npm-bundle.mjs), and the first run unpacks it into
// ~/.objectexplorer/.app/objectexplorer-<version>/. Later runs reuse the folder.
//
// update.js then downloads a newer tarball from the registry into a sibling folder, which
// this picks up on the next launch. Both paths extract with the same tar reader.
import fs from "node:fs"
import path from "node:path"
import { extractTarToDir } from "./tar.js"
import { appDir } from "./paths.js"
import { log } from "./log.js"
import { bundleVersion } from "./version.js"

export const packageName = "@knockdata/objectexplorer"
// folder names cannot hold the npm scope's "/", so bundles are named from this prefix
export const localName = "objectexplorer"

export function bundleDirFor(version) {
	return path.join(appDir, `${localName}-${version}`)
}

// a usable bundle has both the backend and the built frontend entry
export function isValidBundle(dir) {
	return fs.existsSync(path.join(dir, "server", "WebServer.mjs")) && fs.existsSync(path.join(dir, "app", "index.html"))
}

// the newest already-extracted bundle on disk, or null when nothing is unpacked yet
export function newestBundle() {
	const entries = fs.readdirSync(appDir).filter((entry) => entry.startsWith(`${localName}-`))
	let newest = null
	for (const entry of entries) {
		const candidate = path.join(appDir, entry)
		if (isValidBundle(candidate) && isNewer(entry.slice(localName.length + 1), versionOf(newest))) {
			newest = candidate
		}
	}
	return newest
}

export function versionOf(dir) {
	if (dir) {
		return path.basename(dir).slice(localName.length + 1)
	} else {
		return null
	}
}

// Resolves the folder to serve, unpacking the embedded tarball when nothing newer is around.
// readAsset is passed in so this file never imports node:sea — the same code runs from plain
// node during development, where the asset comes off disk instead.
export async function resolveBundleDir(readAsset) {
	const embedded = bundleDirFor(bundleVersion)

	if (isValidBundle(embedded)) {
		log("embedded bundle already unpacked:", embedded)
	} else {
		log("unpacking embedded bundle to:", embedded)
		await extractTarToDir(readAsset("objectexplorer.tgz"), embedded)
	}

	// an OTA download from a previous session outranks the embedded copy
	const newest = newestBundle()
	log("serving bundle:", newest)
	return newest
}

// npm versions are numeric dotted triples; "0.10.0" must beat "0.9.0", which a string
// comparison gets wrong
export function isNewer(version, other) {
	if (version && other) {
		return compareVersion(version, other) > 0
	} else {
		return Boolean(version)
	}
}

function compareVersion(version, other) {
	const left = numbers(version)
	const right = numbers(other)
	let result = 0
	for (let index = 0; index < 3; index++) {
		if (result === 0) {
			result = (left[index] || 0) - (right[index] || 0)
		}
	}
	return result
}

function numbers(version) {
	// drop any prerelease/build suffix: "1.2.3-beta.1" compares as 1.2.3
	return String(version).split("-")[0].split(".").map(Number)
}
