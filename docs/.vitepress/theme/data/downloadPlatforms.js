// Every installer a release carries, named the way the host's download links name them:
// objectexplorer.com/download/<platform>-<architecture>.<extension>. The version is never in the
// link — the host picks that asset out of the newest release (rock2/server/web/serveDownload.js),
// and counts the download on the way.
export const downloadSite = "https://objectexplorer.com/download/"
export const releasesPage = "https://github.com/knockdata/objectexplorer/releases/latest"

export const downloadPlatforms = [
	{
		id: "mac",
		name: "macOS",
		note: "Signed and notarized, so it opens on the first double-click.",
		downloads: [
			{ target: "mac-arm64.dmg", label: "Apple silicon", extension: ".dmg" },
			{ target: "mac-x64.dmg", label: "Intel", extension: ".dmg" },
		],
	},
	{
		id: "windows",
		name: "Windows",
		note: "The .msix is signed; SmartScreen may still ask the first time.",
		downloads: [
			{ target: "windows-x64.msix", label: "Installer, x64", extension: ".msix" },
			{ target: "windows-arm64.msix", label: "Installer, ARM64", extension: ".msix" },
			{ target: "windows-x64.exe", label: "Executable, x64", extension: ".exe" },
			{ target: "windows-arm64.exe", label: "Executable, ARM64", extension: ".exe" },
		],
	},
	{
		id: "linux",
		name: "Linux",
		note: "One AppImage. Its window is WebKitGTK 4.1; without it, it opens in your browser.",
		downloads: [
			{ target: "linux-x64.AppImage", label: "x64", extension: ".AppImage" },
			{ target: "linux-arm64.AppImage", label: "ARM64", extension: ".AppImage" },
		],
	},
]

// the channel a visitor arrived through (objectexplorer.com/youtube → ?channel=youtube) travels on,
// so the host counts downloads by where people came from without a cookie
export function downloadLink(target, channel) {
	if (channel) {
		return `${downloadSite}${target}?channel=${encodeURIComponent(channel)}`
	}
	else {
		return `${downloadSite}${target}`
	}
}
