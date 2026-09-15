<script setup>
import { useData, withBase } from "vitepress"

const { frontmatter } = useData()
</script>

<!-- Publishing a recording is filling in `video:` — the page is the same page either way. Until
     then the poster stands in, and says so. -->
<template>
	<header class="short-header">
		<p class="short-header-problem">Problem {{ frontmatter.episode }} · {{ frontmatter.problem }}</p>
		<div v-if="frontmatter.video" class="short-header-media">
			<video
				:src="withBase(frontmatter.video)"
				:poster="frontmatter.poster ? withBase(frontmatter.poster) : undefined"
				controls
				playsinline
				preload="metadata"
			></video>
			<p class="short-header-note">{{ frontmatter.runtime }}</p>
		</div>
		<div v-else-if="frontmatter.poster" class="short-header-media">
			<img :src="withBase(frontmatter.poster)" :alt="frontmatter.problem">
			<p class="short-header-note">The lightboard video for this one is still to be recorded. The whole story is below.</p>
		</div>
		<h1>{{ frontmatter.title }}</h1>
	</header>
</template>

<style>
.short-header {
	margin-bottom: 32px;
}

.short-header-problem {
	color: var(--vp-c-text-2);
	font-size: 14px;
	line-height: 1.5;
	margin: 0 0 16px;
}

.short-header-media {
	margin: 0 0 28px;
}

.short-header-media img,
.short-header-media video {
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	display: block;
	margin: 0 auto;
	max-height: 70vh;
	max-width: 100%;
}

.short-header-note {
	color: var(--vp-c-text-3);
	font-size: 13px;
	line-height: 1.5;
	margin: 10px 0 0;
	text-align: center;
}

.short-header h1 {
	color: var(--vp-c-text-1);
	font-size: 32px;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
	margin: 0;
}

@media (min-width: 768px) {
	.short-header h1 {
		font-size: 40px;
		line-height: 1.15;
	}
}
</style>
