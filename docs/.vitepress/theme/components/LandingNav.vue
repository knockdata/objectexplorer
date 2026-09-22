<script setup>
import { withBase } from "vitepress"
import { VPNavBarSearch } from "vitepress/theme"
import { onMounted, onUnmounted, ref, watch } from "vue"
import { headerLinks, linkOf } from "../data/siteLinks.js"
import ShareLink from "./ShareLink.vue"
import SiteMenu from "./SiteMenu.vue"

// Every page wears this header. On the landing "Open App" opens the app behind the glass; every
// other page (ThemeNav) passes `appLink`, and there it is a plain link to the app.
defineProps({
	appLink: { type: String, default: "" },
})

const emit = defineEmits(["open-app"])

// On a phone the header's links, its app action and the footer fold into one menu (SiteMenu). While it is open the
// page under it stays put (the class on <html>); Escape or following a link closes it.
const menuOpen = ref(false)

function toggleMenu() {
	menuOpen.value = menuOpen.value === false
}

function closeMenu() {
	menuOpen.value = false
}

function openApp() {
	closeMenu()
	emit("open-app")
}

function closeOnEscape(event) {
	if (event.key === "Escape") {
		closeMenu()
	}
}

watch(menuOpen, function (open) {
	document.documentElement.classList.toggle("site-menu-open", open)
})

onMounted(function () {
	window.addEventListener("keydown", closeOnEscape)
})

onUnmounted(function () {
	window.removeEventListener("keydown", closeOnEscape)
	document.documentElement.classList.remove("site-menu-open")
})
</script>

<template>
	<header class="landing-nav">
		<div class="landing-nav-inner">
			<a class="landing-nav-mark" :href="withBase('/')">
				<img :src="withBase('/img/64.png')" alt="" width="24" height="24">
				ObjectExplorer
			</a>
			<VPNavBarSearch />
			<nav class="landing-nav-links" aria-label="Site">
				<a v-for="headerLink in headerLinks" :key="headerLink.name" :href="linkOf(headerLink.link)">{{ headerLink.name }}</a>
			</nav>
			<a v-if="appLink" class="landing-nav-action landing-nav-secondary desktop-only" :href="appLink">Open App</a>
			<button v-else class="landing-nav-action landing-nav-secondary desktop-only" type="button" @click="emit('open-app')">Open App</button>
			<a class="landing-nav-action landing-nav-primary desktop-only" :href="withBase('/download')">Download</a>
			<ShareLink
				class="landing-nav-action mobile-only"
				url="https://objectexplorer.com/"
				title="ObjectExplorer"
				text="The VS Code for cloud storage. Open it on the computer you work on."
				label="App link"
			/>
			<button class="landing-nav-menu-button" type="button" aria-controls="site-menu" :aria-expanded="menuOpen" aria-label="Menu" @click="toggleMenu">
				<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
					<path v-if="menuOpen" d="M6 6l12 12M18 6 6 18" />
					<path v-else d="M4 7h16M4 12h16M4 17h16" />
				</svg>
			</button>
		</div>
		<SiteMenu v-if="menuOpen" :app-link="appLink" @close="closeMenu" @open-app="openApp" />
	</header>
</template>

<style>
/* the landing's type and colour sit on the header itself, so it looks the same on a documentation page */
.landing-nav {
	-webkit-backdrop-filter: blur(14px) saturate(120%);
	-webkit-font-smoothing: antialiased;
	backdrop-filter: blur(14px) saturate(120%);
	background: linear-gradient(180deg, rgba(10, 12, 14, 0.99), rgba(10, 12, 14, 0.96));
	border-bottom: 1px solid var(--rule-soft);
	color: var(--chalk);
	font-family: var(--landing-font);
	font-size: 17px;
	line-height: 1.55;
	position: sticky;
	top: 0;
	z-index: 5;
}

.landing-nav a {
	color: inherit;
	text-decoration: none;
}

.landing-nav-inner {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: 8px clamp(14px, 3vw, 34px);
	margin: 0 auto;
	max-width: var(--landing-width);
	padding: 12px calc(var(--landing-gutter) - var(--landing-header-stretch)); /* header has smaller font, stretch a bit to look visually aligned vertically */
}

.landing-nav-mark {
	align-items: center;
	display: flex;
	font-weight: 600;
	gap: 10px;
	letter-spacing: -0.012em;
	margin-right: auto;
}

/* VitePress lays its search out to fill its own nav bar; here it is one more item in the row */
.landing-nav .VPNavBarSearch {
	flex-grow: 0;
	padding-left: 0;
}

/* on a phone the links are in the menu, not in the row */
.landing-nav-links {
	align-items: center;
	display: none;
	gap: clamp(16px, 2.4vw, 28px);
}

.landing-nav-links a {
	align-items: center;
	color: var(--chalk-2);
	display: inline-flex;
	font-size: 15px;
	gap: 6px;
	padding: 4px 0;
}

.landing-nav .landing-nav-links a:hover {
	border-bottom: 2px solid var(--brand);
	color: var(--chalk);
}

/* the same rounded rectangle as the landing's own primary button */
.landing-nav .landing-nav-action {
	background: transparent;
	border: 1.5px solid var(--brand-glow);
	border-radius: 6px;
	color: var(--brand);
	cursor: pointer;
	font-size: 15px;
	padding: 8px 16px;
	text-wrap: nowrap;
}

.landing-nav .landing-nav-action:hover {
	background: var(--brand-soft);
}

/* Download is the call to action; Open App sits beside it, muted */
.landing-nav .landing-nav-primary {
	background: var(--brand);
	border-color: var(--brand);
	color: var(--brand-text);
	font-weight: 600;
}

.landing-nav .landing-nav-primary:hover {
	background: var(--brand);
	box-shadow: 0 0 16px -4px var(--brand-glow);
}

.landing-nav .landing-nav-secondary {
	border-color: var(--rule);
	color: var(--chalk-2);
}

.landing-nav .landing-nav-secondary:hover {
	background: var(--rule-soft);
	color: var(--chalk);
}

.landing-nav-menu-button {
	align-items: center;
	background: transparent;
	border: 0;
	color: var(--chalk);
	cursor: pointer;
	display: flex;
	height: 40px;
	justify-content: center;
	padding: 0;
	width: 36px;
}

/* On a phone the row is the mark, search and the menu button; the app action is in the menu with the
   links (SiteMenu). VitePress's phone search button is 48px wide and 55px tall. */
@media (max-width: 767px) {
	.landing-nav-inner {
		column-gap: 10px;
	}

	.landing-nav .DocSearch-Button {
		height: 40px;
		width: 32px;
	}

	.landing-nav-inner > .landing-nav-action {
		display: none;
	}
}

/* one row, as tall as the nav VitePress offsets its sidebar and content by, less the border */
@media (min-width: 768px) {
	.landing-nav-inner {
		flex-wrap: nowrap;
		height: calc(var(--vp-nav-height) - 1px);
		padding-block: 0;
	}

	.landing-nav-links {
		display: flex;
	}

	.landing-nav-menu-button {
		display: none;
	}
}
</style>
