<script setup>
import { onMounted, ref } from "vue"
import AppSection from "./AppSection.vue"
import AppStage from "./AppStage.vue"
import DownloadBlock from "./DownloadBlock.vue"
import LandingHero from "./LandingHero.vue"
import LandingNav from "./LandingNav.vue"
import StoryGrid from "./StoryGrid.vue"
import SiteFooter from "./SiteFooter.vue"

// The page is a lightboard pane standing in front of the app. "Open App" loads the app behind
// the glass, then wipes the pane away; "Back to the tour" brings it back.
//   closed → loading (the app is arriving behind the glass) → open (the pane is wiped)
const appState = ref("closed")
// ?open=… pins a use case: the app becomes a section after the hero, with nothing behind the page
const appQuery = ref("")

onMounted(function () {
	if (new URLSearchParams(location.search).has("open")) {
		appQuery.value = location.search
	}
})

function openApp() {
	if (appQuery.value) {
		location.href = "https://objectexplorer.com/app/" + appQuery.value
	}
	else {
		appState.value = "loading"
	}
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
		<AppStage v-if="appQuery === ''" :state="appState" @ready="showApp" @close="closeApp" />
		<div class="landing-pitch" :aria-hidden="appState === 'open' ? 'true' : undefined">
			<LandingNav @open-app="openApp" />
			<main>
				<LandingHero :pinned="appQuery !== ''" @open-app="openApp" />
				<AppSection v-if="appQuery" :query="appQuery" />
				<StoryGrid />
				<DownloadBlock />
			</main>
			<SiteFooter />
		</div>
	</div>
</template>
