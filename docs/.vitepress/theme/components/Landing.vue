<script setup>
import { ref } from "vue"
import AppStage from "./AppStage.vue"
import DownloadBlock from "./DownloadBlock.vue"
import LandingHero from "./LandingHero.vue"
import LandingNav from "./LandingNav.vue"
import StoryGrid from "./StoryGrid.vue"
import SiteFooter from "./SiteFooter.vue"

// The page is a lightboard pane standing in front of the app. "Open the app" loads the app behind
// the glass, then wipes the pane away; "Back to the tour" brings it back.
//   closed → loading (the app is arriving behind the glass) → open (the pane is wiped)
const appState = ref("closed")

function openApp() {
	appState.value = "loading"
}

function showApp() {
	appState.value = "open"
}

function closeApp() {
	appState.value = "closed"
	window.scrollTo({ top: 0 })
}
</script>

<template>
	<div class="landing" :class="`landing-app-${appState}`">
		<AppStage :state="appState" @ready="showApp" @close="closeApp" />
		<div class="landing-pitch" :aria-hidden="appState === 'open' ? 'true' : undefined">
			<LandingNav @open-app="openApp" />
			<main>
				<LandingHero @open-app="openApp" />
				<StoryGrid />
				<DownloadBlock />
			</main>
			<SiteFooter />
		</div>
	</div>
</template>
