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

export async function downloadBundle() {
	fs.mkdirSync(outDir, { recursive: true })

	// the npm registry API needs the scope's "/" percent-encoded: @scope%2Fname
	const latest = await (await fetch(`https://registry.npmjs.org/${packageName.replace("/", "%2F")}/latest`)).json()
	console.log("latest", packageName, latest.version)

	const tarball = Buffer.from(await (await fetch(latest.dist.tarball)).arrayBuffer())
	fs.writeFileSync(path.join(outDir, "objectexplorer.tgz"), tarball)
	fs.writeFileSync(path.join(outDir, "bundle.json"), JSON.stringify({ version: latest.version }, null, "\t"))
	console.log("bundle:", tarball.length, "bytes")
	return latest.version
}

export function bundleVersion() {
	return JSON.parse(fs.readFileSync(path.join(outDir, "bundle.json"), "utf8")).version
}
