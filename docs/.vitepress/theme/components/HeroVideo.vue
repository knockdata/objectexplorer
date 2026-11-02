<script setup>
import YoutubePlayer from "./YoutubePlayer.vue"
</script>

<template>
	<div class="hero-video-frame">
		<YoutubePlayer video="hDgvhjoIy4Y" poster="/video/poster.png" title="ObjectExplorer, the two-minute tour" own="/video/objectexplorer.mp4" />
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
</style>
