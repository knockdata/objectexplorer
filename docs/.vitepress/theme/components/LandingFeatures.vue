<script setup>
import { withBase } from "vitepress"
import { features } from "../data/features.js"

// What the app does, as tiles under the hero: a picture of it, what it is in a line, and the page that
// says more. The list is data/features.js.
</script>

<template>
	<section class="features landing-wrap">
		<div class="story-head">
			<h2 style="text-transform: uppercase;">One window for all of it</h2>
			<p class="rock">and nothing leaves your machine</p>
		</div>
		<div class="features-grid">
			<a v-for="feature in features" :key="feature.link" class="features-tile" :href="withBase(feature.link)">
				<img class="features-picture" :src="withBase(feature.picture)" :alt="feature.alt" loading="lazy">
				<span class="features-title">{{ feature.title }}</span>
				<span class="features-text">{{ feature.text }}</span>
			</a>
		</div>
	</section>
</template>

<style>
.features {
	padding-block: clamp(32px, 6vh, 72px) clamp(16px, 3vh, 32px);
}

.features-grid {
	display: grid;
	gap: 18px;
	grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 640px) {
	.features-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1100px) {
	.features-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.features-tile {
	background: linear-gradient(180deg, rgba(234, 241, 248, 0.055), rgba(10, 12, 14, 0.5)), var(--ink);
	border: 1px solid var(--rule-soft);
	border-radius: 3px;
	color: var(--chalk);
	display: flex;
	flex-direction: column;
	gap: 6px;
	overflow: hidden;
	padding-bottom: 16px;
	text-decoration: none;
	transition: border-color 0.2s ease, transform 0.2s ease;
}

.features-tile:hover,
.features-tile:focus-visible {
	border-color: rgba(234, 241, 248, 0.34);
	transform: translateY(-3px);
}

.features-picture {
	aspect-ratio: 16 / 10;
	border-bottom: 1px solid var(--rule-soft);
	display: block;
	margin-bottom: 8px;
	object-fit: cover;
	object-position: left top;
	width: 100%;
}

.features-title {
	font-size: 16px;
	font-weight: 600;
	letter-spacing: -0.01em;
	padding-inline: 16px;
}

.features-text {
	color: var(--chalk-2);
	font-size: 14px;
	line-height: 1.5;
	padding-inline: 16px;
}
</style>
