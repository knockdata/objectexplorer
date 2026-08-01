// Packs the signed dist/ObjectExplorer-<version>-<arch>.exe into an MSIX for the Microsoft
// Store.
//
//   dist/ObjectExplorer-0.3.10-x64.exe   ->   dist/ObjectExplorer-0.3.10-x64.msix
//
// Why a second Windows artifact at all: the bare .exe is signed by Azure Trusted Signing, which
// is a valid Authenticode signature, but a young certificate profile has no SmartScreen
// reputation — so the first users still get "Windows protected your PC". A Store install never
// reaches SmartScreen. The direct .exe download stays exactly as it is; this is an extra
// channel, not a replacement.
//
// The package produced here is deliberately UNSIGNED. Partner Center strips and re-signs with
// the Store certificate, and that is what makes the identity below match. scripts/self-sign-msix.bat
// signs a throwaway copy so you can install and run it locally before submitting.
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

// These three come from Partner Center, and nowhere else:
//   https://partner.microsoft.com/en-us/dashboard/products/9PMCD8HJPCXH/overview
//   -> Product management -> Product identity
// Package/Identity/Name and Package/Identity/Publisher must match character for character or
// the Store rejects the upload, and the local self-signed install fails with a publisher
// mismatch. publisherDisplayName is the name shown in the Store listing.
export const identityName = "KnockData.ObjectExplorer"
export const publisher = "CN=C5C9E62A-2A26-4C2C-989D-46433B73DFC8"
export const publisherDisplayName = "Knock Data"

// The Store requires four parts and a revision of 0 — it owns the revision field itself.
export const packageVersion = `${version}.0`

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	buildMsix()
}

export function buildMsix() {
	if (targetPlatform === "win32") {
		if (identityName.startsWith("REPLACE")) {
			throw new Error("scripts/msix.mjs still has the placeholder identity — copy Name and Publisher from https://partner.microsoft.com/en-us/dashboard/products/9PMCD8HJPCXH/overview -> Product management -> Product identity")
		} else {
			pack()
		}
	} else {
		throw new Error("makeappx.exe is Windows only: build the msix on a Windows machine or in the release workflow")
	}
}

function pack() {
	const exe = path.join(distDir, `${appName}-${version}-${targetArch}.exe`)
	const stageDir = path.join(distDir, `msix-${targetArch}`)
	const msix = path.join(distDir, `${appName}-${version}-${targetArch}.msix`)

	fs.rmSync(stageDir, { recursive: true, force: true })
	fs.mkdirSync(path.join(stageDir, "Assets"), { recursive: true })

	// named ObjectExplorer.exe inside the package: the manifest's Executable, the Start menu
	// entry and the window's task bar identity all come off this one name, and it must not
	// carry the version the way the download does
	fs.copyFileSync(exe, path.join(stageDir, `${appName}.exe`))
	fs.copyFileSync(path.join(assetsDir, "icon-44x44.png"), path.join(stageDir, "Assets", "Square44x44Logo.png"))
	fs.copyFileSync(path.join(assetsDir, "icon-150x150.png"), path.join(stageDir, "Assets", "Square150x150Logo.png"))
	// StoreLogo is only used by a few system dialogs; the listing icons are uploaded to Partner
	// Center by hand, so the 150x150 doubles as this one rather than adding a third asset
	fs.copyFileSync(path.join(assetsDir, "icon-150x150.png"), path.join(stageDir, "Assets", "StoreLogo.png"))
	fs.writeFileSync(path.join(stageDir, "AppxManifest.xml"), manifest())

	execFileSync(findSdkTool("makeappx.exe"), ["pack", "/d", stageDir, "/p", msix, "/o"], { stdio: "inherit" })
	console.log("dist:", msix, "- unsigned, the Store signs it")
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
function manifest() {
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
				BackgroundColor="transparent"
				Square150x150Logo="Assets\\Square150x150Logo.png"
				Square44x44Logo="Assets\\Square44x44Logo.png" />
		</Application>
	</Applications>
</Package>
`
}
