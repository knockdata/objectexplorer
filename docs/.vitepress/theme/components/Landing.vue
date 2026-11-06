<script setup>
import { withBase } from "vitepress"
import { computed, onMounted, ref } from "vue"
import { readVisitor } from "../composables/visitor.js"
import { useLanguage, wantedLanguage } from "../language/language.js"
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
const { current } = useLanguage()

// The English landing, /, is where a visitor arrives without asking for a language: one whose kept
// choice or browser asks for another goes on to that language's landing, with the same query. Another
// language's landing was asked for by its address, so it stays.
function goToWantedLanguage() {
	const wanted = wantedLanguage()
	if (current().name === "english" && wanted.name !== "english") {
		location.replace(withBase(wanted.landing) + location.search + location.hash)
	}
}

onMounted(function () {
	goToWantedLanguage()
	if (new URLSearchParams(location.search).has("open")) {
		appQuery.value = location.search
	}
	readVisitor()
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
