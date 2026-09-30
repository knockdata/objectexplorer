// The document icons each OS is handed (src/documentFamilies.js, scripts/documentIcons.mjs): every
// family has its drawing in every format, and every manifest entry names one that exists.
//
//   node --test test/documentIcons.test.js
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { macDocumentTypes, msixFileTypes } from "../scripts/fileTypes.mjs"
import { familyNames, familyOf, groupByFamily } from "../src/documentFamilies.js"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const documentDir = path.join(root, "assets", "document")
const sample = [
	{ ext: "parquet", mime: "application/vnd.apache.parquet" },
	{ ext: "arrow", mime: "application/vnd.apache.arrow.file" },
	{ ext: "feather", mime: "application/vnd.apache.arrow.file" },
	{ ext: "sav", mime: "application/x-spss-sav" },
	{ ext: "csv", mime: "text/csv" },
]

test("every family has its icns, png and svg", function () {
	for (const family of familyNames()) {
		for (const suffix of ["icns", "png", "svg"]) {
			assert.ok(fs.existsSync(path.join(documentDir, `doc-${family}.${suffix}`)), `doc-${family}.${suffix} is missing`)
		}
	}
})

test("an extension wears its family, and anything else the generic page", function () {
	assert.equal(familyOf("parquet"), "parquet")
	assert.equal(familyOf("FEATHER"), "arrow")
	assert.equal(familyOf("sav"), "table")
	assert.equal(familyOf("csv"), "data")
	assert.deepEqual(groupByFamily(sample).map(([family]) => family), ["parquet", "arrow", "table", "data"])
})

test("each msix association carries its family's logo, and the logo exists", function () {
	const xml = msixFileTypes(sample)
	const logos = [...xml.matchAll(/<uap:Logo>Assets\\(doc-[a-z0-9]+\.png)<\/uap:Logo>/g)].map(match => match[1])
	assert.deepEqual(logos, ["doc-parquet.png", "doc-arrow.png", "doc-table.png", "doc-data.png"])
	for (const logo of logos) {
		assert.ok(fs.existsSync(path.join(documentDir, logo)), `${logo} is missing`)
	}
	assert.match(xml, /doc-arrow\.png<\/uap:Logo>\s*<uap:SupportedFileTypes>\s*<uap:FileType>\.arrow<\/uap:FileType>\s*<uap:FileType>\.feather</)
})

test("each Info.plist document type names an icns that exists", { skip: process.platform !== "darwin" }, function () {
	const fragment = macDocumentTypes(sample)
	const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "objectexplorer-plist-")), "Info.plist")
	fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${fragment}</dict>
</plist>
`)
	execFileSync("plutil", ["-lint", file])
	const types = JSON.parse(execFileSync("plutil", ["-convert", "json", "-o", "-", file], { encoding: "utf8" })).CFBundleDocumentTypes
	assert.equal(types.length, 4)
	for (const type of types) {
		assert.ok(fs.existsSync(path.join(documentDir, `${type.CFBundleTypeIconFile}.icns`)), `${type.CFBundleTypeIconFile}.icns is missing`)
	}
	const parquet = types.find(type => type.CFBundleTypeIconFile === "doc-parquet")
	assert.deepEqual(parquet.LSItemContentTypes, ["com.knockdata.objectexplorer.parquet"])
})

test("with the handler dll, only families it can draw name it, and the dll is declared once", function () {
	const xml = msixFileTypes(sample, true)
	const handled = [...xml.matchAll(/<uap:Logo>Assets\\(doc-[a-z]+)\.png[\s\S]*?<\/uap:FileTypeAssociation>/g)]
		.filter(match => match[0].includes("desktop2:ThumbnailHandler"))
		.map(match => match[1])
	assert.deepEqual(handled, ["doc-parquet", "doc-arrow", "doc-table"])
	assert.equal((xml.match(/<com:Class /g) ?? []).length, 1)
	assert.doesNotMatch(msixFileTypes(sample), /desktop2:|com:Extension/)
})
