// Release extraction: download an npm tarball (.tgz) and unpack it to a directory.
// Self-contained tar reader using node:zlib. Handles the three name forms npm produces:
// plain ustar name, ustar prefix + name, and pax / GNU long-name records for paths longer
// than 100 characters (the explorer's app/assets/* paths hit this).
import fsp from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";

export async function fetchUntar(tarballUrl, destDir, log) {
	log("Downloading " + tarballUrl);
	try {
		const response = await fetch(tarballUrl);
		if (response.ok) {
			const arrayBuffer = await response.arrayBuffer();
			await extractTarToDir(arrayBuffer, destDir);
			log(`Extracted release: ${destDir}`);
			return true;
		} else {
			log("Download failed: " + response.status);
			return false;
		}
	} catch (error) {
		log("Download failed: " + error.message);
		return false;
	}
}

// every npm tarball wraps its content in a single "package/" folder, which is stripped so
// destDir ends up with the package layout itself (package.json, app/, server/, demo/).
export async function extractTarToDir(arrayBuffer, destDir) {
	const data = gunzipSync(Buffer.from(arrayBuffer));
	let position = 0;
	// set by a pax or GNU long-name record, consumed by the entry that follows it
	let pendingName = null;

	while (position + 512 <= data.length) {
		const header = data.subarray(position, position + 512);
		const size = readOctal(header, 124, 12);
		const typeFlag = String.fromCharCode(header[156]);
		const contentStart = position + 512;
		const content = data.subarray(contentStart, contentStart + size);

		if (isEndOfArchive(header)) {
			position = data.length;
		} else {
			if (typeFlag === "L") {
				// GNU long name: this record's content is the next entry's full path
				pendingName = readString(content, 0, content.length);
			} else if (typeFlag === "x" || typeFlag === "X") {
				// pax extended header: "<len> path=<value>\n" records
				pendingName = readPaxPath(content) || pendingName;
			} else if (typeFlag === "g") {
				// global pax header, nothing to apply to a single entry
			} else {
				const name = pendingName || readName(header);
				pendingName = null;
				const isFile = typeFlag === "0" || typeFlag === "\0";
				const relativePath = stripPackagePrefix(name);
				if (isFile && relativePath && isSafePath(relativePath)) {
					const filePath = path.join(destDir, relativePath);
					await fsp.mkdir(path.dirname(filePath), { recursive: true });
					await fsp.writeFile(filePath, content);
				}
			}
			position = contentStart + Math.ceil(size / 512) * 512;
		}
	}
}

// the archive ends with two zero-filled blocks; one is enough to stop reading
function isEndOfArchive(header) {
	return header.every(function (byte) {
		return byte === 0;
	});
}

function readName(header) {
	const name = readString(header, 0, 100);
	const prefix = readString(header, 345, 155);
	if (prefix) {
		return prefix + "/" + name;
	} else {
		return name;
	}
}

function readPaxPath(content) {
	const text = content.toString("utf8");
	const match = text.match(/\d+ path=([^\n]*)\n/);
	if (match) {
		return match[1];
	} else {
		return null;
	}
}

function stripPackagePrefix(name) {
	const separator = name.indexOf("/");
	if (separator >= 0) {
		return name.slice(separator + 1);
	} else {
		return "";
	}
}

// never let an archive write outside destDir
function isSafePath(relativePath) {
	const parts = relativePath.split("/");
	return path.isAbsolute(relativePath) === false && parts.includes("..") === false;
}

function readString(buffer, offset, length) {
	const raw = buffer.subarray(offset, offset + length);
	const end = raw.indexOf(0);
	if (end >= 0) {
		return raw.subarray(0, end).toString("utf8");
	} else {
		return raw.toString("utf8");
	}
}

function readOctal(buffer, offset, length) {
	const text = readString(buffer, offset, length).trim();
	if (text) {
		return parseInt(text, 8) || 0;
	} else {
		return 0;
	}
}
