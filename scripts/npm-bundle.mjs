// Downloads the latest @knockdata/objectexplorer tarball into out/objectexplorer.tgz so
// scripts/sea.mjs can embed it. The version is written to out/bundle.json and baked into the
// binary as BUNDLE_VERSION, which is how the first run knows what it just unpacked.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "out")
const packageName = "@knockdata/objectexplorer"

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

	// the npm registry API needs the scope's "/" percent-encoded: @scope%2Fname
	const latest = await fetchRetry(`https://registry.npmjs.org/${packageName.replace("/", "%2F")}/latest`, response => response.json())
	console.log("latest", packageName, latest.version)

	const tarball = Buffer.from(await fetchRetry(latest.dist.tarball, response => response.arrayBuffer()))
	fs.writeFileSync(path.join(outDir, "objectexplorer.tgz"), tarball)
	fs.writeFileSync(path.join(outDir, "bundle.json"), JSON.stringify({ version: latest.version }, null, "\t"))
	console.log("bundle:", tarball.length, "bytes")
	return latest.version
}

export function bundleVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).version
}
