// Every download a release carries, as its target: the asset's name after "objectexplorer-"
// (app-darwin-arm64.dmg is objectexplorer-app-darwin-arm64.dmg). Every link points at
// objectexplorer.com/download/<target>, which sends the browser on to that file of the newest
// release and keeps a record of the download (the privacy page says what it keeps).
export const downloadSite = "https://objectexplorer.com/download/"
export const releasesPage = "https://github.com/knockdata/objectexplorer/releases/latest"

// One row per architecture, and one link per file in it. The first file of the first row is the
// one the landing page lights up for a visitor on that platform.
export const downloadPlatforms = [
	{
		id: "mac",
		name: "macOS",
		note: "Signed and notarized. Open the .dmg and drag ObjectExplorer to Applications; the .tar.gz is the command line alone.",
		downloads: [
			{
				label: "Apple silicon",
				files: [
					{ target: "app-darwin-arm64.dmg", extension: ".dmg" },
					{ target: "darwin-arm64.tar.gz", extension: ".tar.gz" },
				],
			},
			{
				label: "Intel",
				files: [
					{ target: "app-darwin-x64.dmg", extension: ".dmg" },
					{ target: "darwin-x64.tar.gz", extension: ".tar.gz" },
				],
			},
		],
	},
	{
		id: "windows",
		name: "Windows",
		note: "Signed. Open the .msix and Windows installs it, with its Start menu entry; the portable .zip runs where it is unpacked.",
		downloads: [
			{
				label: "x64 / AMD64",
				files: [
					{ target: "windows-x64.msix", extension: ".msix" },
					{ target: "windows-x64.zip", extension: ".zip" },
				],
			},
			{
				label: "ARM64",
				files: [
					{ target: "windows-arm64.msix", extension: ".msix" },
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

// the host's link, carrying on the channel a visitor arrived through (objectexplorer.com/youtube →
// ?channel=youtube) and the visitor's id (composables/visitor.js), so the host credits the partner
export function downloadLink(target, channel, id) {
	const query = new URLSearchParams()
	if (channel) {
		query.set("channel", channel)
	}
	if (id) {
		query.set("id", id)
	}
	const search = query.toString()
	if (search) {
		return `${downloadSite}${target}?${search}`
	}
	else {
		return `${downloadSite}${target}`
	}
}
