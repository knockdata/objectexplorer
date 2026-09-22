<script setup>
import { withBase } from "vitepress"
import { copyright, footerLinks, headerLinks, linkOf, socialLinks } from "../data/siteLinks.js"
import ShareLink from "./ShareLink.vue"

defineProps({
	appLink: { type: String, default: "" },
})

const emit = defineEmits(["close", "open-app"])

// the header's pages, then the footer's that the header does not already carry
const menuLinks = [...headerLinks, ...footerLinks.filter(footerLink => headerLinks.every(headerLink => headerLink.link !== footerLink.link))]
</script>

<!-- On a phone the header, its app action and the footer fold into this one menu, opened from
     LandingNav. -->
<template>
	<div id="site-menu" class="site-menu">
		<nav class="site-menu-links" aria-label="Menu">
			<a v-for="menuLink in menuLinks" :key="menuLink.name" :href="linkOf(menuLink.link)" @click="emit('close')">{{ menuLink.name }}</a>
		</nav>
		<div class="site-menu-action">
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
		</div>
		<nav class="site-menu-social" aria-label="Social media">
			<a v-for="socialLink in socialLinks" :key="socialLink.name" :href="socialLink.link" :aria-label="socialLink.name" :title="socialLink.name" target="_blank" rel="noopener noreferrer">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
					<path :d="socialLink.path" />
				</svg>
			</a>
		</nav>
		<p class="site-menu-copyright">{{ copyright }}</p>
	</div>
</template>

<style>
/* under the header's row and over the page, the height of the screen */
.site-menu {
	background: var(--ink);
	border-top: 1px solid var(--rule-soft);
	height: calc(100dvh - var(--vp-nav-height));
	left: 0;
	overflow-y: auto;
	padding: 8px var(--landing-gutter) 32px;
	position: absolute;
	right: 0;
	top: 100%;
}

.site-menu-links {
	display: flex;
	flex-direction: column;
}

.landing-nav .site-menu-links a {
	border-bottom: 1px solid var(--rule-soft);
	color: var(--chalk-2);
	font-size: 17px;
	padding: 14px 0;
}

.landing-nav .site-menu-links a:hover {
	color: var(--chalk);
}

.site-menu-action {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-top: 24px;
}

.site-menu .landing-nav-action {
	display: flex;
	justify-content: center;
	width: 100%;
}

.site-menu-social {
	color: var(--chalk-3);
	display: flex;
	gap: 22px;
	margin-top: 28px;
}

.site-menu-social a {
	align-items: center;
	display: flex;
	height: 36px;
}

.site-menu-copyright {
	color: var(--chalk-3);
	font-size: 14px;
	margin: 12px 0 0;
}

/* the page under an open menu stays where it is */
@media (max-width: 767px) {
	html.site-menu-open {
		overflow: hidden;
	}
}

@media (min-width: 768px) {
	.site-menu {
		display: none;
	}
}
</style>
