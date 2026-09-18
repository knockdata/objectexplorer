// The bundle step, built from the source next door instead of downloaded from npm.
//
// `npm run build` embeds whatever @knockdata/objectexplorer the registry is serving, which is the
// right thing for a release and the wrong thing while working on the app: the binary comes out
// carrying the last published version and none of the changes being tested. This builds rock2's
// objectexplorer package the way publish.sh does, packs it, and hands that tarball to the same
// npm-bundle.mjs the release uses — so everything downstream, sea.mjs included, is unchanged.
//
//   npm run build:dev                 the source beside this repo, ~/git/rock2
//   ROCK2_DIR=/some/where npm run build:dev
//
// Only the app comes from source. @knockdata/duckdb and @knockdata/sqlite are still downloaded,
// pinned to the versions the local package.json names — they are built in their own repos and
// nothing here compiles them.
//
// Nothing about this is a release: no version is mirrored from package.json, no source-map or
// boot checks run, nothing is uploaded and nothing is tagged. publish.sh in rock2 is still the
// only way a candidate leaves the machine.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { downloadBundle } from "./npm-bundle.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await bundleLocal()
}

// rock2 sits beside this repo, the same way rock2's own build.sh looks for ../../release
function sourceDir() {
	const given = process.env.ROCK2_DIR || path.join(path.dirname(root), "rock2")
	const packageDir = path.join(given, "objectexplorer")
	if (fs.existsSync(path.join(packageDir, "build.sh"))) {
		return packageDir
	}
	else {
		throw new Error(`no objectexplorer/build.sh under ${given} — clone rock2 beside this repo, or set ROCK2_DIR`)
	}
}

export async function bundleLocal() {
	const packageDir = sourceDir()
	const manifest = JSON.parse(fs.readFileSync(path.join(packageDir, "package.json"), "utf8"))
	console.log("source:", packageDir, manifest.name, manifest.version)

	// the app's own build: vite for app/, esbuild for server/. RELEASE_DIR is how it finds the
	// release notes, and it is this repo
	execFileSync("bash", ["build.sh"], { cwd: packageDir, stdio: "inherit", env: { ...process.env, RELEASE_DIR: root } })

	const packDir = path.join(packageDir, "out")
	fs.mkdirSync(packDir, { recursive: true })
	const packed = path.join(packDir, "objectexplorer-local.tgz")
	fs.rmSync(packed, { force: true })
	const named = execFileSync("npm", ["pack", "--pack-destination", packDir, "--silent"], { cwd: packageDir, encoding: "utf8" }).trim()
	fs.renameSync(path.join(packDir, named), packed)
	console.log("packed:", packed, fs.statSync(packed).size, "bytes")

	return await downloadBundle({ tarball: packed })
}
