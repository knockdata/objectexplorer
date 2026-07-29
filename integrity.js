// Does the installed app still have all the files it shipped with?
//
// Windows Defender has quarantined binaries out of this app's install directory before
// (0.2.1 left a folder with no ObjectExplorer.exe in it, see RELEASE.md). From inside the
// app that looks like an unexplained crash, or nothing at all. scripts/afterPack.cjs records
// what was packaged; this compares that list against disk so a missing file is named.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { app } from "electron";

export const manifestName = "package-files.json";

// Electron replaces fs so that paths inside app.asar look like a directory tree, which makes
// statSync on the archive itself report 0 bytes. original-fs is the same module without that
// interception, and is the only way to see the real file the installer wrote.
const require = createRequire(import.meta.url);
const realFs = loadOriginalFs();

function loadOriginalFs() {
	try {
		return require("original-fs");
	} catch (error) {
		return fs;
	}
}

// paths in the manifest are relative to the directory holding resources/ — the install
// directory on Windows and Linux, Contents on macOS — so build and runtime agree without
// per-platform special cases
function installRoot() {
	return path.dirname(process.resourcesPath);
}

export function checkIntegrity() {
	const problems = [];
	if (app.isPackaged === false) {
		return { summary: "skipped (not packaged)", problems, checked: 0 };
	}

	const manifestPath = path.join(process.resourcesPath, manifestName);
	let manifest = null;
	try {
		manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
	} catch (error) {
		return { summary: `no manifest at ${manifestPath}`, problems, checked: 0 };
	}

	const root = installRoot();
	for (const entry of manifest.files) {
		const filePath = path.join(root, entry.path);
		let stat = null;
		try {
			stat = realFs.statSync(filePath);
		} catch (error) {
			stat = null;
		}
		if (stat === null) {
			problems.push(`MISSING ${entry.path} (${entry.size} bytes at build time)`);
		} else {
			if (stat.size !== entry.size) {
				problems.push(`CHANGED ${entry.path} — ${entry.size} bytes at build time, ${stat.size} now`);
			}
		}
	}

	const summary = problems.length === 0
		? `ok — all ${manifest.files.length} packaged files present in ${root}`
		: `${problems.length} of ${manifest.files.length} packaged files missing or changed in ${root}`;
	return { summary, problems, checked: manifest.files.length };
}
