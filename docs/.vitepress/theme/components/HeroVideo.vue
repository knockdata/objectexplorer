<script setup>
import { withBase } from "vitepress"
import { ref } from "vue"

const video = ref(null)

// The hero shows the poster frame until it is clicked. A click is a user gesture, which is what
// lets it play with its sound; fullscreen is what makes a hero-sized picture worth watching.
function expand() {
	const element = video.value
	if (document.fullscreenElement) {
		document.exitFullscreen()
	}
	else {
		element.controls = true
		element.play()
		// play first, then ask for the screen: fullscreen is refused on iOS, where a video has its
		// own API, and the film should still be running in the hero when that happens
		element.requestFullscreen().catch(function () { })
	}
}
</script>

<template>
	<div class="hero-video-frame" @click="expand">
		<video
			ref="video"
			class="hero-video"
			:src="withBase('/video/objectexplorer.mp4')"
			:poster="withBase('/video/poster.png')"
			playsinline
			loop
		></video>
		<span class="hero-video-play">
			<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
		</span>
	</div>
</template>

<style>
.hero-video-frame {
	border: 1px solid var(--rule);
	border-radius: 13px;
	box-shadow: 0 40px 90px -50px rgba(0, 0, 0, 0.95);
	cursor: pointer;
	display: block;
	overflow: hidden;
	position: relative;
}

.hero-video {
	display: block;
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

.hero-video-frame:hover .hero-video-play {
	transform: translate(-50%, -50%) scale(1.06);
}
</style>
