import { onMounted, ref } from "vue"
import { downloadName, downloadTargets, releaseFacts } from "../data/downloadPlatforms.js"

const releaseUrl = "https://api.github.com/repos/knockdata/objectexplorer/releases/latest"
let request = null

// The newest release's version and, per download, its asset's name and size, shown beside the
// links, and whether our server can hand the files out itself (direct) with this visitor's default
// source (source: "direct" in mainland China, else "github"). Asked of our own server first
// (objectexplorer.com/download/release.json), which reaches GitHub where the visitor may not; a
// server without it (before 1031-3 is deployed) or one that fails leaves the page as it was: GitHub's
// API asked from the browser, no switch (direct false). The links themselves are always
// objectexplorer.com/download/<target>, which the host resolves; when both lookups fail only the
// sizes are missing. One request per page load, shared by every component that asks.
export default function useRelease() {
	const release = ref(emptyRelease())
	onMounted(async function () {
		release.value = await fetchRelease()
	})
	return release
}

function emptyRelease() {
	return { version: "", sizes: {}, names: {}, source: "", direct: false }
}

function fetchRelease() {
	if (request === null) {
		request = readRelease()
	}
	return request
}

// an .appinstaller is a few hundred bytes
function sizeText(bytes) {
	if (bytes < 1048576) {
		return `${Math.max(1, Math.round(bytes / 1024))} KB`
	}
	else {
		return `${Math.round(bytes / 1048576)} MB`
	}
}

async function readRelease() {
	const ours = await readOurRelease()
	if (ours.direct) {
		return ours
	}
	else {
		return await readGithubRelease()
	}
}

// our server's release.json: { version, source, files: { <target>: { name, size } } }
async function readOurRelease() {
	let release = emptyRelease()
	try {
		const response = await fetch(releaseFacts, { signal: AbortSignal.timeout(8000) })
		const facts = response.ok ? await response.json() : null
		if (facts && facts.version && (facts.source === "direct" || facts.source === "github")) {
			const sizes = {}
			const names = {}
			for (const target of downloadTargets()) {
				const file = facts.files[target]
				if (file) {
					sizes[target] = sizeText(file.size)
					names[target] = file.name
				}
			}
			release = { version: facts.version, sizes, names, source: facts.source, direct: true }
		}
	}
	catch (error) {
		console.info("release.json not answered: GitHub's release asked instead", error.message)
	}
	return release
}

async function readGithubRelease() {
	let release = emptyRelease()
	try {
		const response = await fetch(releaseUrl, { headers: { Accept: "application/vnd.github+json" } })
		if (response.ok) {
			const body = await response.json()
			const sizes = {}
			const names = {}
			for (const target of downloadTargets()) {
				const asset = body.assets.find(candidate => candidate.name === downloadName(target))
				if (asset) {
					sizes[target] = sizeText(asset.size)
					names[target] = asset.name
				}
			}
			release = { version: body.tag_name, sizes, names, source: "", direct: false }
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
