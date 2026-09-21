<script setup>
import { useData, withBase } from "vitepress"

const { frontmatter } = useData()
</script>

<!-- The ideal, as a photo: the story's `poster`, a real screenshot of the thing done, with its
     `caption` saying what is in the picture. A story writes <StoryPoster /> where the picture goes. -->
<template>
	<figure v-if="frontmatter.poster" class="story-poster">
		<img :src="withBase(frontmatter.poster)" :alt="frontmatter.caption ?? frontmatter.title">
		<figcaption v-if="frontmatter.caption">{{ frontmatter.caption }}</figcaption>
	</figure>
</template>

<style>
.vp-doc .story-poster {
	margin: 28px 0;
}

.vp-doc .story-poster img {
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	display: block;
	margin: 0 auto;
	max-height: 70vh;
	max-width: 100%;
}

.vp-doc .story-poster figcaption {
	color: var(--vp-c-text-2);
	font-size: 14px;
	line-height: 1.5;
	margin-top: 10px;
	text-align: center;
}
</style>
