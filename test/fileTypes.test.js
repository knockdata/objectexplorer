// What the .app, the msix and the AppImage register as "Open with" (scripts/fileTypes.mjs), and
// the two calls the built addon needs for it.
//
//   npm test          after `npm run build`, which writes out/fileTypes.json and the addon
//
// Run on each platform's own build: the addon check is what proves native/open-<platform> compiled.
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { macDocumentTypes, msixFileTypes, readFileTypes } from "../scripts/fileTypes.mjs"
import { targetArch, targetPlatform } from "../scripts/target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const sample = [
	{ ext: "parquet", mime: "application/vnd.apache.parquet" },
	{ ext: "csv", mime: "text/csv" },
	{ ext: "ttf", mime: "font/ttf" },
	{ ext: "bat", mime: "text/plain" },
]

test("the build carried the package's list of file types", function () {
	const fileTypes = readFileTypes()
	const exts = fileTypes.map(fileType => fileType.ext)
	assert.ok(fileTypes.length > 100, `only ${fileTypes.length} file types in out/fileTypes.json`)
	for (const ext of ["parquet", "csv", "duckdb", "step", "pdf"]) {
		assert.ok(exts.includes(ext), `${ext} is missing`)
	}
	for (const ext of ["exe", "dll", "dylib"]) {
		assert.equal(exts.includes(ext), false, `${ext} must never be claimed`)
	}
})

test("msix claims every extension except the ones Windows reserves", function () {
	const xml = msixFileTypes(sample)
	assert.match(xml, /Category="windows.fileTypeAssociation"/)
	assert.match(xml, /<uap:FileType>\.parquet<\/uap:FileType>/)
	assert.match(xml, /<uap:FileType>\.csv<\/uap:FileType>/)
	assert.doesNotMatch(xml, /\.ttf</)
	assert.doesNotMatch(xml, /\.bat</)
})

test("msix splits a long list into groups of 100", function () {
	const many = Array.from({ length: 250 }, (unused, index) => ({ ext: `x${index}`, mime: "application/octet-stream" }))
	const xml = msixFileTypes(many)
	assert.equal((xml.match(/<uap:FileTypeAssociation /g) ?? []).length, 3)
	assert.equal((xml.match(/<uap:FileType>/g) ?? []).length, 250)
})

test("no file types means no Extensions element at all", function () {
	assert.equal(msixFileTypes([]), "")
	assert.equal(macDocumentTypes([]), "")
})

test("the Info.plist claims system UTIs and imports ours for the rest", { skip: process.platform !== "darwin" }, function () {
	const fragment = macDocumentTypes(sample)
	const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${fragment}</dict>
</plist>
`
	const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "objectexplorer-plist-")), "Info.plist")
	fs.writeFileSync(file, plist)
	execFileSync("plutil", ["-lint", file])
	assert.match(fragment, /<string>public.comma-separated-values-text<\/string>/)
	assert.match(fragment, /<string>com.knockdata.objectexplorer.parquet<\/string>/)
	assert.match(fragment, /<string>Alternate<\/string>/)
})

// a cross-build (the Intel mac, built by an Apple Silicon node) cannot load what it built
const crossBuild = targetArch !== process.arch || targetPlatform !== process.platform

test("the built addon exports openFiles and allowForeground", { skip: crossBuild }, function () {
	const addonFile = path.join(root, "out", `webview_napi-${targetPlatform}-${targetArch}.node`)
	const holder = { exports: {} }
	process.dlopen(holder, addonFile)
	assert.equal(typeof holder.exports.openFiles, "function")
	assert.equal(typeof holder.exports.allowForeground, "function")
})
