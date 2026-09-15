<script setup>
import { useData, withBase } from "vitepress"

const { frontmatter } = useData()
</script>

<!-- the story's still, placed right before its closing line by storyMarkdown.js -->
<template>
	<img v-if="frontmatter.poster" class="story-poster" :src="withBase(frontmatter.poster)" :alt="frontmatter.title">
</template>

<style>
.vp-doc .story-poster {
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	display: block;
	margin: 28px auto;
	max-height: 70vh;
	max-width: 100%;
}
</style>
