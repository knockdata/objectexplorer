<script setup>
import { withBase } from "vitepress"
import { ref, watch } from "vue"

const props = defineProps({
	state: { type: String, default: "closed" },
})
const emit = defineEmits(["ready", "close"])

const appUrl = "https://objectexplorer.com/app/"
// The app answers with frame-ancestors naming our own sites (rock2/server/common/Headers.js);
// anywhere else the browser refuses the frame, so those visitors are sent to the app instead.
const homeSites = ["https://objectexplorer.com", "https://knockdata.github.io"]
const hasFrame = ref(false)
const isLoaded = ref(false)

// The frame is created on the first "Open the app", never before: the app is a large download,
// and a visitor who only came to read should not pay for it. Behind the glass until then is a
// picture of it. A phone or a tablet never gets the button, so it only ever sees the picture.
watch(() => props.state, function (state) {
	if (state === "loading") {
		if (homeSites.includes(location.origin) || location.hostname === "localhost") {
			if (isLoaded.value) {
				emit("ready")
			}
			else {
				hasFrame.value = true
			}
		}
		else {
			location.href = appUrl
		}
	}
})

function frameLoaded() {
	isLoaded.value = true
	emit("ready")
}
</script>

<template>
	<div class="app-stage-layer">
		<div class="app-stage" :class="`app-stage-${state}`">
			<img class="app-stage-poster" :src="withBase('/shot/hero.png')" alt="">
			<iframe
				v-if="hasFrame"
				class="app-stage-frame"
				:src="appUrl"
				title="ObjectExplorer"
				allow="midi; autoplay; fullscreen; cross-origin-isolated"
				allowfullscreen
				@load="frameLoaded"
			></iframe>
		</div>
		<div class="app-stage-scrim" :class="`app-stage-scrim-${state}`"></div>
		<p class="app-stage-loading" :class="{ 'app-stage-shown': state === 'loading' }" role="status">Opening the app…</p>
		<button class="app-stage-return" :class="{ 'app-stage-shown': state === 'open' }" type="button" @click="emit('close')">
			<svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
				<path d="M7 12.2V1.8M2.6 6.2 7 1.8l4.4 4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			Back to the tour
		</button>
	</div>
</template>

<style>
.app-stage {
	background: var(--ink);
	filter: brightness(0.5) saturate(0.65) blur(1.5px);
	inset: 0;
	pointer-events: none;
	position: fixed;
	transform: scale(1.015);
	transition: filter 0.7s ease, transform 0.7s ease;
	z-index: 0;
}

.app-stage-open {
	filter: none;
	pointer-events: auto;
	transform: none;
}

.app-stage-poster {
	height: 100%;
	object-fit: cover;
	object-position: left top;
	width: 100%;
}

.app-stage-frame {
	background: var(--ink);
	border: 0;
	height: 100%;
	inset: 0;
	position: absolute;
	width: 100%;
}

.app-stage-scrim {
	background:
		radial-gradient(120% 80% at 8% 0%, rgba(77, 255, 159, 0.08), transparent 60%),
		radial-gradient(90% 70% at 100% 100%, rgba(255, 121, 184, 0.07), transparent 60%),
		linear-gradient(180deg, rgba(10, 12, 14, 0.6), rgba(10, 12, 14, 0.9));
	inset: 0;
	pointer-events: none;
	position: fixed;
	transition: opacity 0.7s ease;
	z-index: 1;
}

.app-stage-scrim-open {
	opacity: 0;
}

.app-stage-loading,
.app-stage-return {
	-webkit-backdrop-filter: blur(10px);
	align-items: center;
	backdrop-filter: blur(10px);
	background: rgba(10, 12, 14, 0.86);
	border: 1px solid var(--rule);
	border-radius: 999px;
	bottom: 20px;
	color: var(--chalk-2);
	display: flex;
	font-family: var(--landing-font);
	font-size: 14.5px;
	gap: 9px;
	left: 50%;
	margin: 0;
	padding: 9px 16px 9px 13px;
	position: fixed;
	transform: translate(-50%, 160%);
	transition: color 0.2s, transform 0.5s cubic-bezier(0.5, 0, 0.2, 1);
	z-index: 9;
}

.app-stage-return {
	cursor: pointer;
}

.app-stage-return:hover {
	color: var(--chalk);
}

.landing .app-stage-shown {
	transform: translate(-50%, 0);
}
</style>
