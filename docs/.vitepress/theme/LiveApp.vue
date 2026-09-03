<script setup>
import { onMounted, ref } from "vue"

const appUrl = "https://objectexplorer.com/app/"
const frame = ref(null)
// The app answers with `frame-ancestors`, naming the sites of ours that may embed it (see
// rock2/server/common/Headers.js): objectexplorer.com itself, the GitHub Pages mirror of these
// pages, and localhost while a site is being edited. On any other origin the browser refuses the
// frame and draws a broken document, so those get the link instead. Decided on mount, because the
// server render has no origin to ask about.
const homeSites = ["https://objectexplorer.com", "https://knockdata.github.io"]
const canEmbed = ref(false)

onMounted(function () {
	canEmbed.value = homeSites.includes(location.origin) || location.hostname === "localhost"
})

// Expand gives the app the whole screen, which is the only way an embedded window stops being a
// picture of an app and starts being one.
function expand() {
	if (document.fullscreenElement) {
		document.exitFullscreen()
	}
	else {
		frame.value.requestFullscreen()
	}
}
</script>

<template>
	<div class="live-app-frame" v-if="canEmbed">
		<div class="live-app-bar">
			<button class="live-app-expand" type="button" @click="expand">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
				Expand to the whole screen
			</button>
		</div>
		<iframe
			ref="frame"
			class="live-app"
			:src="`${appUrl}?animate`"
			title="ObjectExplorer running in the browser"
			loading="lazy"
			allow="midi; autoplay; fullscreen; cross-origin-isolated"
			allowfullscreen
		></iframe>
	</div>
	<p class="live-app-away" v-else>
		<a :href="appUrl">Open the app at objectexplorer.com</a> — it embeds only on our own sites.
	</p>
</template>
