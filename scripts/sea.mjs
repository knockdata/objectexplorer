// Turns src/ into one executable.
//
//   esbuild   src/main.js          -> out/main.cjs     (the SEA entry point)
//   esbuild   src/server-worker.js -> out/worker.js    (embedded, run with eval:true)
//   node      --experimental-sea-config -> out/sea.blob
//   copy      the node binary, strip its signature
//   postject  inject the blob
//   resedit   icon and version metadata (windows only)
//
// CommonJS, not ESM: a SEA entry point is evaluated as CommonJS, and `new Worker(source,
// { eval: true })` evaluates its source the same way. The sources stay ESM; esbuild converts.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { buildSync } from "esbuild"
import { bundleVersion, ffmpegVersion } from "./npm-bundle.mjs"
import { addonName } from "./addon.mjs"
import { fetchNodeBinary } from "./node-binary.mjs"
import { targetPlatform } from "./target.mjs"
import { writeWindowsResources } from "./win-resources.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "out")
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version
export const exeName = targetPlatform === "win32" ? "ObjectExplorer.exe" : "ObjectExplorer"
export const exePath = path.join(outDir, exeName)

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await buildSea()
}

export async function buildSea() {
	const nodeBinary = await fetchNodeBinary()

	bundle("src/main.js", "main.cjs")
	bundle("src/server-worker.js", "worker.js")
	// the window icon is read at runtime like any other asset, so it goes through out/ too —
	// that is the folder src/main.js falls back to when there is no SEA to read from
	fs.copyFileSync(path.join(root, "assets", "64.png"), path.join(outDir, "64.png"))
	writeConfig()

	execFileSync(process.execPath, ["--experimental-sea-config", path.join(outDir, "sea-config.json")], { stdio: "inherit" })

	// the official node binary is signed, and injecting into it invalidates that signature.
	// Removing it first keeps the platform tools from refusing the file outright; the real
	// signature is applied by scripts/pack.mjs at the end.
	fs.copyFileSync(nodeBinary, exePath)
	fs.chmodSync(exePath, 0o755)
	stripSignature()
	inject()
	if (targetPlatform === "win32") {
		writeWindowsResources(exePath)
	}

	console.log("binary:", exePath, fs.statSync(exePath).size, "bytes")
	return exePath
}

// the JS API, not the esbuild CLI: node 24 refuses to spawn the node_modules/.bin/esbuild.cmd
// shim on windows, and on unix that path is the native binary, which node cannot run either
function bundle(entry, outFile) {
	buildSync({
		entryPoints: [path.join(root, entry)],
		bundle: true,
		platform: "node",
		format: "cjs",
		target: "node22",
		define: {
			VERSION: `"${version}"`,
			BUNDLE_VERSION: `"${bundleVersion()}"`,
			FFMPEG_VERSION: `"${ffmpegVersion()}"`,
		},
		outfile: path.join(outDir, outFile),
	})
}

function writeConfig() {
	const config = {
		main: path.join(outDir, "main.cjs"),
		output: path.join(outDir, "sea.blob"),
		disableExperimentalSEAWarning: true,
		// both stay off: a snapshot cannot hold the dynamic import() of the backend, and the
		// code cache is tied to one exact node build
		useSnapshot: false,
		useCodeCache: false,
		assets: {
			"worker.js": path.join(outDir, "worker.js"),
			"objectexplorer.tgz": path.join(outDir, "objectexplorer.tgz"),
			"ffmpeg-core.tgz": path.join(outDir, "ffmpeg-core.tgz"),
			"64.png": path.join(outDir, "64.png"),
			[addonName]: path.join(outDir, addonName),
		},
	}
	fs.writeFileSync(path.join(outDir, "sea-config.json"), JSON.stringify(config, null, "\t"))
}

function stripSignature() {
	if (targetPlatform === "darwin") {
		execFileSync("codesign", ["--remove-signature", exePath], { stdio: "inherit" })
	} else {
		// linux binaries carry no signature, and the Authenticode one on node.exe is dropped
		// by resedit's ignoreCert a moment later
	}
}

function inject() {
	// the package entry point, not node_modules/.bin — node 24 refuses to spawn a .cmd shim
	const postject = path.join(root, "node_modules", "postject", "dist", "cli.js")
	const args = [
		postject,
		exePath,
		"NODE_SEA_BLOB",
		path.join(outDir, "sea.blob"),
		"--sentinel-fuse",
		"NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2",
	]
	if (targetPlatform === "darwin") {
		args.push("--macho-segment-name", "NODE_SEA")
	}
	execFileSync(process.execPath, args, { stdio: "inherit" })
}
