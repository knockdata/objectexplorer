// The document icons: one drawing per family in src/documentFamilies.js, so a .parquet in Finder,
// Explorer or Nautilus wears the parquet mark on a page instead of the system's small app badge on
// a blank one. The page fills the icon the way an app's own document icons do.
//
//   page       a folded-corner sheet across nearly the whole canvas
//   glyph      the format's own mark, large: icon/src/brand/<family>.svg from rock2, the same art the
//              explorer lists files with (Apache marks keep the licence note in their files). The
//              table family is drawn here, because SAS and SPSS files would otherwise need a vendor's
//              trademark to stand for them
//   label      the family's name along the bottom, and our tile beside it as a small badge
//   data       every other extension: our tile large on the page, no label
//
// Run by hand on a mac — `node scripts/documentIcons.mjs` — with rock2 beside this repo (or
// ROCK2=path), and commit what it writes to assets/document/:
//
//   doc-<family>.icns   macOS, CFBundleTypeIconFile (scripts/fileTypes.mjs)
//   doc-<family>.png    256 px, the msix uap:Logo (scripts/msix.mjs)
//   doc-<family>.svg    linux mimetype icons, embedded as document-icons.json (scripts/sea.mjs)
//
// rsvg-convert draws the svg, iconutil makes the icns.
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { familyNames, genericFamily } from "../src/documentFamilies.js"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const rock2 = process.env.ROCK2 || path.join(root, "..", "rock2")
const brandDir = path.join(rock2, "icon", "src", "brand")
const outDir = path.join(root, "assets", "document")
const workDir = path.join(root, "out", "document-icons")
const tile = `data:image/png;base64,${fs.readFileSync(path.join(root, "assets", "logo-full.png")).toString("base64")}`

const labels = { hdf5: "HDF5", netcdf: "NETCDF", solidworks: "SLDPRT", excalidraw: "EXCALIDRAW" }

// A table drawn for this repo: a header row and a grid, in the explorer's data blue.
const tableGlyph = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	<rect x="2" y="3" width="20" height="18" rx="2" fill="#ffffff" stroke="#3b82c4" stroke-width="1.4"/>
	<rect x="2" y="3" width="20" height="5" rx="2" fill="#3b82c4"/>
	<path d="M2 13h20M2 17h20M9 8v13M15.5 8v13" stroke="#3b82c4" stroke-width="1.2"/>
</svg>`

fs.rmSync(workDir, { recursive: true, force: true })
fs.mkdirSync(workDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })
for (const family of familyNames()) {
	const svg = documentSvg(family)
	const svgFile = path.join(outDir, `doc-${family}.svg`)
	fs.writeFileSync(svgFile, svg)
	render(svgFile, 256, path.join(outDir, `doc-${family}.png`))
	buildIcns(family, svgFile)
	console.log(family)
}
fs.rmSync(workDir, { recursive: true, force: true })

function documentSvg(family) {
	const page = `<path d="M152 36H688L880 228V948Q880 988 840 988H184Q144 988 144 948V76Q144 36 184 36Z" fill="#fbfbfb" stroke="#cfcfcf" stroke-width="8"/>
	<path d="M688 36V188Q688 228 728 228H880" fill="#e4e4e4" stroke="#cfcfcf" stroke-width="8" stroke-linejoin="round"/>`
	if (family === genericFamily) {
		return frame(`${page}
	<image href="${tile}" x="232" y="250" width="560" height="560"/>`)
	}
	else {
		const label = labels[family] ?? family.toUpperCase()
		const fontSize = Math.min(96, Math.floor(500 / (label.length * 0.62)))
		return frame(`${page}
	${nested(glyphOf(family), 232, 170, 560)}
	<text x="190" y="920" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#7a7a7a">${label}</text>
	<image href="${tile}" x="712" y="792" width="136" height="136"/>`)
	}
}

function frame(body) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
	${body}
</svg>
`
}

// The brand file as it is, placed in a box: its own viewBox is kept, and a colour it takes from the
// editor theme becomes a fixed dark grey, which is what it looks like on a light page.
function glyphOf(family) {
	if (family === "table") {
		return tableGlyph
	}
	else {
		return fs.readFileSync(path.join(brandDir, `${family}.svg`), "utf8")
			.replace(/<!--[\s\S]*?-->/g, "")
			.replace(/var\(--vscode-[a-z-]+\)/g, "#3c3c3c")
	}
}

function nested(svg, x, y, size) {
	const open = svg.match(/<svg\b[^>]*>/)[0]
	const viewBox = open.match(/viewBox="([^"]+)"/)[1]
	// fill, stroke, stroke-width, linecaps: a mark drawn as lines says so on its root element
	const drawing = [...open.matchAll(/\s((?:fill|stroke)[a-z-]*)="([^"]+)"/g)].map(match => ` ${match[1]}="${match[2]}"`).join("")
	const inner = svg.slice(svg.indexOf(open) + open.length, svg.lastIndexOf("</svg>"))
	return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}"${drawing}>${inner}</svg>`
}

function render(svgFile, pixels, pngFile) {
	execFileSync("rsvg-convert", ["-w", String(pixels), "-h", String(pixels), svgFile, "-o", pngFile])
	return pngFile
}

function buildIcns(family, svgFile) {
	const iconset = path.join(workDir, `doc-${family}.iconset`)
	fs.mkdirSync(iconset, { recursive: true })
	for (const size of [16, 32, 128, 256, 512]) {
		render(svgFile, size, path.join(iconset, `icon_${size}x${size}.png`))
		render(svgFile, size * 2, path.join(iconset, `icon_${size}x${size}@2x.png`))
	}
	execFileSync("iconutil", ["-c", "icns", iconset, "-o", path.join(outDir, `doc-${family}.icns`)])
}
