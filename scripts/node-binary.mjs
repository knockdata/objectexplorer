// Downloads the official node binary that the SEA is built on top of, into out/node-cache.
//
// The running node cannot be used: a package-manager build is often a small stub linked
// against a shared libnode (Homebrew's node@24 is 67KB), and those carry no SEA fuse for
// postject to find. Pinning the download also means the binary shipped to users is the same
// one whatever machine built it.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { targetArch, targetPlatform } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cacheDir = path.join(root, "out", "node-cache")
export const nodeVersion = "24.14.0"

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	console.log(await fetchNodeBinary())
}

export async function fetchNodeBinary() {
	const platform = targetPlatform === "win32" ? "win" : targetPlatform
	const name = `node-v${nodeVersion}-${platform}-${targetArch}`
	const archive = targetPlatform === "win32" ? `${name}.zip` : `${name}.tar.gz`
	const binary = targetPlatform === "win32"
		? path.join(cacheDir, name, "node.exe")
		: path.join(cacheDir, name, "bin", "node")

	if (fs.existsSync(binary)) {
		console.log("node binary cached:", binary)
	} else {
		fs.mkdirSync(cacheDir, { recursive: true })
		const url = `https://nodejs.org/dist/v${nodeVersion}/${archive}`
		console.log("downloading", url)
		const download = path.join(cacheDir, archive)
		fs.writeFileSync(download, Buffer.from(await (await fetch(url)).arrayBuffer()))
		// bsdtar ships with Windows 10+ and reads .zip as happily as macOS/linux tar reads
		// .tar.gz, so one command covers every platform
		execFileSync("tar", ["-xf", download, "-C", cacheDir], { stdio: "inherit" })
		fs.rmSync(download)
	}

	return binary
}
