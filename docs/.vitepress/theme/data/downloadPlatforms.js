// Every installer a release carries, named the way the host's download links name them:
// objectexplorer.com/download/<platform>-<architecture>.<extension>. The version is never in the
// link — the host picks that asset out of the newest release (rock2/server/web/serveDownload.js),
// and counts the download on the way.
export const downloadSite = "https://objectexplorer.com/download/"
export const releasesPage = "https://github.com/knockdata/objectexplorer/releases/latest"

// One row per architecture, and one link per file in it. The first file of the first row is the
// one the landing page lights up for a visitor on that platform, so .msix comes before .exe.
export const downloadPlatforms = [
	{
		id: "mac",
		name: "macOS",
		note: "Signed and notarized. Open and drag to Applications.",
		downloads: [
			{ label: "Apple silicon", files: [{ target: "mac-arm64.dmg", extension: ".dmg" }] },
			{ label: "Intel", files: [{ target: "mac-x64.dmg", extension: ".dmg" }] },
		],
	},
	{
		id: "windows",
		name: "Windows",
		note: ".msix/.exe are signed; SmartScreen may still popup.",
		downloads: [
			{
				label: "x64 / AMD64",
				files: [
					{ target: "windows-x64.msix", extension: ".msix" },
					{ target: "windows-x64.exe", extension: ".exe" },
				],
			},
			{
				label: "ARM64",
				files: [
					{ target: "windows-arm64.msix", extension: ".msix" },
					{ target: "windows-arm64.exe", extension: ".exe" },
				],
			},
		],
	},
	{
		id: "linux",
		name: "Linux",
		note: "Open in browser when no WebKitGTK installed.",
		downloads: [
			{ label: "x64 / AMD64", files: [{ target: "linux-x64.AppImage", extension: ".AppImage" }] },
			{ label: "ARM64", files: [{ target: "linux-arm64.AppImage", extension: ".AppImage" }] },
		],
	},
]

// every target in the list, for the release lookup that reads their sizes
export function downloadTargets() {
	return downloadPlatforms.flatMap(platform => platform.downloads.flatMap(download => download.files.map(file => file.target)))
}

// the asset's name in the release, which is also the name the file is saved under
export function downloadName(target) {
	return `ObjectExplorer-${target}`
}

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
