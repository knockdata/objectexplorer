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
		const contentTypes = []
		const imported = []
		for (const fileType of fileTypes) {
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
		const unique = [...new Set(contentTypes)]
		return `	<key>CFBundleDocumentTypes</key>
	<array>
		<dict>
			<key>CFBundleTypeName</key>
			<string>Files ObjectExplorer opens</string>
			<key>CFBundleTypeRole</key>
			<string>Viewer</string>
			<key>LSHandlerRank</key>
			<string>Alternate</string>
			<key>LSItemContentTypes</key>
			<array>
${unique.map(identifier => `				<string>${identifier}</string>`).join("\n")}
			</array>
		</dict>
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

// One uap:FileTypeAssociation per 100 extensions: a group has a ceiling, and several groups
// behave exactly like one.
export function msixFileTypes(fileTypes) {
	const exts = fileTypes.map(fileType => fileType.ext).filter(ext => windowsReserved.has(ext) === false)
	if (exts.length > 0) {
		const groups = []
		for (let start = 0; start < exts.length; start += 100) {
			const group = exts.slice(start, start + 100)
			groups.push(`				<uap:Extension Category="windows.fileTypeAssociation">
					<uap:FileTypeAssociation Name="objectexplorer${groups.length + 1}">
						<uap:DisplayName>ObjectExplorer</uap:DisplayName>
						<uap:SupportedFileTypes>
${group.map(ext => `							<uap:FileType>.${ext}</uap:FileType>`).join("\n")}
						</uap:SupportedFileTypes>
					</uap:FileTypeAssociation>
				</uap:Extension>`)
		}
		return `			<Extensions>
${groups.join("\n")}
			</Extensions>
`
	} else {
		return ""
	}
}
