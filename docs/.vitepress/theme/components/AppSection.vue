<script setup>
import { withBase } from "vitepress"
import { onMounted, ref } from "vue"

// A link like objectexplorer.com?open=*usage/ pins one use case: the app is a section of the
// page, opened on what the query names, instead of the stage behind the glass.
const props = defineProps({
	query: { type: String, required: true },
})

const appUrl = "https://objectexplorer.com/app" + props.query
// Same rule as AppStage: the app only lets our own sites frame it (rock2/server/common/Headers.js).
const homeSites = ["https://objectexplorer.com", "https://knockdata.github.io"]
const canFrame = ref(false)

onMounted(function () {
	canFrame.value = homeSites.includes(location.origin) || location.hostname === "localhost"
})
</script>

<template>
	<section class="app-section landing-wrap">
		<div class="app-section-frame">
			<a v-if="canFrame" class="app-section-expand" :href="appUrl" title="Open full app" aria-label="Open full app">
				<svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
					<path d="M1.5 5.5v-4h4M12.5 5.5v-4h-4M1.5 8.5v4h4M12.5 8.5v4h-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</a>
			<iframe
				v-if="canFrame"
				:src="appUrl"
				title="ObjectExplorer"
				allow="midi; autoplay; fullscreen; cross-origin-isolated"
				allowfullscreen
			></iframe>
			<a v-else :href="appUrl">
				<img :src="withBase('/screenshot/hero.png')" alt="ObjectExplorer">
			</a>
		</div>
		<p class="app-section-caption">
			It runs right here. <a :href="appUrl">Open full app ↗</a>
		</p>
	</section>
</template>

<style>
.app-section {
	padding-block: 0 clamp(40px, 9vh, 96px);
}

.app-section-frame {
	background: var(--ink);
	border: 1px solid var(--rule);
	border-radius: 1px;
	height: min(80vh, 760px);
	overflow: visible;
	position: relative;
}

.app-section-expand {
	align-items: center;
	background: rgba(10, 12, 14, 0.86);
	border: 1px solid var(--rule);
	border-radius: 6px;
    color: var(--chalk-2);
    cursor: pointer;
    display: flex;
    
    justify-content: center;
    position: absolute;
    right: -15px;
    top: -15px;
	height: 30px;
    width: 30px;
    z-index: 1;
	padding: 5px;
}

.app-section-expand:hover {
	color: var(--brand);
}

.app-section-frame iframe,
.app-section-frame img {
	border: 0;
	display: block;
	height: 100%;
	object-fit: cover;
	object-position: left top;
	width: 100%;
}

.app-section-caption {
	color: var(--chalk-3);
	font-size: 14px;
	margin: 13px 2px 0;
}

.app-section-caption a {
	color: var(--brand);
}
</style>
