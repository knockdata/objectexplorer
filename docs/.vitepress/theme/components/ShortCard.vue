<script setup>
import { withBase } from "vitepress"

defineProps({
	short: { type: Object, required: true },
})
</script>

<!-- The System-1 line is the headline, since it is the one people remember; the problem is the
     sub-line, since it is the one people search for. -->
<template>
	<a class="short-card" :href="withBase(short.url)" :style="{ '--marker': `var(--marker-${short.marker})` }">
		<span class="short-card-art">
			<img v-if="short.poster" class="short-card-poster" :src="withBase(short.poster)" alt="" loading="lazy">
			<span v-else class="short-card-episode">{{ short.episode }}</span>
			<span class="short-card-badge">{{ short.video ? `▶ ${short.runtime}` : "Read" }}</span>
		</span>
		<span class="short-card-text">
			<span class="short-card-title">{{ short.title }}</span>
			<span class="short-card-problem">{{ short.problem }}</span>
		</span>
	</a>
</template>

<style>
.short-card {
	background: linear-gradient(180deg, rgba(234, 241, 248, 0.055), rgba(10, 12, 14, 0.5)), var(--ink);
	border: 1px solid var(--rule);
	border-radius: 10px;
	color: var(--chalk);
	display: flex;
	flex-direction: column;
	font-family: var(--landing-font);
	overflow: hidden;
	scroll-snap-align: start;
	text-decoration: none;
	transition: border-color 0.2s ease, transform 0.2s ease;
}

.short-card:hover,
.short-card:focus-visible {
	border-color: rgba(234, 241, 248, 0.34);
	transform: translateY(-3px);
}

.short-card-art {
	aspect-ratio: 4 / 3;
	background: radial-gradient(120% 80% at 50% 8%, rgba(234, 241, 248, 0.07), transparent 62%);
	border-top: 3px solid var(--marker);
	display: block;
	overflow: hidden;
	position: relative;
}

.short-card-art .short-card-poster {
	border: 0;
	border-radius: 0;
	height: 100%;
	margin: 0;
	object-fit: cover;
	object-position: left top;
	width: 100%;
}

.short-card-episode {
	color: var(--marker);
	font-size: 96px;
	font-variation-settings: "wdth" 120, "wght" 700;
	left: 18px;
	letter-spacing: -0.04em;
	line-height: 1;
	position: absolute;
	top: 18px;
}

.short-card-badge {
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

.short-card-text {
	border-top: 1px solid var(--rule-soft);
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 6px;
	padding: 15px 16px 18px;
}

.short-card-title {
	font-size: 16.5px;
	font-variation-settings: "wdth" 102, "wght" 580;
	letter-spacing: -0.014em;
	line-height: 1.22;
}

.short-card-problem {
	color: var(--chalk-3);
	font-size: 14px;
	line-height: 1.42;
}

@media (min-width: 1200px) {
	.shorts-landing .short-card {
		flex: 0 0 auto;
		width: clamp(210px, 19vw, 248px);
	}

	.shorts-landing .short-card-art {
		aspect-ratio: 9 / 16;
	}
}
</style>
