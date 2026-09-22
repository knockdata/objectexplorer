import { onMounted, ref } from "vue"
import { assetSuffix, downloadTargets } from "../data/downloadPlatforms.js"

const releaseUrl = "https://api.github.com/repos/knockdata/objectexplorer/releases/latest"
let request = null

// The newest release's version and, per installer, its asset's name, URL and size, so a download
// link points straight at ObjectExplorer-<version>-<architecture>.<extension> on GitHub. When this
// request fails (a rate limit, offline, scripts off) the links stay objectexplorer.com/download/<target>,
// which the host resolves. One request per page load, shared by every component that asks.
export default function useRelease() {
	const release = ref({ version: "", sizes: {}, names: {}, urls: {} })
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
	let release = { version: "", sizes: {}, names: {}, urls: {} }
	try {
		const response = await fetch(releaseUrl, { headers: { Accept: "application/vnd.github+json" } })
		if (response.ok) {
			const body = await response.json()
			const sizes = {}
			const names = {}
			const urls = {}
			for (const target of downloadTargets()) {
				const asset = body.assets.find(candidate => candidate.name.endsWith(assetSuffix(target)))
				if (asset) {
					sizes[target] = `${Math.round(asset.size / 1048576)} MB`
					names[target] = asset.name
					urls[target] = asset.browser_download_url
				}
			}
			release = { version: body.tag_name, sizes, names, urls }
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
