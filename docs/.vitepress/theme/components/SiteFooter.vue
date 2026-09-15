<script setup>
import { withBase } from "vitepress"

// Where else ObjectExplorer is. The marks are simple-icons' own — the set the docs pages' nav bar
// draws `socialLinks` in config.js from — so the landing page and the docs show the same icons.
const socialLinks = [
	{
		name: "LinkedIn",
		link: "https://www.linkedin.com/in/rockieyang/",
		path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
	},
	{
		name: "YouTube",
		link: "https://www.youtube.com/@objectexplorercom",
		path: "M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z",
	},
	{
		name: "X",
		link: "https://x.com/objectexplorer",
		path: "M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z",
	},
	{
		name: "TikTok",
		link: "https://www.tiktok.com/@objectexplorer",
		path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07",
	},
]
</script>

<template>
	<footer class="site-footer landing-wrap">
		<nav class="site-footer-links" aria-label="Footer">
			<a :href="withBase('/what-is-objectexplorer')">Docs</a>
			<a :href="withBase('/pricing')">Pricing</a>
			<a :href="withBase('/changelog')">Changelog</a>
			<a :href="withBase('/privacy')">Privacy</a>
			<a href="mailto:rockie@knockdata.com">Contact</a>
			<span>© Knock Data AB, Sweden 2026</span>
		</nav>
		<nav class="site-footer-social" aria-label="Social media">
			<a v-for="socialLink in socialLinks" :key="socialLink.name" :href="socialLink.link" :aria-label="socialLink.name" :title="socialLink.name" target="_blank" rel="noopener noreferrer">
				<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
					<path :d="socialLink.path" />
				</svg>
			</a>
		</nav>
	</footer>
</template>

<style>
/* links on the left, the icons on the right; on a phone the icons wrap under the links */
.site-footer {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: 12px 24px;
	justify-content: space-between;
	padding-block: 26px 44px;
}

.site-footer-links {
	align-items: center;
	color: var(--chalk-3);
	display: flex;
	flex-wrap: wrap;
	font-size: 14.5px;
	gap: 10px 0;
}

.site-footer-links > * + *::before {
	color: var(--rule);
	content: "·";
	padding: 0 12px;
}

.landing .site-footer-links a:hover {
	color: var(--chalk-2);
}

/* the negative margin lines the first icon's glyph up with the links rather than its 36px box */
.site-footer-social {
	align-items: center;
	color: var(--chalk-3);
	display: flex;
	margin-left: -9px;
}

.site-footer-social a {
	align-items: center;
	display: flex;
	height: 36px;
	justify-content: center;
	width: 36px;
}

.landing .site-footer-social a:hover {
	color: var(--chalk);
}
</style>
