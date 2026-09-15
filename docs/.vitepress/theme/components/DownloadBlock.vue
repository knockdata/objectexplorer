<script setup>
import { onMounted, ref } from "vue"
import useRelease from "../composables/useRelease.js"
import { downloadLink, downloadPlatforms, releasesPage } from "../data/downloadPlatforms.js"
import ShareLink from "./ShareLink.vue"

const command = "npx @knockdata/objectexplorer"
const release = useRelease()
const channel = ref("")
const copied = ref(false)

// A visitor who came through objectexplorer.com/youtube arrives with ?channel=youtube, and the
// download links carry it on.
onMounted(function () {
	channel.value = new URLSearchParams(location.search).get("channel") ?? ""
})

async function copyCommand() {
	try {
		await navigator.clipboard.writeText(command)
		copied.value = true
		setTimeout(function () {
			copied.value = false
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
		<p class="download-lede">
			The desktop app runs on your machine. Credentials stay in <code>~/.objectexplorer</code> and
			your platform's own keychain, and there is no backend that sees your objects, because there is none.
		</p>

		<div class="download-platforms desktop-only">
			<div v-for="platform in downloadPlatforms" :key="platform.id" class="download-platform" :class="`download-platform-${platform.id}`">
				<h3>{{ platform.name }}<span class="download-here">Your system</span></h3>
				<ul>
					<li v-for="download in platform.downloads" :key="download.target">
						<a class="download-package" :href="downloadLink(download.target, channel)">
							{{ download.label }}
							<span>{{ download.extension }}<template v-if="release.sizes[download.target]"> · {{ release.sizes[download.target] }}</template></span>
						</a>
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
				url="https://objectexplorer.com/#download"
				title="Download ObjectExplorer"
				text="ObjectExplorer is a desktop app. Open this link on your computer to install it."
				label="Share the download link"
			/>
		</div>

		<div class="download-run">
			<div class="download-run-text">
				<h3>Or run it without installing</h3>
				<p>Starts on localhost and opens in your browser. Node 20 or newer.</p>
			</div>
			<div class="download-command">
				<code>{{ command }}</code>
				<button type="button" @click="copyCommand">{{ copied ? "Copied" : "Copy" }}</button>
			</div>
		</div>

		<p class="download-all">
			<a :href="releasesPage">{{ release.version ? `${release.version} · ` : "" }}All packages and release notes on GitHub</a>
		</p>
	</section>
</template>

<style src="./download-block.css"></style>
