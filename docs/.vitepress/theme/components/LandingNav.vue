<script setup>
import { withBase } from "vitepress"
import ShareLink from "./ShareLink.vue"

const emit = defineEmits(["open-app"])
</script>

<template>
	<header class="landing-nav">
		<div class="landing-nav-inner">
			<a class="landing-nav-mark" :href="withBase('/')">
				<img :src="withBase('/img/64.png')" alt="" width="24" height="24">
				ObjectExplorer
			</a>
			<nav class="landing-nav-links" aria-label="Site">
				<a :href="withBase('/pricing')">Pricing</a>
				<a :href="withBase('/what-is-objectexplorer')">Docs</a>
				<a :href="withBase('/changelog')">Changelog</a>
				<a href="https://github.com/knockdata/objectexplorer" target="_blank" rel="noopener noreferrer">
					<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
					</svg>
					GitHub
				</a>
			</nav>
			<button class="landing-nav-action desktop-only" type="button" @click="emit('open-app')">Open the app</button>
			<ShareLink
				class="landing-nav-action mobile-only"
				url="https://objectexplorer.com/"
				title="ObjectExplorer"
				text="The VS Code for cloud storage. Open it on the computer you work on."
				label="App link"
			/>
		</div>
	</header>
</template>

<style>
.landing-nav {
	-webkit-backdrop-filter: blur(14px) saturate(120%);
	backdrop-filter: blur(14px) saturate(120%);
	background: linear-gradient(180deg, rgba(10, 12, 14, 0.92), rgba(10, 12, 14, 0.66));
	border-bottom: 1px solid var(--rule-soft);
	position: sticky;
	top: 0;
	z-index: 5;
}

.landing-nav-inner {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: 8px clamp(14px, 3vw, 34px);
	margin: 0 auto;
	max-width: var(--landing-width);
	padding: 12px var(--landing-gutter);
}

.landing-nav-mark {
	align-items: center;
	display: flex;
	font-variation-settings: "wdth" 108, "wght" 620;
	gap: 10px;
	letter-spacing: -0.012em;
	margin-right: auto;
}

.landing-nav-links {
	align-items: center;
	display: flex;
	gap: clamp(16px, 2.4vw, 28px);
	order: 3;
	width: 100%;
}

.landing-nav-links a {
	align-items: center;
	border-bottom: 1px solid transparent;
	color: var(--chalk-2);
	display: inline-flex;
	font-size: 15px;
	gap: 6px;
	padding: 4px 0;
}

.landing .landing-nav-links a:hover {
	border-bottom-color: var(--brand);
	color: var(--chalk);
}

.landing-nav .landing-nav-action {
	background: transparent;
	border: 1px solid var(--brand-glow);
	border-radius: 999px;
	color: var(--brand);
	cursor: pointer;
	font-size: 15px;
	padding: 8px 16px;
}

.landing-nav .landing-nav-action:hover {
	background: var(--brand-soft);
}

@media (min-width: 768px) {
	.landing-nav-inner {
		flex-wrap: nowrap;
		padding-block: 14px;
	}

	.landing-nav-links {
		order: 0;
		width: auto;
	}
}
</style>
