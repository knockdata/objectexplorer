<script setup>
import { withBase } from "vitepress"
import { onMounted, ref } from "vue"

// A link like objectexplorer.com?open=*usage/ pins one use case: the app is a section of the
// page, opened on what the query names, instead of the stage behind the glass.
const props = defineProps({
	query: { type: String, required: true },
})

const appUrl = "https://objectexplorer.com/app/" + props.query
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
	border-radius: 10px;
	height: min(80vh, 760px);
	overflow: hidden;
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
