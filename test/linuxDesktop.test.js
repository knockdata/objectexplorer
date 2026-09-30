// What an AppImage writes into the desktop on start (src/linuxDesktop.js): the Open With entry, the
// document icons as mimetype icons, and the thumbnailer that runs `cli thumbnail`. Linux only; it
// writes into a temporary XDG_DATA_HOME, never the runner's own.
//
//   node --test test/linuxDesktop.test.js
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

test("an AppImage registers its icons and its thumbnailer", { skip: process.platform !== "linux" }, async function () {
	const dataHome = fs.mkdtempSync(path.join(os.tmpdir(), "objectexplorer-xdg-"))
	const bundleDir = fs.mkdtempSync(path.join(os.tmpdir(), "objectexplorer-bundle-"))
	fs.mkdirSync(path.join(bundleDir, "server"))
	fs.writeFileSync(path.join(bundleDir, "server", "fileTypes.json"), JSON.stringify([
		{ ext: "parquet", mime: "application/vnd.apache.parquet" },
		{ ext: "csv", mime: "text/csv" },
		{ ext: "step", mime: "model/step" },
	]))
	process.env.XDG_DATA_HOME = dataHome
	process.env.APPIMAGE = "/opt/ObjectExplorer.AppImage"

	const documentDir = path.join(root, "assets", "document")
	const icons = {}
	for (const file of fs.readdirSync(documentDir).filter(name => name.endsWith(".svg"))) {
		icons[file.replace(/^doc-|\.svg$/g, "")] = fs.readFileSync(path.join(documentDir, file), "utf8")
	}
	function readAsset(name) {
		return name === "document-icons.json" ? Buffer.from(JSON.stringify(icons)) : fs.readFileSync(path.join(root, "assets", name))
	}

	// imported after XDG_DATA_HOME is set: the module reads it once
	const { registerLinuxDesktop } = await import("../src/linuxDesktop.js")
	registerLinuxDesktop(bundleDir, readAsset)

	const mimetypes = path.join(dataHome, "icons", "hicolor", "scalable", "mimetypes")
	assert.equal(fs.readFileSync(path.join(mimetypes, "application-vnd.apache.parquet.svg"), "utf8"), icons.parquet)
	assert.equal(fs.readFileSync(path.join(mimetypes, "model-step.svg"), "utf8"), icons.step)
	assert.equal(fs.existsSync(path.join(mimetypes, "text-csv.svg")), false, "the generic page never restyles csv")

	const thumbnailer = fs.readFileSync(path.join(dataHome, "thumbnailers", "objectexplorer.thumbnailer"), "utf8")
	assert.match(thumbnailer, /^Exec="\/opt\/ObjectExplorer.AppImage" cli thumbnail %i %o %s$/m)
	assert.match(thumbnailer, /^MimeType=application\/vnd.apache.parquet;text\/csv;$/m)
})
