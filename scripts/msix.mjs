// Packs the signed dist/ObjectExplorer-<version>-<arch>.exe into an MSIX.
//
//   npm run msix         dist/ObjectExplorer-0.3.11-x64.msix         signed in CI, shipped on
//                                                                    the releases page
//   npm run msix:store   dist/store/ObjectExplorer-0.3.11-x64.msix   unsigned, submitted to
//                                                                    Partner Center
//
// Two packages out of one build, because Identity/Publisher holds one value and two different
// things validate against it. signtool refuses to sign unless it equals the signing
// certificate's subject, which for Azure Trusted Signing is the validated org identity and is
// not ours to choose. Partner Center refuses the upload unless it equals the publisher id it
// issued, CN=C5C9E62A-... The same Azure account does not merge the two. Everything else about
// the packages — identity name, version, payload — is the same.
//
// The direct publisher is never written down here: the workflow reads it off the freshly signed
// .exe and passes it in as MSIX_PUBLISHER. signtool compares it to the manifest character for
// character, and a hand-copied subject is exactly the string that drifts on a profile renewal.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { targetArch, targetPlatform } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(root, "dist")
const assetsDir = path.join(root, "assets")
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version
const appName = "ObjectExplorer"

// These two come from Partner Center, and nowhere else:
//   https://partner.microsoft.com/en-us/dashboard/products/9PMCD8HJPCXH/overview
//   -> Product management -> Product identity
// Package/Identity/Name and Package/Identity/Publisher must match character for character or
// the Store rejects the upload. publisherDisplayName is the name shown in the Store listing.
export const identityName = "KnockData.ObjectExplorer"
export const storePublisher = "CN=C5C9E62A-2A26-4C2C-989D-46433B73DFC8"
export const publisherDisplayName = "Knock Data"

// The Store requires four parts and a revision of 0 — it owns the revision field itself.
export const packageVersion = `${version}.0`

// dist/store holds the store variant on its own, so the workflow's Sign step can point at dist
// without recursing and never touch it
export const storeDir = path.join(distDir, "store")

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	buildMsix(process.argv[2] || "direct")
}

export function buildMsix(variant) {
	if (targetPlatform === "win32") {
		pack(variant)
	} else {
		throw new Error("makeappx.exe is Windows only: build the msix on a Windows machine or in the release workflow")
	}
}

function publisherFor(variant) {
	if (variant === "store") {
		return storePublisher
	} else {
		if (process.env.MSIX_PUBLISHER) {
			return process.env.MSIX_PUBLISHER
		} else {
			throw new Error("MSIX_PUBLISHER is not set: the direct package has to carry the signing certificate's subject. In CI it comes off the signed exe; locally read it with Get-AuthenticodeSignature dist\\*.exe and set it, or run npm run msix:store instead.")
		}
	}
}

function pack(variant) {
	const publisher = publisherFor(variant)
	const outDir = variant === "store" ? storeDir : distDir
	const exe = path.join(distDir, `${appName}-${version}-${targetArch}.exe`)
	const stageDir = path.join(distDir, `stage-${variant}-${targetArch}`)
	const msix = path.join(outDir, `${appName}-${version}-${targetArch}.msix`)

	fs.rmSync(stageDir, { recursive: true, force: true })
	fs.mkdirSync(path.join(stageDir, "Assets"), { recursive: true })
	fs.mkdirSync(outDir, { recursive: true })

	// named ObjectExplorer.exe inside the package: the manifest's Executable, the Start menu
	// entry and the window's task bar identity all come off this one name, and it must not
	// carry the version the way the download does
	fs.copyFileSync(exe, path.join(stageDir, `${appName}.exe`))
	fs.copyFileSync(path.join(assetsDir, "icon-44x44.png"), path.join(stageDir, "Assets", "Square44x44Logo.png"))
	fs.copyFileSync(path.join(assetsDir, "icon-150x150.png"), path.join(stageDir, "Assets", "Square150x150Logo.png"))
	// StoreLogo is only used by a few system dialogs; the listing icons are uploaded to Partner
	// Center by hand, so the 150x150 doubles as this one rather than adding a third asset
	fs.copyFileSync(path.join(assetsDir, "icon-150x150.png"), path.join(stageDir, "Assets", "StoreLogo.png"))
	fs.writeFileSync(path.join(stageDir, "AppxManifest.xml"), manifest(publisher))

	execFileSync(findSdkTool("makeappx.exe"), ["pack", "/d", stageDir, "/p", msix, "/o"], { stdio: "inherit" })
	console.log(`${variant}:`, msix, "-", publisher)
}

// The Windows SDK installs makeappx and signtool under a versioned directory, and a runner image
// carries several versions at once. Highest wins; localeCompare with numeric is enough because
// the directory names are dotted numbers of equal shape (10.0.22621.0).
export function findSdkTool(tool) {
	const binDir = "C:\\Program Files (x86)\\Windows Kits\\10\\bin"
	const hostArch = process.arch === "arm64" ? "arm64" : "x64"
	const versions = fs.readdirSync(binDir).filter((name) => name.startsWith("10.")).sort((left, right) => right.localeCompare(left, undefined, { numeric: true }))
	const found = versions.map((name) => path.join(binDir, name, hostArch, tool)).find((candidate) => fs.existsSync(candidate))

	if (found) {
		return found
	} else {
		throw new Error(`${tool} not found under ${binDir} — install the Windows 10 SDK (winget install Microsoft.WindowsSDK)`)
	}
}

// runFullTrust is a restricted capability: it is what makes a plain win32 .exe run unchanged
// inside a package, and the Store reviews it. A desktop app is exactly the case it exists for.
// MinVersion 10.0.17763.0 is Windows 10 1809, the oldest release WebView2 supports.
//
// BackgroundColor is the icon's own dark, not "transparent": the App Installer dialog fills a
// transparent logo with the system accent, which paints a blue square around the icon. The
// logos are full-bleed on the same colour, so nothing shows through either way.
function manifest(publisher) {
	return `<?xml version="1.0" encoding="utf-8"?>
<Package
	xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
	xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
	xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities"
	IgnorableNamespaces="uap rescap">

	<Identity Name="${identityName}" Publisher="${publisher}" Version="${packageVersion}" ProcessorArchitecture="${targetArch}" />

	<Properties>
		<DisplayName>${appName}</DisplayName>
		<PublisherDisplayName>${publisherDisplayName}</PublisherDisplayName>
		<Logo>Assets\\StoreLogo.png</Logo>
	</Properties>

	<Dependencies>
		<TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.26100.0" />
	</Dependencies>

	<Resources>
		<Resource Language="en-us" />
	</Resources>

	<Capabilities>
		<rescap:Capability Name="runFullTrust" />
	</Capabilities>

	<Applications>
		<Application Id="${appName}" Executable="${appName}.exe" EntryPoint="Windows.FullTrustApplication">
			<uap:VisualElements
				DisplayName="${appName}"
				Description="The VSCode for Cloud Storage"
				BackgroundColor="#1E1F24"
				Square150x150Logo="Assets\\Square150x150Logo.png"
				Square44x44Logo="Assets\\Square44x44Logo.png" />
		</Application>
	</Applications>
</Package>
`
}
