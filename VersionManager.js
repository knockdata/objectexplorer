// Over-the-air updates from the npm registry.
//
// The app ships the objectexplorer package inside the installer (node_modules, unpacked
// from the asar). At runtime this checks the registry for a newer version, downloads the
// tarball into <userData>/.app/objectexplorer-<version> and hands the folder to the shell,
// which swaps to it the next time the window goes to background. The demo dataset ships
// inside the objectexplorer package itself (demo/ next to server/ and app/), so it updates
// along with the rest of the bundle; when a bundle has no demo/ folder the backend proxies
// demo requests to objectexplorer.com.
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fetchUntar } from "./Tar.js";
import { readJson, writeJson, fetchJson } from "./util.js";

const registryUrl = "https://registry.npmjs.org";
const npmPackage = "@knockdata/objectexplorer";
// local OTA folders can't contain the npm package's "/" scope separator, so they're named
// from this filesystem-safe prefix instead
const localName = "objectexplorer";

export default async function VersionManager({ userData, packageDir, logger }) {
	const rootDir = path.join(userData, ".app");
	const versionsFile = path.join(rootDir, "versions.json");
	const shippedVersion = readShippedVersion();

	function readShippedVersion() {
		const packageFile = path.join(packageDir, "package.json");
		if (fs.existsSync(packageFile)) {
			const content = JSON.parse(fs.readFileSync(packageFile, "utf8"));
			return content.version;
		} else {
			return null;
		}
	}

	// a usable bundle has both the backend bundle and the built frontend entry
	function isValidBundle(dir) {
		return fs.existsSync(path.join(dir, "server", "WebServer.mjs")) && fs.existsSync(path.join(dir, "app", "index.html"));
	}

	logger.log("VersionManager rootDir:", rootDir);
	logger.log("VersionManager packageDir:", packageDir, "version:", shippedVersion);

	await fsp.mkdir(rootDir, { recursive: true });

	const versions = await readJson(versionsFile, {});
	dropLegacyVersions(versions);
	logger.log("VersionManager versions:", JSON.stringify(versions));

	await scan("appVersion", localName);

	// set when checkUpdate downloads a genuinely newer bundle this session, so the shell can
	// swap to it the next time the window goes to background
	let pendingBundleDir = null;

	// network path, run in the background after the server is already serving the local
	// package. on a successful newer download, record the new bundle dir instead of blocking.
	async function checkUpdate() {
		const app = await fetchLatest(npmPackage);
		// the installed version wins over a stale download, so an installer upgrade never
		// gets shadowed by an older OTA folder
		const currentApp = newerVersion(shippedVersion, versions.appVersion);
		if (app && isNewer(app.version, currentApp)) {
			const downloaded = await download(app);
			if (downloaded) {
				versions.appVersion = app.version;
				await writeJson(versionsFile, versions);
				if (isValidBundle(bundleDirFor(app.version))) {
					pendingBundleDir = bundleDirFor(app.version);
				}
			}
		}
	}

	async function fetchLatest(packageName) {
		// npm registry API needs the scope's "/" percent-encoded: @scope%2Fname
		const url = `${registryUrl}/${packageName.replace("/", "%2F")}/latest`;
		logger.log("Fetching registry version from:", url);
		const latest = await fetchJson(url);
		if (latest && latest.version && latest.dist && latest.dist.tarball) {
			logger.log(packageName, "latest:", latest.version);
			return { version: latest.version, tarball: latest.dist.tarball };
		} else {
			return null;
		}
	}

	async function download(latest) {
		const destDir = path.join(rootDir, `${localName}-${latest.version}`);
		const exists = await fsp.stat(destDir).catch(() => null);
		if (exists) {
			logger.log("Release already exists: " + destDir);
			return true;
		} else {
			return fetchUntar(latest.tarball, destDir, logger.log);
		}
	}

	function bundleDirFor(version) {
		return path.join(rootDir, `${localName}-${version}`);
	}

	function getPendingBundleDir() {
		return pendingBundleDir;
	}

	// recover the version from the folders on disk when versions.json is missing or wiped
	async function scan(key, packageName) {
		if (versions[key]) {
		} else {
			const entries = await fsp.readdir(rootDir).catch(() => []);
			const folders = entries.filter(function (entry) {
				return entry.startsWith(`${packageName}-`);
			});
			let found = null;
			for (const folder of folders) {
				found = newerVersion(found, folder.slice(packageName.length + 1));
			}
			if (found) {
				versions[key] = found;
				await writeJson(versionsFile, versions);
			}
		}
	}

	// the bundle dir holds the npm package layout: server/WebServer.mjs, app/, package.json.
	// use a downloaded copy only when it is genuinely newer than the shipped package and
	// valid; otherwise always fall back to the installed package so the app loads offline.
	function getBundleDir() {
		const otaVersion = versions.appVersion;
		const otaDir = otaVersion ? bundleDirFor(otaVersion) : null;
		const useOta = otaDir && isNewer(otaVersion, shippedVersion) && isValidBundle(otaDir);
		logger.log("getBundleDir shipped:", shippedVersion, "ota:", otaVersion, "->", useOta ? otaDir : packageDir);
		if (useOta) {
			return otaDir;
		} else {
			return packageDir;
		}
	}

	function getStatus() {
		return versions;
	}

	return {
		getBundleDir,
		getPendingBundleDir,
		checkUpdate,
		rootDir,
		getStatus,
	};
}

// installs from before the npm switch recorded release dates ("2026-07-22") and folders in
// the old bundle layout; those would outrank every npm version, so forget them and let the
// registry check start over.
function dropLegacyVersions(versions) {
	for (const key of Object.keys(versions)) {
		const isSemver = /^\d+\.\d+\.\d+/.test(String(versions[key]));
		if (isSemver) {
		} else {
			delete versions[key];
		}
	}
}

// npm versions are numeric dotted triples; "0.10.0" must beat "0.9.0", which a string
// comparison gets wrong
export function isNewer(version, other) {
	if (version && other) {
		return compareVersion(version, other) > 0;
	} else {
		return Boolean(version);
	}
}

export function newerVersion(version, other) {
	if (isNewer(other, version)) {
		return other;
	} else {
		return version;
	}
}

function compareVersion(version, other) {
	const left = numbers(version);
	const right = numbers(other);
	let result = 0;
	for (let index = 0; index < 3; index++) {
		if (result === 0) {
			result = (left[index] || 0) - (right[index] || 0);
		}
	}
	return result;
}

function numbers(version) {
	// drop any prerelease/build suffix: "1.2.3-beta.1" compares as 1.2.3
	return String(version).split("-")[0].split(".").map(Number);
}
