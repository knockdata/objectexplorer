<script setup>
import { onMounted, ref } from "vue"

const appUrl = "https://objectexplorer.com/app/"

// Two questions, both answerable only in a browser, so both are asked on mount rather than during
// the server render.
//
// 1. Is this a desktop? ObjectExplorer is a desktop app — a tree, a grid and a notebook side by
//    side, driven with a keyboard and a pointer. A phone or a tablet cannot give it that, so it is
//    told plainly instead of being handed an app that will disappoint it.
// 2. May this page frame it? The app answers with `frame-ancestors` naming our own sites (see
//    rock2/server/common/Headers.js); anywhere else the browser refuses the frame and draws a
//    broken document, so those get a link.
const homeSites = ["https://objectexplorer.com", "https://knockdata.github.io"]
const isDesktop = ref(false)
const canEmbed = ref(false)

onMounted(function () {
	isDesktop.value = window.matchMedia("(min-width: 900px) and (pointer: fine)").matches
	canEmbed.value = homeSites.includes(location.origin) || location.hostname === "localhost"
})
</script>

<template>
	<div class="live-app-frame" v-if="isDesktop && canEmbed">
		<h2>Try it right here</h2>
		<p>
			This is the app itself, running in the frame — the same build the desktop binary and
			<code>npx</code> run, demonstrating itself. Click into it: the buckets are a public demo,
			and nothing you do in it leaves your browser.
		</p>
		<div class="live-app-bar">
			<!-- the app on its own site, in this tab: a fullscreened frame is still a frame, with
			     no address of its own to keep, share or reload -->
			<a class="live-app-expand" :href="appUrl">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
				Open the whole app
			</a>
		</div>
		<iframe
			class="live-app"
			:src="`${appUrl}?animate`"
			title="ObjectExplorer running in the browser"
			loading="lazy"
			allow="midi; autoplay; fullscreen; cross-origin-isolated"
			allowfullscreen
		></iframe>
	</div>
	<div v-else-if="isDesktop">
		<h2>Try it right here</h2>
		<p class="live-app-away">
			<a :href="appUrl">Open the app at objectexplorer.com</a> — it embeds only on our own sites.
		</p>
	</div>
	<div v-else>
		<h2>Made for the desktop</h2>
		<p class="live-app-away">
			<strong>ObjectExplorer is a desktop app.</strong> It puts a tree, a grid and a notebook
			side by side and expects a keyboard and a pointer, so there is nothing worth trying on a
			phone or a tablet. Open <a href="https://objectexplorer.com">objectexplorer.com</a> on a
			computer, or read <a href="/getting-started">getting started</a> to install it — the film
			above shows what it does either way.
		</p>
	</div>
</template>
