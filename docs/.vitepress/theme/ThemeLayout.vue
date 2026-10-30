<script setup>
import { useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import { computed, onMounted } from "vue"
import { readVisitor } from "./composables/visitor.js"
import StoryFooter from "./components/StoryFooter.vue"
import StoryHeader from "./components/StoryHeader.vue"

const { page } = useData()

// a partner's ?id= on any page of the documentation: carried on in its links
onMounted(function () {
	readVisitor()
})

// story/<slug>.md is an episode; story/index.md is the list of them
const isStory = computed(function () {
	const relativePath = page.value.relativePath
	return relativePath.startsWith("story/") && relativePath !== "story/index.md"
})
</script>

<template>
	<DefaultTheme.Layout>
		<template #doc-before>
			<StoryHeader v-if="isStory" />
		</template>
		<template #doc-after>
			<StoryFooter v-if="isStory" />
		</template>
	</DefaultTheme.Layout>
</template>
