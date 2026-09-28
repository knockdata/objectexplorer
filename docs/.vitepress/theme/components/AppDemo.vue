<script setup>
import { withBase } from "vitepress"
import { onMounted, ref } from "vue"

// The app itself, framed on the page, opened on the one demo object the page talks about:
//
//   <AppDemo open="folder/demo/nl_train_stations.parquet" view="hex" :off="['tour', 'auth']" />
//
// The frame turns off the parts of the app the page is not about — by default all of them, so only
// the object shows (rock2/explorer/query-parameters.md has every parameter). The corner icon opens
// the full app on whatever the frame shows now, so a reader who went somewhere keeps going.
const props = defineProps({
	// an item in the public app's demo folder, the only root objectexplorer.com/app serves:
	// "folder/demo/<path>", or "usage/" for the usage disc
	open: { type: String, required: true },
	// the render mode: hex, text, notebook, …
	view: { type: String, default: "" },
	// notebook cells, each "<type>:<code>"; long ones read best from a <script setup> in the page
	cells: { type: Array, default: () => [] },
	search: { type: String, default: "" },
	// the tree opens down to this item
	treePath: { type: String, default: "" },
	// the parts of the window the frame turns off; a demo that needs the tree or the toolbar lists less
	off: { type: Array, default: () => ["activity", "tree", "tab", "header", "footer", "tour", "auth"] },
	// handed to the view as component.<name>: { insight: 'on' }; a frame also adds controls: 'off'
	component: { type: Object, default: () => ({}) },
	height: { type: String, default: "520px" },
	// shown instead of the frame where the app will not be framed
	image: { type: String, default: "/screenshot/hero.png" },
	alt: { type: String, default: "ObjectExplorer" },
})

const framedComponent = { controls: "off", ...props.component }

// framed: the frame's own URL, with its parts turned off; the full app has everything
function query(framed) {
	const params = new URLSearchParams()
	params.set("open", "*" + props.open)
	if (props.view) {
		params.set("view", props.view)
	}
	for (const cell of props.cells) {
		params.append("cell", cell)
	}
	if (props.search) {
		params.set("search", props.search)
	}
	if (props.treePath) {
		params.set("treePath", props.treePath)
	}
	const handed = framed ? framedComponent : props.component
	for (const [name, value] of Object.entries(handed)) {
		params.set("component." + name, value)
	}
	if (framed) {
		for (const part of props.off) {
			params.set(part, "off")
		}
	}
	return params.toString()
}

// Same rule as AppSection: the app only lets our own sites frame it (rock2/server/common/Headers.js).
// __APP_URL__ is the live app, or the one APP_URL named when the docs were started (config.js).
const homeSites = ["https://objectexplorer.com", "https://knockdata.github.io"]
const appUrl = ref(__APP_URL__)
const canFrame = ref(false)
const $frame = ref(null)

onMounted(function () {
	canFrame.value = homeSites.includes(location.origin) || location.hostname === "localhost"
})

// The frame's own URL is readable when it is on our origin. A frame still on the object it
// opened on is sent as this page asked for it, cells and all — the app rewrites its URL
// without them — and one that moved on is sent where it is now.
function openFull(event) {
	let search = query(false)
	try {
		const current = new URLSearchParams($frame.value.contentWindow.location.search)
		const moved = current.get("open") !== "*" + props.open
		if (moved) {
			for (const part of props.off) {
				current.delete(part)
			}
			current.delete("component.controls")
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
