// Every installer a release carries, as <platform>-<architecture>.<extension>. Once the page has
// asked GitHub for the newest release, a link points straight at that release's asset
// (ObjectExplorer-0.7.2-arm64.dmg). Until then, or when GitHub cannot be reached, it points at
// objectexplorer.com/download/<target>, which the host resolves (rock2/server/web/serveDownload.js).
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

// the name shown before the release is known
export function downloadName(target) {
	return `ObjectExplorer-${target}`
}

// a release asset names no platform: mac-arm64.dmg is the asset whose name ends in -arm64.dmg
export function assetSuffix(target) {
	return `-${target.slice(target.indexOf("-") + 1)}`
}

// the release asset itself when known; otherwise the host's link, which carries on the channel a
// visitor arrived through (objectexplorer.com/youtube → ?channel=youtube) so the host counts it
export function downloadLink(target, channel, assetUrl) {
	if (assetUrl) {
		return assetUrl
	}
	else if (channel) {
		return `${downloadSite}${target}?channel=${encodeURIComponent(channel)}`
	}
	else {
		return `${downloadSite}${target}`
	}
}
