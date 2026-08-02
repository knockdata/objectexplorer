// Combines the per-arch store packages into the one file Partner Center takes.
//
//   dist/store/ObjectExplorer-0.3.11-x64.msix     \
//                                                  ->  dist/ObjectExplorer-0.3.11.msixbundle
//   dist/store/ObjectExplorer-0.3.11-arm64.msix   /
//
// One submission then serves both architectures, and an arm64 machine installs the native build
// instead of running the x64 one under emulation. makeappx only bundles packages that share an
// identity and a version, which holds because .github/set-version.sh stamps the same version
// into both matrix legs before either builds.
//
// Only the store variant is bundled. The direct packages ship per arch on the releases page,
// next to the per-arch .exe, so a download is one architecture rather than both.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { findSdkTool, storeDir } from "./msix.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(root, "dist")
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version
const appName = "ObjectExplorer"

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	bundleMsix()
}

export function bundleMsix() {
	const packages = fs.existsSync(storeDir) ? fs.readdirSync(storeDir).filter((name) => name.endsWith(".msix")) : []

	if (packages.length > 0) {
		const bundle = path.join(distDir, `${appName}-${version}.msixbundle`)
		// /bv, or makeappx gives the bundle version 0.0.0.0 and the Store rejects it as older
		// than whatever is already published
		execFileSync(findSdkTool("makeappx.exe"), ["bundle", "/d", storeDir, "/p", bundle, "/bv", `${version}.0`, "/o"], { stdio: "inherit" })
		console.log("dist:", bundle, "-", packages.join(", "))
	} else {
		throw new Error(`no .msix in ${storeDir} — run npm run msix:store on each arch first, or download the store-msix-* artifacts there`)
	}
}
