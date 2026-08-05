// Downloads the latest @knockdata/objectexplorer tarball into out/objectexplorer.tgz so
// scripts/sea.mjs can embed it. The version is written to out/bundle.json and baked into the
// binary as BUNDLE_VERSION, which is how the first run knows what it just unpacked.
//
// @ffmpeg/core and @knockdata/duckdb are downloaded the same way, into out/ffmpeg-core.tgz,
// out/duckdb.tgz and out/duckdb-native.tgz. They are dependencies of the package rather than
// files inside it (that 32 MB wasm used to be two thirds of the tarball), and the binary has
// no npm to install dependencies with, so the build fetches them too.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { targetPlatform, targetArch } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "out")
const packageName = "@knockdata/objectexplorer"
const ffmpegName = "@ffmpeg/core"
const duckdbName = "@knockdata/duckdb"

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
	const duckdbVersion = await downloadDuckdb(latest)
	fs.writeFileSync(path.join(outDir, "bundle.json"), JSON.stringify({ version: latest.version, ffmpegVersion, duckdbVersion }, null, "\t"))
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

// duckdb takes two hops: the app names @knockdata/duckdb, and that package's own
// optionalDependencies name the per-platform addon. Both tarballs are downloaded — the
// universal one carries wasm/duckdb.wasm, the platform one carries duckdb_napi.node — and
// both unpack into a single folder at runtime, since the tar reader drops the leading
// "package/" segment. Nothing is compiled here: the engine is built in knockdata/duckdb,
// where a cold cmake run costs 15-40 minutes and happens only when upstream is bumped.
async function downloadDuckdb(latest) {
	const dependencies = latest.dependencies ?? {}
	const version = String(dependencies[duckdbName] ?? "").replace(/^[^0-9]*/, "")
	if (version) {
		const universal = await fetchRetry(registryUrl(duckdbName, version), response => response.json())
		const tarball = Buffer.from(await fetchRetry(universal.dist.tarball, response => response.arrayBuffer()))
		fs.writeFileSync(path.join(outDir, "duckdb.tgz"), tarball)
		console.log("duckdb:", duckdbName, version, tarball.length, "bytes")

		const nativeName = `${duckdbName}-${targetPlatform}-${targetArch}`
		const nativeVersion = String((universal.optionalDependencies ?? {})[nativeName] ?? "").replace(/^[^0-9]*/, "")
		if (nativeVersion) {
			const native = await fetchRetry(registryUrl(nativeName, nativeVersion), response => response.json())
			const nativeTarball = Buffer.from(await fetchRetry(native.dist.tarball, response => response.arrayBuffer()))
			fs.writeFileSync(path.join(outDir, "duckdb-native.tgz"), nativeTarball)
			console.log("duckdb addon:", nativeName, nativeVersion, nativeTarball.length, "bytes")
		}
		else {
			// no addon for this target is survivable — the app falls back to the wasm
			console.log("duckdb addon: none published for", nativeName, "- the wasm will be used")
			fs.rmSync(path.join(outDir, "duckdb-native.tgz"), { force: true })
		}
		return version
	}
	else {
		throw new Error(`${packageName}@${latest.version} does not depend on ${duckdbName}`)
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

// whether this build got a native addon; sea.mjs only registers the asset when it exists
export function hasDuckdbAddon() {
	return fs.existsSync(path.join(outDir, "duckdb-native.tgz"))
}
