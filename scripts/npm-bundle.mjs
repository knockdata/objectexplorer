// Downloads the latest @knockdata/objectexplorer tarball into out/objectexplorer.tgz so
// scripts/sea.mjs can embed it. The version is written to out/bundle.json and baked into the
// binary as BUNDLE_VERSION, which is how the first run knows what it just unpacked.
//
// @ffmpeg/core, @knockdata/duckdb and @knockdata/sqlite are downloaded the same way, into
// out/ffmpeg-core.tgz, out/<engine>.tgz and out/<engine>-native.tgz. They are dependencies of
// the package rather than files inside it (that 32 MB wasm used to be two thirds of the
// tarball), and the binary has no npm to install dependencies with, so the build fetches them.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { targetPlatform, targetArch } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "out")
const packageName = "@knockdata/objectexplorer"
const ffmpegName = "@ffmpeg/core"
const duckdbName = "@knockdata/duckdb"
const sqliteName = "@knockdata/sqlite"

// the npm registry API needs the scope's "/" percent-encoded: @scope%2Fname
function registryUrl(name, tag) {
	return `https://registry.npmjs.org/${name.replace("/", "%2F")}/${tag}`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await downloadBundle()
}

// A registry request on a CI runner can stall forever, so every one of them gets a timeout and
// is retried. The timeout covers reading the body too, which is where the tarball download hung.
async function fetchRetry(url, read) {
	const attempts = 5
	let value
	let error
	for (let attempt = 1; attempt <= attempts; attempt++) {
		if (value === undefined) {
			try {
				const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
				if (response.ok) {
					value = await read(response)
				} else {
					throw new Error(`HTTP ${response.status}`)
				}
			} catch (failure) {
				error = failure
				console.log(`attempt ${attempt}/${attempts} failed for ${url}: ${failure.message}`)
				await new Promise(done => setTimeout(done, 2000 * attempt))
			}
		}
	}
	if (value === undefined) {
		throw error
	} else {
		return value
	}
}

export async function downloadBundle() {
	fs.mkdirSync(outDir, { recursive: true })

	const latest = await fetchRetry(registryUrl(packageName, "latest"), response => response.json())
	console.log("latest", packageName, latest.version)

	const tarball = Buffer.from(await fetchRetry(latest.dist.tarball, response => response.arrayBuffer()))
	fs.writeFileSync(path.join(outDir, "objectexplorer.tgz"), tarball)
	console.log("bundle:", tarball.length, "bytes")

	const ffmpegVersion = await downloadFfmpeg(latest)
	const duckdbVersion = await downloadEngine(latest, duckdbName, "duckdb")
	const sqliteVersion = await downloadEngine(latest, sqliteName, "sqlite")
	fs.writeFileSync(path.join(outDir, "bundle.json"), JSON.stringify({ version: latest.version, ffmpegVersion, duckdbVersion, sqliteVersion }, null, "\t"))
	return latest.version
}

// The version comes from the package's own dependencies, so the binary always carries the
// exact core the app was built against. The registry document already holds them, so nothing
// has to be untarred to read it. The pin is exact; a range prefix would be stripped here.
async function downloadFfmpeg(latest) {
	const dependencies = latest.dependencies ?? {}
	const version = String(dependencies[ffmpegName] ?? "").replace(/^[^0-9]*/, "")
	if (version) {
		const core = await fetchRetry(registryUrl(ffmpegName, version), response => response.json())
		const tarball = Buffer.from(await fetchRetry(core.dist.tarball, response => response.arrayBuffer()))
		fs.writeFileSync(path.join(outDir, "ffmpeg-core.tgz"), tarball)
		console.log("ffmpeg:", ffmpegName, version, tarball.length, "bytes")
		return version
	}
	else {
		throw new Error(`${packageName}@${latest.version} does not depend on ${ffmpegName}`)
	}
}

// An engine takes two hops: the app names @knockdata/<engine>, and that package's own
// optionalDependencies name the per-platform addon. Both tarballs are downloaded — the
// universal one carries the wasm, the platform one carries the .node — and both unpack into a
// single folder at runtime, since the tar reader drops the leading "package/" segment.
// Nothing is compiled here: the engines are built in knockdata/duckdb and knockdata/sqlite,
// and only when upstream is bumped.
async function downloadEngine(latest, name, localName) {
	const dependencies = latest.dependencies ?? {}
	const version = String(dependencies[name] ?? "").replace(/^[^0-9]*/, "")
	if (version) {
		const universal = await fetchRetry(registryUrl(name, version), response => response.json())
		const tarball = Buffer.from(await fetchRetry(universal.dist.tarball, response => response.arrayBuffer()))
		fs.writeFileSync(path.join(outDir, `${localName}.tgz`), tarball)
		console.log(`${localName}:`, name, version, tarball.length, "bytes")

		const nativeName = `${name}-${targetPlatform}-${targetArch}`
		const nativeVersion = String((universal.optionalDependencies ?? {})[nativeName] ?? "").replace(/^[^0-9]*/, "")
		if (nativeVersion) {
			const native = await fetchRetry(registryUrl(nativeName, nativeVersion), response => response.json())
			const nativeTarball = Buffer.from(await fetchRetry(native.dist.tarball, response => response.arrayBuffer()))
			fs.writeFileSync(path.join(outDir, `${localName}-native.tgz`), nativeTarball)
			console.log(`${localName} addon:`, nativeName, nativeVersion, nativeTarball.length, "bytes")
		}
		else {
			// no addon for this target is survivable — the app falls back to the wasm
			console.log(`${localName} addon: none published for`, nativeName, "- the wasm will be used")
			fs.rmSync(path.join(outDir, `${localName}-native.tgz`), { force: true })
		}
		return version
	}
	else {
		throw new Error(`${packageName}@${latest.version} does not depend on ${name}`)
	}
}

export function bundleVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).version
}

export function ffmpegVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).ffmpegVersion
}

export function duckdbVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).duckdbVersion
}

export function sqliteVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).sqliteVersion
}

// whether this build got a native addon; sea.mjs only registers the asset when it exists
export function hasDuckdbAddon() {
	return fs.existsSync(path.join(outDir, "duckdb-native.tgz"))
}

export function hasSqliteAddon() {
	return fs.existsSync(path.join(outDir, "sqlite-native.tgz"))
}
