// Every download a release carries, as its target: the asset's name after "objectexplorer-"
// (app-darwin-arm64.zip is objectexplorer-app-darwin-arm64.zip). Once the page has asked GitHub
// for the newest release, a link points straight at that release's asset. Until then, or when
// GitHub cannot be reached, it points at objectexplorer.com/download/<target>, which the host
// resolves (foldone's service/landing/download.js).
export const downloadSite = "https://objectexplorer.com/download/"
export const releasesPage = "https://github.com/knockdata/objectexplorer/releases/latest"

// One row per architecture, and one link per file in it. The first file of the first row is the
// one the landing page lights up for a visitor on that platform.
export const downloadPlatforms = [
	{
		id: "mac",
		name: "macOS",
		note: "Signed and notarized. Unzip and drag ObjectExplorer.app to Applications; the .tar.gz is the command line alone.",
		downloads: [
			{
				label: "Apple silicon",
				files: [
					{ target: "app-darwin-arm64.zip", extension: ".app" },
					{ target: "darwin-arm64.tar.gz", extension: ".tar.gz" },
				],
			},
			{
				label: "Intel",
				files: [
					{ target: "app-darwin-x64.zip", extension: ".app" },
					{ target: "darwin-x64.tar.gz", extension: ".tar.gz" },
				],
			},
		],
	},
	{
		id: "windows",
		name: "Windows",
		note: "Signed. The .appinstaller installs the msix and keeps it up to date; the .zip runs where it is unpacked.",
		downloads: [
			{
				label: "x64 / AMD64",
				files: [
					{ target: "windows-x64.appinstaller", extension: ".appinstaller" },
					{ target: "windows-x64.zip", extension: ".zip" },
				],
			},
			{
				label: "ARM64",
				files: [
					{ target: "windows-arm64.appinstaller", extension: ".appinstaller" },
					{ target: "windows-arm64.zip", extension: ".zip" },
				],
			},
		],
	},
	{
		id: "linux",
		name: "Linux",
		note: "One binary for glibc 2.28 and later (Debian 10, RHEL 8, Ubuntu 20.04 on); its README.txt says where it and the menu entry go.",
		downloads: [
			{ label: "x64 / AMD64", files: [{ target: "linux-x64.tar.gz", extension: ".tar.gz" }] },
			{ label: "ARM64", files: [{ target: "linux-arm64.tar.gz", extension: ".tar.gz" }] },
		],
	},
]

// Homebrew, for macOS and Linux: the command line (and its service), and the desktop app
export const brewCommands = [
	"brew install knockdata/tap/objectexplorer",
	"brew install --cask knockdata/tap/objectexplorer-app",
]

// every target in the list, for the release lookup that reads their sizes
export function downloadTargets() {
	return downloadPlatforms.flatMap(platform => platform.downloads.flatMap(download => download.files.map(file => file.target)))
}

// the release asset's name for a target, also shown before the release is known
export function downloadName(target) {
	return `objectexplorer-${target}`
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
