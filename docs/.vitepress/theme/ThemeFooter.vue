<script setup>
import { useSidebar } from "vitepress/theme"
import { computed } from "vue"
import SiteFooter from "./components/SiteFooter.vue"

const { hasSidebar } = useSidebar()

// Stands in for VitePress's own VPFooter (config.js aliases it), under the rule it had: a page with a
// sidebar — the documentation — has no footer.
const showFooter = computed(function () {
	return hasSidebar.value === false
})
</script>

<template>
	<SiteFooter v-if="showFooter" />
</template>
