<script setup>
import { onMounted, ref } from "vue"
import useRelease from "../composables/useRelease.js"
import { readVisitor, visitorId } from "../composables/visitor.js"
import { brewCommands, downloadLink, downloadName, downloadPlatforms, downloadSources, releasesPage } from "../data/downloadPlatforms.js"
import { socialLinks } from "../data/siteLinks.js"
import ShareLink from "./ShareLink.vue"

// the commands under the download cards: npx, and Homebrew's formula and cask
const runs = [
	{ title: "Run in Command Line", text: "Use in your browser", commands: ["npx @knockdata/objectexplorer"] },
	{ title: "Install with Homebrew", text: "macOS and Linux: the command line, then the desktop app", commands: brewCommands },
]
const release = useRelease()
const channel = ref("")
// the command last put on the clipboard, while its tick shows
const copied = ref("")
// the source the visitor chose on the switch, remembered in this browser ("" none: the server's default)
const chosen = ref("")
const chosenKey = "download-source"
// the footer's GitHub mark
const githubMark = socialLinks.find(link => link.name === "GitHub").path

// A visitor who came through objectexplorer.com/youtube arrives with ?channel=youtube, and the
// download links carry it on, with the visitor's id (composables/visitor.js).
onMounted(function () {
	channel.value = new URLSearchParams(location.search).get("channel") ?? ""
	readVisitor()
	try {
		chosen.value = localStorage.getItem(chosenKey) ?? ""
	}
	catch (error) {
		chosen.value = ""
	}
})

// The source the links carry: the visitor's choice, else the default our server gave for this
// address (Direct in mainland China). "" while the server has not answered or has no Direct (a
// server from before it): the links stay as they were and the server decides.
function source() {
	if (release.value.direct) {
		return chosen.value || release.value.source
	}
	else {
		return ""
	}
}

function choose(id) {
	chosen.value = id
	try {
		localStorage.setItem(chosenKey, id)
	}
	catch (error) {
		console.warn(error)
	}
}

// the full filename, and its size once the release lookup has answered
function downloadTitle(target) {
	const name = release.value.names[target] ?? downloadName(target)
	const size = release.value.sizes[target]
	if (size) {
		return `${name} · ${size}`
	}
	else {
		return name
	}
}

async function copyCommand(text) {
	try {
		await navigator.clipboard.writeText(text)
		copied.value = text
		setTimeout(function () {
			copied.value = ""
		}, 1600)
	}
	catch (error) {
		console.warn(error)
	}
}
</script>

<!-- Which card is the visitor's own is decided in CSS from html[data-platform], not here: the
     head script has set it before the first paint, so the right card is first and lit from the
     start rather than jumping there once the page is hydrated. -->
<template>
	<section id="download" class="download landing-wrap">
		<h2>Open it once and see your own storage in it.</h2>
		<div class="download-lede-row">
			<p class="download-lede">
				The desktop app runs on your machine. Credentials stay in <code>~/.objectexplorer</code> and
				your platform's own keychain, and there is no backend that sees your objects, because there is none.
			</p>
			<div v-if="release.direct" class="download-source desktop-only">
				<span class="download-source-label">Download from</span>
				<div class="download-source-choices" role="radiogroup" aria-label="Download from">
					<button
						v-for="choice in downloadSources"
						:key="choice.id"
						type="button"
						role="radio"
						class="download-source-choice"
						:class="{ 'download-source-chosen': source() === choice.id }"
						:aria-checked="source() === choice.id ? 'true' : 'false'"
						:title="choice.title"
						@click="choose(choice.id)"
					>
						<svg v-if="choice.id === 'github'" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
							<path :d="githubMark" />
						</svg>
						<!-- Lucide's server -->
						<svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
							<rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
							<line x1="6" x2="6.01" y1="6" y2="6" />
							<line x1="6" x2="6.01" y1="18" y2="18" />
						</svg>
						<span>{{ choice.name }}</span>
					</button>
				</div>
			</div>
		</div>

		<div class="download-platforms desktop-only">
			<div v-for="platform in downloadPlatforms" :key="platform.id" class="download-platform" :class="`download-platform-${platform.id}`">
				<h3>{{ platform.name }}<span class="download-here">Your system</span></h3>
				<ul>
					<li v-for="download in platform.downloads" :key="download.label" class="download-architecture">
						<span class="download-architecture-name">{{ download.label }}</span>
						<a
							v-for="file in download.files"
							:key="file.target"
							class="download-package"
							:href="downloadLink(file.target, channel, visitorId(), source())"
							:title="downloadTitle(file.target)"
						>{{ file.extension }}</a>
					</li>
				</ul>
				<p class="download-note">{{ platform.note }}</p>
			</div>
		</div>

		<div class="download-share mobile-only">
			<h3>Install it on the computer you work on</h3>
			<p>ObjectExplorer is a desktop app for macOS, Windows and Linux. Send yourself the link and open it there.</p>
			<ShareLink
				class="download-share-button"
				url="https://objectexplorer.com/download"
				title="Download ObjectExplorer"
				text="ObjectExplorer is a desktop app. Open this link on your computer to install it."
				label="Share the download link"
			/>
		</div>

		<div v-for="run in runs" :key="run.title" class="download-run">
			<div class="download-run-text">
				<h3>{{ run.title }}</h3>
				<p>{{ run.text }}</p>
			</div>
			<div class="download-commands">
				<div v-for="line in run.commands" :key="line" class="download-command">
					<!-- a line may break after each slash (wbr, which a copied selection leaves out) -->
					<code><template v-for="(part, index) in line.split('/')" :key="index">{{ index > 0 ? "/" : "" }}<wbr v-if="index > 0">{{ part }}</template></code>
					<button type="button" :aria-label="copied === line ? 'Copied' : 'Copy the command'" :title="copied === line ? 'Copied' : 'Copy'" @click="copyCommand(line)">
						<svg v-if="copied === line" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<polyline points="20 6 9 17 4 12" />
						</svg>
						<svg v-else viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<p class="download-all">
			<a :href="releasesPage">{{ release.version ? `${release.version} · ` : "" }}All packages and release notes on GitHub</a>
		</p>
	</section>
</template>

<style src="./download-block.css"></style>
