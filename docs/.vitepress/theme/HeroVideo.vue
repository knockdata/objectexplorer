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
			:poster="withBase('/video/poster.jpg')"
			playsinline
			loop
		></video>
		<span class="hero-video-play">
			<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
		</span>
	</div>
</template>
