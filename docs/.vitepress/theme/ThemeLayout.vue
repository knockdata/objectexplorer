<script setup>
import { useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import { computed } from "vue"
import ShortFooter from "./components/ShortFooter.vue"
import ShortHeader from "./components/ShortHeader.vue"

const { page } = useData()

// shorts/<slug>.md is an episode; shorts/index.md is the list of them
const isShort = computed(function () {
	const relativePath = page.value.relativePath
	return relativePath.startsWith("shorts/") && relativePath !== "shorts/index.md"
})
</script>

<template>
	<DefaultTheme.Layout>
		<template #doc-before>
			<ShortHeader v-if="isShort" />
		</template>
		<template #doc-after>
			<ShortFooter v-if="isShort" />
		</template>
	</DefaultTheme.Layout>
</template>
