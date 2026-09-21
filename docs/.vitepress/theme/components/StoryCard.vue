<script setup>
import { withBase } from "vitepress"

defineProps({
	story: { type: Object, required: true },
})
</script>

<!-- The question is the headline, since it is the one a reader recognises as their own afternoon;
     the subtitle is the line under it, in the card's own marker colour. -->
<template>
	<a class="story-card" :href="withBase(story.url)" :style="{ '--marker': `var(--marker-${story.marker})` }">
		<span class="story-card-art">
			<img v-if="story.poster" class="story-card-poster" :src="withBase(story.poster)" alt="" loading="lazy">
			<span class="story-card-badge">{{ story.video ? `▶ ${story.runtime}` : "Read" }}</span>
		</span>
		<span class="story-card-text">
			<span class="story-card-question">{{ story.title }}</span>
			<span class="story-card-subtitle">{{ story.subtitle }}</span>
		</span>
	</a>
</template>

<style>
.story-card {
	background: linear-gradient(180deg, rgba(234, 241, 248, 0.055), rgba(10, 12, 14, 0.5)), var(--ink);
	border: 1px solid var(--rule);
	border-radius: 3px;
	color: var(--chalk);
	display: flex;
	flex-direction: column;
	font-family: var(--landing-font);
	overflow: hidden;
	scroll-snap-align: start;
	text-decoration: none;
	transition: border-color 0.2s ease, transform 0.2s ease;
}

.story-card:hover,
.story-card:focus-visible {
	border-color: rgba(234, 241, 248, 0.34);
	transform: translateY(-3px);
}

.story-card-art {
	aspect-ratio: 4 / 3;
	background: radial-gradient(120% 80% at 50% 8%, rgba(234, 241, 248, 0.07), transparent 62%);
	border-top: 3px solid var(--marker);
	display: block;
	overflow: hidden;
	position: relative;
}

.story-card-art .story-card-poster {
	border: 0;
	border-radius: 0;
	height: 100%;
	margin: 0;
	object-fit: cover;
	object-position: left top;
	width: 100%;
}

.story-card-badge {
	-webkit-backdrop-filter: blur(6px);
	backdrop-filter: blur(6px);
	background: rgba(10, 12, 14, 0.74);
	border: 1px solid var(--rule);
	border-radius: 999px;
	bottom: 14px;
	color: var(--chalk-2);
	font-size: 12.5px;
	left: 14px;
	padding: 5px 11px;
	position: absolute;
}

.story-card-text {
	border-top: 1px solid var(--rule-soft);
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 6px;
	padding: 15px 16px 18px;
}

.story-card-question {
	font-size: 16.5px;
	font-weight: 600;
	letter-spacing: -0.014em;
	line-height: 1.22;
}

.story-card-subtitle {
	color: var(--marker);
	font-size: 14px;
	line-height: 1.42;
}

/* The card that ends the rail: the same frame, no picture, one word. */
.story-card-more {
	align-items: center;
	color: var(--chalk-2);
	display: flex;
	font-size: 17px;
	justify-content: center;
	min-height: 160px;
}

.story-card-more:hover,
.story-card-more:focus-visible {
	color: var(--brand);
}

@media (min-width: 1200px) {
	.story-landing .story-card {
		flex: 0 0 auto;
		width: clamp(210px, 19vw, 248px);
	}

	.story-landing .story-card-art {
		aspect-ratio: 9 / 16;
	}
}
</style>
