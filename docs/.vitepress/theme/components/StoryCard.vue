<script setup>
import { withBase } from "vitepress"
import { ref } from "vue"

defineProps({
	story: { type: Object, required: true },
})

// Play swaps the poster for the screen recording, which is 9:16 like the card, and plays it in place.
const playing = ref(false)

function playRecording() {
	playing.value = true
}

// A card with a recorded video plays it in place while the pointer is on it.
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
     screenshot the card shows, placed at build time by posterPlacement.js; `background` fills the whole
     card, so the picture and the card read as one area. -->
<template>
	<div
		class="story-card"
		:style="{ '--marker': `var(--marker-${story.marker})`, background: story.background }"
		@mouseenter="playVideo"
		@mouseleave="pauseVideo"
	>
		<span class="story-card-art">
			<video
				v-if="playing"
				class="story-card-poster"
				:src="withBase(story.recording)"
				autoplay
				controls
				playsinline
			></video>
			<a v-else class="story-card-art-link" :href="withBase(story.url)" tabindex="-1">
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
			</a>
			<span v-if="playing === false" class="story-card-actions">
				<a class="story-card-badge" :href="withBase(story.url)">
					<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" />
						<path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
					</svg>
					<span>Read</span>
				</a>
				<button v-if="story.recording" class="story-card-badge" type="button" @click="playRecording">
					<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
					<span>Play</span>
				</button>
			</span>
		</span>
		<a class="story-card-text" :href="withBase(story.url)">
			<span class="story-card-question">{{ story.title }}</span>
			<span class="story-card-subtitle">{{ story.subtitle }}</span>
		</a>
	</div>
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
.story-card:focus-within {
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

.story-card-art-link {
	display: block;
	height: 100%;
}

.story-card-actions {
	bottom: 14px;
	display: flex;
	gap: 8px;
	justify-content: space-between;
	left: 14px;
	position: absolute;
	right: 14px;
}

.story-card-badge {
	-webkit-backdrop-filter: blur(6px);
	align-items: center;
	backdrop-filter: blur(6px);
	background: rgba(10, 12, 14, 0.74);
	border: 1px solid var(--rule);
	border-radius: 999px;
	color: var(--chalk-2);
	cursor: pointer;
	display: inline-flex;
	font-family: inherit;
	font-size: 12.5px;
	gap: 5px;
	padding: 5px 11px;
	text-decoration: none;
}

.story-card-badge:hover,
.story-card-badge:focus-visible {
	border-color: var(--marker);
	color: var(--chalk);
}

.story-card-text {
	/* border-top: 1px solid var(--rule-soft); */
	color: inherit;
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 6px;
	padding: 15px 16px 18px;
	text-decoration: none;
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
