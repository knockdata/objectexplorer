<script setup>
import { useData, withBase } from "vitepress"

const { frontmatter } = useData()
</script>

<!-- The question, its answer, then the picture. Publishing a recording is filling in `video:` —
     the page is the same page either way; until then the poster stands in, and says so. -->
<template>
	<header class="story-header">
		<h1>{{ frontmatter.title }}</h1>
		<p class="story-header-answer">{{ frontmatter.answer }}</p>
		<div v-if="frontmatter.video" class="story-header-media">
			<video
				:src="withBase(frontmatter.video)"
				:poster="frontmatter.poster ? withBase(frontmatter.poster) : undefined"
				controls
				playsinline
				preload="metadata"
			></video>
			<p class="story-header-note">{{ frontmatter.runtime }}</p>
		</div>
		<div v-else-if="frontmatter.poster" class="story-header-media">
			<img :src="withBase(frontmatter.poster)" :alt="frontmatter.title">
			<p class="story-header-note">The lightboard video for this one is still to be recorded. The whole story is below.</p>
		</div>
	</header>
</template>

<style>
.story-header {
	margin-bottom: 32px;
}

.story-header h1 {
	color: var(--vp-c-text-1);
	font-size: 32px;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
	margin: 0;
}

.story-header-answer {
	color: var(--vp-c-brand-1);
	font-size: 20px;
	line-height: 1.4;
	margin: 10px 0 28px;
}

.story-header-media {
	margin: 0 0 28px;
}

.story-header-media img,
.story-header-media video {
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	display: block;
	margin: 0 auto;
	max-height: 70vh;
	max-width: 100%;
}

.story-header-note {
	color: var(--vp-c-text-3);
	font-size: 13px;
	line-height: 1.5;
	margin: 10px 0 0;
	text-align: center;
}

@media (min-width: 768px) {
	.story-header h1 {
		font-size: 40px;
		line-height: 1.15;
	}
}
</style>
