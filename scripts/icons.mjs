// Every icon format the packagers want, made from the two drawings in assets/:
//
//   logo.png        the macOS grid: the tile at 80% with a margin, in line with other apps in the Dock
//   logo-full.png   the tile edge to edge, for every platform that draws the icon small or adds no
//                   margin of its own — at 80% it reads as too small there
//
// Run by hand on a mac whenever either changes — `node scripts/icons.mjs` — and commit what it
// writes. sips and iconutil ship with macOS, and an ICO is simple enough to write without a library.
//
//   icon.icns                  from logo.png        the .app bundle and the dmg volume (scripts/pack.mjs)
//   icon.ico                   from logo-full.png   the Windows exe (scripts/win-resources.mjs)
//   icon-44x44.png, 150x150    from logo-full.png   the msix tiles (scripts/msix.mjs)
//
// The Linux AppImage and the window icon take logo-full.png as it is.
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const assetsDir = path.join(root, "assets")
const logo = path.join(assetsDir, "logo.png")
const logoFull = path.join(assetsDir, "logo-full.png")
const workDir = path.join(root, "out", "icons")

fs.rmSync(workDir, { recursive: true, force: true })
fs.mkdirSync(workDir, { recursive: true })
buildIcns()
buildIco()
resize(logoFull, 44, path.join(assetsDir, "icon-44x44.png"))
resize(logoFull, 150, path.join(assetsDir, "icon-150x150.png"))
fs.rmSync(workDir, { recursive: true, force: true })

function resize(source, pixels, file) {
	execFileSync("sips", ["-z", String(pixels), String(pixels), source, "--out", file], { stdio: "ignore" })
	return file
}

// every size iconutil names; the 512@2x slot is the 512 drawing scaled up, there is nothing larger
function buildIcns() {
	const iconset = path.join(workDir, "icon.iconset")
	fs.mkdirSync(iconset, { recursive: true })
	for (const size of [16, 32, 128, 256, 512]) {
		resize(logo, size, path.join(iconset, `icon_${size}x${size}.png`))
		resize(logo, size * 2, path.join(iconset, `icon_${size}x${size}@2x.png`))
	}
	execFileSync("iconutil", ["-c", "icns", iconset, "-o", path.join(assetsDir, "icon.icns")], { stdio: "inherit" })
	console.log("icon.icns")
}

// An ICO is a 6-byte header, one 16-byte entry per image, then the images. Windows reads a png as
// the image itself, so each entry is a resized png, byte for byte. A size of 256 is written as 0,
// because the entry has one byte for it.
function buildIco() {
	const images = []
	for (const size of [16, 24, 32, 48, 64, 128, 256]) {
		images.push({ size, data: fs.readFileSync(resize(logoFull, size, path.join(workDir, `ico-${size}.png`))) })
	}

	const header = Buffer.alloc(6)
	header.writeUInt16LE(1, 2)
	header.writeUInt16LE(images.length, 4)

	const entries = []
	let offset = header.length + 16 * images.length
	for (const image of images) {
		const entry = Buffer.alloc(16)
		entry.writeUInt8(image.size % 256, 0)
		entry.writeUInt8(image.size % 256, 1)
		entry.writeUInt16LE(1, 4)
		entry.writeUInt16LE(32, 6)
		entry.writeUInt32LE(image.data.length, 8)
		entry.writeUInt32LE(offset, 12)
		entries.push(entry)
		offset += image.data.length
	}

	fs.writeFileSync(path.join(assetsDir, "icon.ico"), Buffer.concat([header, ...entries, ...images.map(image => image.data)]))
	console.log("icon.ico")
}
