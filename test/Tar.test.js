// Extract a real npm tarball with Tar.js and compare against system tar.
// Run: npm test
import { execSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { extractTarToDir } from "../Tar.js";

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "tar-test-"));
const packageDir = path.dirname(new URL(import.meta.resolve("@knockdata/objectexplorer/package.json")).pathname);

let failures = 0;
await check("the real objectexplorer package", packageDir);
await check("a package with paths over 100 chars", makeLongPathPackage());

if (failures === 0) {
	fs.rmSync(workDir, { recursive: true, force: true });
} else {
	console.error(`${failures} failures, left ${workDir} for inspection`);
	process.exit(1);
}

// pack the folder with npm, extract it both ways, and require the results to be identical
async function check(label, sourceDir) {
	console.log(`\n${label}: packing ${sourceDir}`);
	const packed = execSync(`npm pack "${sourceDir}" --pack-destination "${workDir}"`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
	const tarball = path.join(workDir, packed.split("\n").at(-1));

	const ourDir = path.join(workDir, "ours-" + path.basename(tarball));
	const systemDir = path.join(workDir, "system-" + path.basename(tarball));
	fs.mkdirSync(ourDir, { recursive: true });
	fs.mkdirSync(systemDir, { recursive: true });

	await extractTarToDir(await fsp.readFile(tarball), ourDir);
	execSync(`tar -xzf "${tarball}" -C "${systemDir}" --strip-components=1`);

	const ours = listFiles(ourDir).sort();
	const system = listFiles(systemDir).sort();
	const longest = ours.reduce((longest, name) => (name.length > longest.length ? name : longest), "");
	console.log(`  ${ours.length} files, longest path ${longest.length} chars: ${longest}`);

	if (ours.join("\n") === system.join("\n")) {
		console.log("  ✓ same file list as system tar");
	} else {
		console.error("  ✗ file list differs");
		console.error("    only ours:", ours.filter((name) => system.includes(name) === false).slice(0, 5));
		console.error("    only system:", system.filter((name) => ours.includes(name) === false).slice(0, 5));
		failures++;
	}

	let differing = 0;
	for (const name of ours) {
		const ourFile = fs.readFileSync(path.join(ourDir, name));
		const systemFile = fs.readFileSync(path.join(systemDir, name));
		if (ourFile.equals(systemFile) === false) {
			console.error("  ✗ content differs:", name);
			differing++;
		}
	}
	if (differing === 0) {
		console.log("  ✓ every file byte-identical");
	} else {
		failures += differing;
	}
}

// npm switches to pax records once a path passes 100 chars, which is the case the ustar
// name+prefix fields alone cannot express
function makeLongPathPackage() {
	const sourceDir = path.join(workDir, "fixture");
	const deep = "assets/" + "a".repeat(60) + "/" + "b".repeat(60);
	fs.mkdirSync(path.join(sourceDir, deep), { recursive: true });
	fs.writeFileSync(path.join(sourceDir, deep, "index.js"), "console.log('deep')\n");
	fs.writeFileSync(path.join(sourceDir, "short.txt"), "short\n");
	fs.writeFileSync(path.join(sourceDir, "package.json"), JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 4));
	return sourceDir;
}

function listFiles(dir) {
	return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)));
}
