<script setup>
import { onMounted, ref } from "vue"

const appUrl = "https://objectexplorer.com/app/"
const frame = ref(null)
// The app answers with `Content-Security-Policy: frame-ancestors 'self'`, so only a page on
// objectexplorer.com may embed it. Anywhere else — a local dev server, the GitHub Pages copy of
// these pages — the browser refuses the frame and draws a broken document, so those get the link
// instead. Decided on mount, because the server render has no origin to ask about.
const canEmbed = ref(false)

onMounted(function () {
	canEmbed.value = location.origin === "https://objectexplorer.com"
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
			allow="midi; autoplay; fullscreen"
			allowfullscreen
		></iframe>
	</div>
	<p class="live-app-away" v-else>
		<a :href="appUrl">Open the app at objectexplorer.com</a> — it embeds only on its own site.
	</p>
</template>
