// "Open with ObjectExplorer": the extensions the app registers with each OS.
//
// The list is the package's own server/fileTypes.json — base/mimes.js flattened by
// objectexplorer/gen/fileTypes.js — so the app claims exactly what the bundle it ships can open.
// npm-bundle.mjs copies it to out/fileTypes.json; pack.mjs and msix.mjs read it from there.
//
// Every claim is a viewer at the lowest rank, so it adds the app to "Open With" and never takes a
// type's default away from whatever the user already opens it with.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { extractTarToDir } from "../src/tar.js"
import { genericFamily, groupByFamily, previewExtensions } from "../src/documentFamilies.js"

// native/preview-windows.c, the thumbnail and preview handler the msix registers
export const previewClsid = "6A1D3B1E-4F2A-4C8B-9E5D-0B7F3C2A9E41"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "out")
const fileTypesFile = path.join(outDir, "fileTypes.json")
const appId = "com.knockdata.objectexplorer"

// A package built before the list existed has none; the app then ships with no associations,
// which is what every build before this one did.
export async function writeFileTypes(tarball) {
	const unpacked = fs.mkdtempSync(path.join(os.tmpdir(), "objectexplorer-file-types-"))
	await extractTarToDir(tarball, unpacked)
	const source = path.join(unpacked, "server", "fileTypes.json")
	// and the preview bundle the Quick Look extensions load (scripts/quicklook.mjs), from the same package
	const previewScript = path.join(unpacked, "server", "preview-jsc.js")
	if (fs.existsSync(previewScript)) {
		fs.copyFileSync(previewScript, path.join(outDir, "preview-jsc.js"))
	} else {
		fs.rmSync(path.join(outDir, "preview-jsc.js"), { force: true })
	}
	if (fs.existsSync(source)) {
		fs.copyFileSync(source, fileTypesFile)
		console.log("file types:", JSON.parse(fs.readFileSync(source, "utf8")).length)
	} else {
		fs.rmSync(fileTypesFile, { force: true })
		console.log("file types: this package has no server/fileTypes.json, no Open With")
	}
	fs.rmSync(unpacked, { recursive: true, force: true })
}

export function readFileTypes() {
	if (fs.existsSync(fileTypesFile)) {
		return JSON.parse(fs.readFileSync(fileTypesFile, "utf8"))
	} else {
		return []
	}
}

// macOS matches documents by UTI, not extension. An extension the system already knows (csv is
// public.comma-separated-values-text) is claimed by that UTI; one it does not (parquet) gets a UTI
// of ours, imported with its extension and mime. The system's answer comes from UTType itself,
// through a helper compiled here — the build machine is a mac, which is the only place a mac build
// runs. An identifier outside public.* and com.apple.* came from some app installed on the build
// machine, so ours is declared beside it for a mac that does not have that app.
export function macDocumentTypes(fileTypes) {
	if (fileTypes.length > 0) {
		const resolved = resolveUtis(fileTypes.map(fileType => fileType.ext))
		const imported = []
		const claimed = new Set()
		const entries = []
		// one entry per document family, so each carries the icon its files wear in Finder
		for (const [family, members] of groupByFamily(fileTypes)) {
			const contentTypes = []
			for (const fileType of members) {
				const system = resolved.get(fileType.ext)
				if (system && system.dynamic === false) {
					contentTypes.push(system.identifier)
				} else {
				}
				const systemOwned = system && system.dynamic === false && /^(public|com\.apple)\./.test(system.identifier)
				if (systemOwned) {
				} else {
					const identifier = `${appId}.${fileType.ext}`
					contentTypes.push(identifier)
					imported.push(importedType(identifier, fileType))
				}
			}
			// a UTI two extensions share is claimed once, by the first family that names it
			const unique = [...new Set(contentTypes)].filter(identifier => claimed.has(identifier) === false)
			unique.forEach(identifier => claimed.add(identifier))
			if (unique.length > 0) {
				entries.push(documentType(family, unique))
			} else {
			}
		}
		return `	<key>CFBundleDocumentTypes</key>
	<array>
${entries.join("\n")}
	</array>
	<key>UTImportedTypeDeclarations</key>
	<array>
${imported.join("\n")}
	</array>
`
	} else {
		return ""
	}
}

// the icon is assets/document/doc-<family>.icns, which pack.mjs copies into Contents/Resources
function documentType(family, contentTypes) {
	return `		<dict>
			<key>CFBundleTypeName</key>
			<string>${family.toUpperCase()} files ObjectExplorer opens</string>
			<key>CFBundleTypeIconFile</key>
			<string>doc-${family}</string>
			<key>CFBundleTypeRole</key>
			<string>Viewer</string>
			<key>LSHandlerRank</key>
			<string>Alternate</string>
			<key>LSItemContentTypes</key>
			<array>
${contentTypes.map(identifier => `				<string>${identifier}</string>`).join("\n")}
			</array>
		</dict>`
}

// The UTIs a previewable file has on a mac, for the Quick Look extensions: ours for an extension
// the system does not know, and one another app declared too. A system-owned type (public.csv) is
// left to the system's own preview.
export function macPreviewContentTypes(fileTypes) {
	const previewable = fileTypes.filter(fileType => previewExtensions.includes(fileType.ext))
	if (previewable.length > 0) {
		const resolved = resolveUtis(previewable.map(fileType => fileType.ext))
		const identifiers = []
		for (const fileType of previewable) {
			const system = resolved.get(fileType.ext)
			const systemOwned = system && system.dynamic === false && /^(public|com\.apple)\./.test(system.identifier)
			if (systemOwned) {
			} else {
				identifiers.push(`${appId}.${fileType.ext}`)
				if (system && system.dynamic === false) {
					identifiers.push(system.identifier)
				} else {
				}
			}
		}
		return [...new Set(identifiers)]
	} else {
		return []
	}
}

function importedType(identifier, fileType) {
	return `		<dict>
			<key>UTTypeIdentifier</key>
			<string>${identifier}</string>
			<key>UTTypeDescription</key>
			<string>${fileType.ext.toUpperCase()} file</string>
			<key>UTTypeConformsTo</key>
			<array>
				<string>public.data</string>
			</array>
			<key>UTTypeTagSpecification</key>
			<dict>
				<key>public.filename-extension</key>
				<array>
					<string>${fileType.ext}</string>
				</array>
				<key>public.mime-type</key>
				<array>
					<string>${fileType.mime}</string>
				</array>
			</dict>
		</dict>`
}

// ext → { identifier, dynamic }, one line per extension from scripts/uti-mac.m
function resolveUtis(exts) {
	const helper = path.join(outDir, "uti-mac")
	execFileSync("/usr/bin/clang", ["-fobjc-arc", "-framework", "Foundation", "-framework", "UniformTypeIdentifiers",
		path.join(root, "scripts", "uti-mac.m"), "-o", helper], { stdio: "inherit" })
	const output = execFileSync(helper, exts, { encoding: "utf8" })
	const resolved = new Map()
	for (const line of output.trim().split("\n")) {
		const [ext, identifier, dynamic] = line.split(" ")
		resolved.set(ext, { identifier, dynamic: dynamic === "1" })
	}
	return resolved
}

// Windows reserves these for itself: a package that names one fails to install.
// https://learn.microsoft.com/windows/apps/design/app-settings/reserved-file-and-uri-scheme-names
const windowsReserved = new Set(("accountpicture-ms appx application appref-ms bat cer chm cmd com cpl crt dll drv exe fon "
	+ "gadget hlp hta inf ins jse lnk msi msp ocx pif ps1 reg scf scr shb shs sys ttf url vbe vbs ws wsc wsf wsh").split(" "))

// One uap:FileTypeAssociation per document family, and within one per 100 extensions: a group
// has a ceiling, and several groups behave exactly like one. Each carries its family's icon,
// assets/document/doc-<family>.png, which msix.mjs copies into Assets.
//
// With previewHandlers, a family whose every extension the preview renderer reads also names the
// handler DLL as its thumbnail and preview-pane handler, and the DLL is declared as a COM server
// run in a surrogate process — Explorer never loads it into itself.
export function msixFileTypes(fileTypes, previewHandlers = false) {
	const allowed = fileTypes.filter(fileType => windowsReserved.has(fileType.ext) === false)
	if (allowed.length > 0) {
		const groups = []
		for (const [family, members] of groupByFamily(allowed)) {
			const exts = members.map(fileType => fileType.ext)
			// never the generic page: it gathers every other type, and csv or json keep the system's own
			const handled = previewHandlers && family !== genericFamily && exts.every(ext => previewExtensions.includes(ext))
			for (let start = 0; start < exts.length; start += 100) {
				groups.push(fileTypeAssociation(groups.length + 1, family, exts.slice(start, start + 100), handled))
			}
		}
		const server = previewHandlers ? `
				<com:Extension Category="windows.comServer">
					<com:ComServer>
						<com:SurrogateServer DisplayName="ObjectExplorer preview">
							<com:Class Id="${previewClsid}" Path="ObjectExplorerPreview.dll" ThreadingModel="STA" />
						</com:SurrogateServer>
					</com:ComServer>
				</com:Extension>` : ""
		return `			<Extensions>
${groups.join("\n")}${server}
			</Extensions>
`
	} else {
		return ""
	}
}

function fileTypeAssociation(index, family, group, handled) {
	return `				<uap:Extension Category="windows.fileTypeAssociation">
					<uap:FileTypeAssociation Name="objectexplorer${index}">
						<uap:DisplayName>ObjectExplorer</uap:DisplayName>
						<uap:Logo>Assets\\doc-${family}.png</uap:Logo>
						<uap:SupportedFileTypes>
${group.map(ext => `							<uap:FileType>.${ext}</uap:FileType>`).join("\n")}
						</uap:SupportedFileTypes>${handled ? `
						<desktop2:ThumbnailHandler Clsid="${previewClsid}" />
						<desktop2:DesktopPreviewHandler Clsid="${previewClsid}" />` : ""}
					</uap:FileTypeAssociation>
				</uap:Extension>`
}
