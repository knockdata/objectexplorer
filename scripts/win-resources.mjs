// Writes the icon and the version metadata into a Windows .exe.
//
// resedit is pure JavaScript: it parses the PE, rewrites the resource directory in memory and
// writes the file back. The rcedit this replaces was a Windows-only .exe calling
// BeginUpdateResource/EndUpdateResource, which hung for over 20 minutes on the 134 MB binary
// and made a Windows host mandatory.
//
// This runs after postject has injected NODE_SEA_BLOB, which is also a PE resource. Both
// orders produce the same resource set, but this one lets postject see an untouched node.exe
// and leaves .reloc at the address it has upstream. Takes about 400ms on the 107 MB binary.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Data, NtExecutable, NtExecutableResource, Resource } from "resedit"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const buildDir = path.join(root, "build")
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version

// 1033 is en-US, 1200 is the Unicode codepage — the pair every Windows tool expects
const lang = 1033
const codepage = 1200

export function writeWindowsResources(exePath) {
	// ignoreCert drops the Authenticode signature that nodejs.org ships on node.exe. Injecting
	// into it would invalidate that signature anyway; the real one is applied in CI.
	const exe = NtExecutable.from(fs.readFileSync(exePath), { ignoreCert: true })
	const resource = NtExecutableResource.from(exe)

	const icons = Data.IconFile.from(fs.readFileSync(path.join(buildDir, "icon.ico"))).icons
	Resource.IconGroupEntry.replaceIconsForResource(resource.entries, 1, lang, icons.map((icon) => icon.data))

	versionInfo().outputToResourceEntries(resource.entries)
	resource.outputResource(exe)
	fs.writeFileSync(exePath, Buffer.from(exe.generate()))
	console.log("windows resources:", exePath, "icon +", version)
}

function versionInfo() {
	const [major, minor, patch] = version.split(".").map(Number)
	return Resource.VersionInfo.create({
		lang,
		// a fixed version is two 32-bit words, each holding two 16-bit numbers
		fixedInfo: {
			fileVersionMS: (major << 16) | minor,
			fileVersionLS: (patch << 16) | 0,
			productVersionMS: (major << 16) | minor,
			productVersionLS: (patch << 16) | 0,
			fileOS: Resource.VersionFileOS.NT_Windows32,
			fileType: Resource.VersionFileType.App,
		},
		strings: [{
			lang,
			codepage,
			values: {
				ProductName: "ObjectExplorer",
				FileDescription: "The VSCode for Cloud Storage",
				CompanyName: "KnockData",
				OriginalFilename: "ObjectExplorer.exe",
				FileVersion: version,
				ProductVersion: version,
			},
		}],
	})
}
