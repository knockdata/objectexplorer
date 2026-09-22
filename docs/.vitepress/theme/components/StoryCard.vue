<script setup>
import { withBase } from "vitepress"

defineProps({
	story: { type: Object, required: true },
})

// A card with a recorded video plays it in place while the pointer or focus is on it.
function playVideo(event) {
	const video = event.currentTarget.querySelector("video")
	if (video) {
		video.play().catch(() => {})
	}
}

function pauseVideo(event) {
	const video = event.currentTarget.querySelector("video")
	if (video) {
		video.pause()
	}
}
</script>

<!-- The question is the headline, since it is the one a reader recognises as their own afternoon;
     the subtitle is the line under it, in the card's own marker colour. The art is 9:16 at every
     width, the shape a recorded short plays in; `focus` in the frontmatter is the area of a wide
     screenshot the card shows, placed at build time by posterPlacement.js. -->
<template>
	<a
		class="story-card"
		:href="withBase(story.url)"
		:style="{ '--marker': `var(--marker-${story.marker})` }"
		@mouseenter="playVideo"
		@mouseleave="pauseVideo"
		@focus="playVideo"
		@blur="pauseVideo"
	>
		<span class="story-card-art">
			<video
				v-if="story.video"
				class="story-card-poster"
				:src="withBase(story.video)"
				:poster="story.poster ? withBase(story.poster) : undefined"
				muted
				playsinline
				loop
				preload="none"
			></video>
			<img
				v-else-if="story.poster"
				class="story-card-poster"
				:src="withBase(story.poster)"
				:style="story.posterStyle"
				alt=""
				loading="lazy"
			>
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
	border: 1px solid var(--rule-soft);
	border-radius: 3px;
	box-shadow: 0px 6px 10px -4px color-mix(in srgb, var(--marker) 60%, transparent);
	color: var(--chalk);
	display: flex;
	flex-direction: column;
	font-family: var(--landing-font);
	overflow: hidden;
	scroll-snap-align: start;
	text-decoration: none;
	transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.story-card:hover,
.story-card:focus-visible {
	border-color: rgba(234, 241, 248, 0.34);
	box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--marker) 75%, transparent);
	transform: translateY(-3px);
}

.story-card-art {
	aspect-ratio: 9 / 16;
	background: radial-gradient(120% 80% at 50% 8%, rgba(234, 241, 248, 0.07), transparent 62%);
	display: block;
	overflow: hidden;
	position: relative;
}

.story-card-art .story-card-poster {
	border: 0;
	border-radius: 0;
	display: block;
	height: 100%;
	margin: 0;
	object-fit: cover;
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

.story-landing .story-card {
	flex: 0 0 auto;
	width: clamp(140px, 38vw, 248px);
}
</style>
