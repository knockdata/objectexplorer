// Downloads the latest @knockdata/objectexplorer tarball into out/objectexplorer.tgz so
// scripts/sea.mjs can embed it. The version is written to out/bundle.json and baked into the
// binary as BUNDLE_VERSION, which is how the first run knows what it just unpacked.
//
// @ffmpeg/core is downloaded the same way into out/ffmpeg-core.tgz. It is a dependency of the
// package rather than a file inside it (that 32 MB wasm used to be two thirds of the tarball),
// and the binary has no npm to install dependencies with, so the build fetches it too.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "out")
const packageName = "@knockdata/objectexplorer"
const ffmpegName = "@ffmpeg/core"

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
	fs.writeFileSync(path.join(outDir, "bundle.json"), JSON.stringify({ version: latest.version, ffmpegVersion }, null, "\t"))
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

export function bundleVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).version
}

export function ffmpegVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).ffmpegVersion
}
