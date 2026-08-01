// Combines the per-arch .msix packages into the one file Partner Center takes.
//
//   dist/ObjectExplorer-0.3.10-x64.msix     \
//                                            ->  dist/ObjectExplorer-0.3.10.msixbundle
//   dist/ObjectExplorer-0.3.10-arm64.msix   /
//
// One submission then serves both architectures, and an arm64 machine installs the native build
// instead of running the x64 one under emulation. makeappx only bundles packages that share an
// identity and a version, which holds because .github/set-version.sh stamps the same version
// into both matrix legs before either builds.
//
// The bundle stays unsigned for the same reason the packages do: the Store signs it.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { findSdkTool } from "./msix.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(root, "dist")
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version
const appName = "ObjectExplorer"

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	bundleMsix()
}

export function bundleMsix() {
	// makeappx bundle takes a directory and packs everything in it, so the .msix files get their
	// own folder — dist also holds the .exe and the msix-<arch> staging trees
	const packageDir = path.join(distDir, "msix-packages")
	fs.rmSync(packageDir, { recursive: true, force: true })
	fs.mkdirSync(packageDir, { recursive: true })

	const packages = fs.readdirSync(distDir).filter((name) => name.endsWith(".msix"))
	for (const name of packages) {
		fs.copyFileSync(path.join(distDir, name), path.join(packageDir, name))
	}

	if (packages.length > 0) {
		const bundle = path.join(distDir, `${appName}-${version}.msixbundle`)
		// /bv, or makeappx gives the bundle version 0.0.0.0 and the Store rejects it as older
		// than whatever is already published
		execFileSync(findSdkTool("makeappx.exe"), ["bundle", "/d", packageDir, "/p", bundle, "/bv", `${version}.0`, "/o"], { stdio: "inherit" })
		console.log("dist:", bundle, "-", packages.join(", "))
	} else {
		throw new Error(`no .msix in ${distDir} — run npm run msix on each arch first, or download the msix-* artifacts here`)
	}
}
