<script setup>
import { computed, onMounted, ref } from "vue"
import AppSection from "./AppSection.vue"
import DownloadBlock from "./DownloadBlock.vue"
import LandingHero from "./LandingHero.vue"
import LandingNav from "./LandingNav.vue"
import StoryGrid from "./StoryGrid.vue"
import SiteFooter from "./SiteFooter.vue"

// ?open=… pins a use case: the app becomes a section after the hero, and "Open App" takes the same
// query to the app itself
const appQuery = ref("")
const appLink = computed(() => "https://objectexplorer.com/app/" + appQuery.value)

onMounted(function () {
	if (new URLSearchParams(location.search).has("open")) {
		appQuery.value = location.search
	}
})

</script>

<template>
	<div class="landing">
		<div class="landing-pitch">
			<LandingNav :app-link="appLink" />
			<main>
				<LandingHero :pinned="appQuery !== ''" :app-link="appLink" />
				<AppSection v-if="appQuery" :query="appQuery" />
				<StoryGrid />
				<DownloadBlock />
			</main>
			<SiteFooter />
		</div>
	</div>
</template>
