import { onMounted, ref } from "vue"
import { downloadPlatforms } from "../data/downloadPlatforms.js"

const releaseUrl = "https://api.github.com/repos/knockdata/objectexplorer/releases/latest"
let request = null

// The newest release's version and each installer's size, for the label beside a download link —
// only the label. The link itself is objectexplorer.com/download/<target>, which the host resolves,
// so when this request fails (a rate limit, offline, scripts off) the page loses a number and
// nothing else. One request per page load, shared by every component that asks.
export default function useRelease() {
	const release = ref({ version: "", sizes: {} })
	onMounted(async function () {
		release.value = await fetchRelease()
	})
	return release
}

function fetchRelease() {
	if (request === null) {
		request = readRelease()
	}
	return request
}

async function readRelease() {
	let release = { version: "", sizes: {} }
	try {
		const response = await fetch(releaseUrl, { headers: { Accept: "application/vnd.github+json" } })
		if (response.ok) {
			const body = await response.json()
			const sizes = {}
			const targets = downloadPlatforms.flatMap(platform => platform.downloads.map(download => download.target))
			for (const target of targets) {
				// mac-arm64.dmg is the asset whose name ends in -arm64.dmg
				const suffix = `-${target.slice(target.indexOf("-") + 1)}`
				const asset = body.assets.find(candidate => candidate.name.endsWith(suffix))
				if (asset) {
					sizes[target] = `${Math.round(asset.size / 1048576)} MB`
				}
			}
			release = { version: body.tag_name, sizes }
		}
		else {
			console.warn("release lookup answered", response.status)
		}
	}
	catch (error) {
		console.warn(error)
	}
	return release
}
