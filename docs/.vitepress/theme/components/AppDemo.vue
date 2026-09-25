<script setup>
import { withBase } from "vitepress"
import { onMounted, ref } from "vue"
import { appDemos } from "../data/appDemos.js"

// The app itself, framed on the page, opened on the one demo object the page talks about. With
// `focus` the frame shows only that object: no tree, no tabs, no toolbar, no status bar
// (rock2/explorer/src/urlOptions.js reads the same parameters). The corner icon opens the full
// app on whatever the frame shows now, so a reader who went somewhere inside it keeps going.
const props = defineProps({
	// a key of data/appDemos.js, which says what the frame opens and how
	name: { type: String, required: true },
})

const demo = appDemos[props.name]
const focus = demo.focus ?? true
const height = demo.height ?? "520px"
const image = demo.image ?? "/screenshot/hero.png"
const alt = demo.alt ?? "ObjectExplorer"

// framed: the frame's own URL, which shows no tours; the full app is left to offer them
function query(framed) {
	const params = new URLSearchParams()
	params.set("open", "*" + demo.open)
	if (demo.view) {
		params.set("view", demo.view)
	}
	for (const cell of demo.cells ?? []) {
		params.append("cell", cell)
	}
	if (demo.search) {
		params.set("search", demo.search)
	}
	if (demo.reveal) {
		params.set("reveal", "")
	}
	if (framed && focus) {
		params.set("focus", "")
	}
	if (framed) {
		params.set("tour", "off")
	}
	return params.toString()
}

// Same rule as AppSection: the app only lets our own sites frame it (rock2/server/common/Headers.js).
// `?app=http://localhost:3034/` on the page frames a local app instead, to try a change before it ships.
const homeSites = ["https://objectexplorer.com", "https://knockdata.github.io"]
const appUrl = ref("https://objectexplorer.com/app/")
const canFrame = ref(false)
const $frame = ref(null)

onMounted(function () {
	const local = new URLSearchParams(location.search).get("app")
	if (local) {
		appUrl.value = local
	}
	canFrame.value = homeSites.includes(location.origin) || location.hostname === "localhost"
})

// The frame's own URL is readable when it is on our origin. A frame still on the object it
// opened on is sent as this page asked for it, cells and all — the app rewrites its URL
// without them — and one that moved on is sent where it is now.
function openFull(event) {
	let search = query(false)
	try {
		const current = new URLSearchParams($frame.value.contentWindow.location.search)
		const moved = current.get("open") !== "*" + demo.open
		if (moved) {
			current.delete("focus")
			current.delete("tour")
			search = current.toString()
		}
		else {
			// still on the page's object
		}
	}
	catch (error) {
		// another origin: the page's own query is what there is
	}
	event.preventDefault()
	window.open(appUrl.value + "?" + search, "_blank", "noopener")
}
</script>

<template>
	<figure class="app-demo">
		<div class="app-demo-frame" :style="{ height }">
			<a class="app-demo-expand" :href="appUrl + '?' + query(false)" title="Open in the full app" aria-label="Open in the full app" @click="openFull">
				<svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
					<path d="M1.5 5.5v-4h4M12.5 5.5v-4h-4M1.5 8.5v4h4M12.5 8.5v4h-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</a>
			<iframe
				v-if="canFrame"
				ref="$frame"
				:src="appUrl + '?' + query(true)"
				:title="alt"
				loading="lazy"
				allow="midi; autoplay; fullscreen; cross-origin-isolated"
				allowfullscreen
			></iframe>
			<a v-else :href="appUrl + '?' + query(false)">
				<img :src="withBase(image)" :alt="alt">
			</a>
		</div>
	</figure>
</template>

<style>
.app-demo {
	margin: 20px 0;
}

.app-demo-frame {
	background: var(--vp-c-bg-alt);
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	overflow: visible;
	position: relative;
}

.app-demo-expand {
	align-items: center;
	background: rgba(10, 12, 14, 0.86);
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	color: #d4d4d4;
	display: flex;
	height: 30px;
	justify-content: center;
	padding: 5px;
	position: absolute;
	right: -15px;
	top: -15px;
	width: 30px;
	z-index: 1;
}

.app-demo-expand:hover {
	color: var(--vp-c-brand-1);
}

.app-demo-frame iframe,
.app-demo-frame img {
	border: 0;
	border-radius: 6px;
	display: block;
	height: 100%;
	object-fit: cover;
	object-position: left top;
	width: 100%;
}
</style>
