// Downloads appimagetool and the AppImage runtime into out/appimage-cache. Linux only.
//
// "continuous" is the only channel upstream publishes. The last numbered AppImageKit release is
// from 2020 and embeds a libfuse2 runtime, which does not start on Ubuntu 24.04 at all — so a
// tag that looks more like a pin would ship a binary nobody can run.
//
// The runtime is downloaded here rather than left to appimagetool, which would otherwise fetch
// one into ~/.cache behind our back. --runtime-file is what makes it explicit.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const cacheDir = path.join(root, "out", "appimage-cache")

// node says x64 and arm64, the AppImage world says x86_64 and aarch64
export function appimageCpu(arch) {
	return arch === "arm64" ? "aarch64" : "x86_64"
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	console.log(await fetchAppimageTool(process.arch))
}

// returns { tool, runtime } — appimagetool itself and the runtime it prepends to the squashfs
export async function fetchAppimageTool(arch) {
	const cpu = appimageCpu(arch)
	const tool = await download(
		`https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-${cpu}.AppImage`,
		path.join(cacheDir, `appimagetool-${cpu}.AppImage`),
		0o755)
	const runtime = await download(
		`https://github.com/AppImage/type2-runtime/releases/download/continuous/runtime-${cpu}`,
		path.join(cacheDir, `runtime-${cpu}`),
		0o644)
	return { tool, runtime }
}

async function download(url, target, mode) {
	if (fs.existsSync(target)) {
		console.log("appimage cached:", target)
	} else {
		fs.mkdirSync(cacheDir, { recursive: true })
		console.log("downloading", url)
		const response = await fetch(url)
		if (response.ok) {
			fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()))
			fs.chmodSync(target, mode)
		} else {
			throw new Error(`${url} returned ${response.status}`)
		}
	}
	return target
}
