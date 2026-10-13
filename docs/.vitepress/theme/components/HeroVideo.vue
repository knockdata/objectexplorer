<script setup>
import { withBase } from "vitepress"
import { ref } from "vue"

// The film lives on YouTube. Until it is clicked the hero is our own poster image, so the page
// loads nothing from Google and needs no cookie notice. The click is the viewer asking for the
// film: only then is the player made, from youtube-nocookie.com, and the line on the poster says
// beforehand where it plays from.
const VIDEO = "OA-ALTYy2vk"

const playing = ref(false)

function play() {
	playing.value = true
}

function player_address() {
	return `https://www.youtube-nocookie.com/embed/${VIDEO}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
}
</script>

<template>
	<div class="hero-video-frame">
		<iframe
			v-if="playing"
			class="hero-video"
			:src="player_address()"
			title="ObjectExplorer, the 40-second tour"
			allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
			allowfullscreen
		></iframe>
		<button v-else class="hero-video-poster" type="button" @click="play" aria-label="Play the film">
			<img class="hero-video" :src="withBase('/video/poster.png')" alt="" />
			<span class="hero-video-play">
				<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
			</span>
			<span class="hero-video-notice">Plays from YouTube; their privacy policy applies.</span>
		</button>
	</div>
</template>

<style>
.hero-video-frame {
	aspect-ratio: 16 / 9;
	border: 1px solid var(--rule);
	border-radius: 13px;
	box-shadow: 0 40px 90px -50px rgba(0, 0, 0, 0.95);
	display: block;
	overflow: hidden;
	position: relative;
}

.hero-video {
	border: 0;
	display: block;
	height: 100%;
	object-fit: cover;
	width: 100%;
}

.hero-video-poster {
	background: none;
	border: 0;
	cursor: pointer;
	display: block;
	height: 100%;
	padding: 0;
	position: relative;
	width: 100%;
}

.hero-video-play {
	align-items: center;
	background: var(--brand);
	border-radius: 50%;
	box-shadow: 0 0 0 10px var(--brand-soft), 0 18px 40px -16px var(--brand-glow);
	color: var(--brand-text);
	display: flex;
	height: 66px;
	justify-content: center;
	left: 50%;
	padding-left: 3px;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	transition: transform 0.2s ease;
	width: 66px;
}

.hero-video-poster:hover .hero-video-play {
	transform: translate(-50%, -50%) scale(1.06);
}

.hero-video-notice {
	background: rgba(0, 0, 0, 0.55);
	border-radius: 6px;
	bottom: 10px;
	color: #fff;
	font-size: 12px;
	left: 50%;
	padding: 3px 10px;
	position: absolute;
	transform: translateX(-50%);
	white-space: nowrap;
}
</style>
