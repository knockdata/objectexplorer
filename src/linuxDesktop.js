// "Open with ObjectExplorer" on linux. An AppImage is one file nobody installs, so nothing puts it
// in the file manager's Open With list unless the app does it itself: a desktop entry naming the
// AppImage and every mime type it opens, written on each start.
//
// Each start, because an AppImage moves — a new version is a new file name — and the entry has to
// name the one that is running. The entry is only rewritten when it would say something new.
//
// Mime types the system already knows are only named. One it does not know (parquet, duckdb, …)
// is declared too, with its extension, so a file manager can tell the file is one. A type the
// system knows is never redeclared: a second glob for *.go would change what a .go file is.
//
// A mime type's icon is looked up by its name, the mime with its slash made a dash, so the document
// icons (src/documentFamilies.js) go in as hicolor mimetype icons under that name — only for the
// families with a mark of their own. The generic page is never put on text/csv or json: that would
// restyle files every other app on the desktop shows too.
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { execFile } from "node:child_process"
import { log, logError } from "./log.js"
import { familyOf, genericFamily, previewExtensions } from "./documentFamilies.js"

const dataHome = process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share")
const desktopFile = path.join(dataHome, "applications", "objectexplorer.desktop")
const mimeDir = path.join(dataHome, "mime")
const mimeFile = path.join(mimeDir, "packages", "objectexplorer.xml")
const hicolorDir = path.join(dataHome, "icons", "hicolor")
const thumbnailerFile = path.join(dataHome, "thumbnailers", "objectexplorer.thumbnailer")
const iconFile = path.join(hicolorDir, "512x512", "apps", "objectexplorer.png")

export function registerLinuxDesktop(bundleDir, readAsset) {
	const appImage = process.env.APPIMAGE
	const fileTypesFile = path.join(bundleDir, "server", "fileTypes.json")
	if (process.platform === "linux" && appImage && fs.existsSync(fileTypesFile)) {
		try {
			const fileTypes = JSON.parse(fs.readFileSync(fileTypesFile, "utf8"))
			writeIcon(readAsset)
			if (writeMimeIcons(fileTypes, readAsset)) {
				runQuietly("gtk-update-icon-cache", ["-f", "-t", hicolorDir])
			} else {
			}
			const mimesChanged = writeIfChanged(mimeFile, mimeXml(fileTypes.filter(fileType => isUnknownMime(fileType.mime))))
			const entryChanged = writeIfChanged(desktopFile, desktopEntry(appImage, fileTypes))
			writeIfChanged(thumbnailerFile, thumbnailerEntry(appImage, fileTypes))
			if (mimesChanged) {
				runQuietly("update-mime-database", [mimeDir])
			} else {
			}
			if (entryChanged) {
				runQuietly("update-desktop-database", [path.dirname(desktopFile)])
				log("open with: registered", desktopFile)
			} else {
			}
		} catch (error) {
			logError("open with: could not register the desktop entry:", error)
		}
	} else {
		// not an AppImage on linux, or a bundle without the list
	}
}

function desktopEntry(appImage, fileTypes) {
	const mimes = [...new Set(fileTypes.map(fileType => fileType.mime))]
	return `[Desktop Entry]
Type=Application
Name=ObjectExplorer
Comment=The VSCode for Cloud Storage
Exec="${appImage}" %F
Icon=${iconFile}
Categories=Utility;
Terminal=false
MimeType=${mimes.join(";")};
`
}

// Nautilus, Nemo, Caja and Thunar (tumbler) run this for a file of one of these types to get its
// thumbnail: `oe thumbnail` inside the AppImage, which exits 1 when it cannot draw one and the file
// keeps its icon. GNOME runs thumbnailers in a sandbox; see objectexplorer/command/thumbnail.js.
function thumbnailerEntry(appImage, fileTypes) {
	const mimes = [...new Set(fileTypes.filter(fileType => previewExtensions.includes(fileType.ext)).map(fileType => fileType.mime))]
	return `[Thumbnailer Entry]
TryExec=${appImage}
Exec="${appImage}" cli thumbnail %i %o %s
MimeType=${mimes.join(";")};
`
}

// one entry per mime, carrying every extension that names it
function mimeXml(fileTypes) {
	const byMime = new Map()
	for (const fileType of fileTypes) {
		byMime.set(fileType.mime, [...(byMime.get(fileType.mime) ?? []), fileType.ext])
	}
	const entries = [...byMime].map(function ([mime, exts]) {
		const globs = exts.map(ext => `\t\t<glob pattern="*.${ext}"/>`).join("\n")
		return `\t<mime-type type="${mime}">\n\t\t<comment>${exts[0].toUpperCase()} file</comment>\n${globs}\n\t</mime-type>`
	})
	return `<?xml version="1.0" encoding="UTF-8"?>
<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
${entries.join("\n")}
</mime-info>
`
}

// the shared-mime-info database keeps one file per type under every data dir
function isUnknownMime(mime) {
	const dataDirs = (process.env.XDG_DATA_DIRS || "/usr/local/share:/usr/share").split(":")
	return dataDirs.every(dataDir => fs.existsSync(path.join(dataDir, "mime", `${mime}.xml`)) === false)
}

function writeIcon(readAsset) {
	if (fs.existsSync(iconFile)) {
	} else {
		fs.mkdirSync(path.dirname(iconFile), { recursive: true })
		fs.writeFileSync(iconFile, Buffer.from(readAsset("logo-full.png")))
	}
}

// mime -> the family of the first extension that names it, leaving out the generic page
function mimeFamilies(fileTypes) {
	const families = new Map()
	for (const fileType of fileTypes) {
		const family = familyOf(fileType.ext)
		if (family !== genericFamily && families.has(fileType.mime) === false) {
			families.set(fileType.mime, family)
		} else {
		}
	}
	return families
}

function writeMimeIcons(fileTypes, readAsset) {
	const icons = JSON.parse(Buffer.from(readAsset("document-icons.json")).toString("utf8"))
	let changed = false
	for (const [mime, family] of mimeFamilies(fileTypes)) {
		const file = path.join(hicolorDir, "scalable", "mimetypes", `${mime.replace("/", "-")}.svg`)
		changed = writeIfChanged(file, icons[family]) || changed
	}
	return changed
}

function writeIfChanged(file, text) {
	let current = null
	try {
		current = fs.readFileSync(file, "utf8")
	} catch (error) {
		current = null
	}
	if (current === text) {
		return false
	} else {
		fs.mkdirSync(path.dirname(file), { recursive: true })
		fs.writeFileSync(file, text)
		return true
	}
}

// both tools are optional: a desktop without them rescans on its own, only later
function runQuietly(command, args) {
	execFile(command, args, function (error) {
		if (error) {
			log("open with:", command, "not run -", error.message)
		} else {
		}
	})
}
