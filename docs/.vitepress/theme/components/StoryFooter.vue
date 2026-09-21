<script setup>
import { useData, withBase } from "vitepress"
import { computed } from "vue"
import { data as stories } from "../data/story.data.js"
import ShareLink from "./ShareLink.vue"

const { frontmatter, page } = useData()
const site = "https://objectexplorer.com"

// always the real site's address, so a link shared from the GitHub Pages copy still lands there
const pageUrl = computed(() => `${site}/${page.value.relativePath.replace(/\.md$/, "")}`)
const encodedUrl = computed(() => encodeURIComponent(pageUrl.value))
const encodedTitle = computed(() => encodeURIComponent(frontmatter.value.title))

// the marks are simple-icons' own, the same set SiteFooter draws
const shareTargets = computed(() => [
	{
		name: "LinkedIn",
		link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
		path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
	},
	{
		name: "Hacker News",
		link: `https://news.ycombinator.com/submitlink?u=${encodedUrl.value}&t=${encodedTitle.value}`,
		path: "M0 24V0h24v24zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896z",
	},
	{
		name: "X",
		link: `https://x.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
		path: "M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z",
	},
])

const position = computed(() => stories.findIndex(story => story.episode === frontmatter.value.episode))
const previous = computed(() => stories[position.value - 1] ?? null)
const next = computed(() => stories[position.value + 1] ?? null)
</script>

<template>
	<footer class="story-footer">
		<div class="story-footer-share">
			<span class="story-footer-label">Share this</span>
			<a v-for="shareTarget in shareTargets" :key="shareTarget.name" :href="shareTarget.link" target="_blank" rel="noopener">
				<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
					<path :d="shareTarget.path" />
				</svg>
				<span>{{ shareTarget.name }}</span>
			</a>
			<ShareLink :url="pageUrl" :title="frontmatter.title" :text="frontmatter.subtitle" label="Share with…" />
		</div>
		<nav class="story-footer-pager" aria-label="Episodes">
			<a v-if="previous" class="story-footer-previous" :href="withBase(previous.url)">
				<span>Previous</span>
				{{ previous.title }}
			</a>
			<a v-if="next" class="story-footer-next" :href="withBase(next.url)">
				<span>Next</span>
				{{ next.title }}
			</a>
		</nav>
	</footer>
</template>

<style>
.story-footer {
	border-top: 1px solid var(--vp-c-divider);
	margin-top: 48px;
	padding-top: 24px;
}

.story-footer-share {
	align-items: center;
	color: var(--vp-c-text-2);
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	font-size: 14px;
	gap: 10px 18px;
}

.story-footer-label {
	color: var(--vp-c-text-3);
	flex-grow: 6;
	/* width: 100%; */
}

.story-footer a {
	font-weight: 500;
	text-decoration: none;
}

.story-footer a:hover {
	color: var(--vp-c-brand-2);
}

.story-footer-share a {
	flex-grow: 1;
	align-items: center;
	display: inline-flex;
	gap: 8px;
}

/* the share button reads as one more link: no pill, the links' colour and weight */
.story-footer .share-link {
	border: 0;
	/* color: var(--vp-c-brand-1); */
	font-size: 14px;
	font-weight: 500;
	padding: 0;
}

.story-footer .share-link:hover {
	color: var(--vp-c-brand-2);
}

.story-footer-pager {
	display: grid;
	gap: 16px;
	grid-template-columns: minmax(0, 1fr);
	margin-top: 32px;
}

.story-footer-pager a {
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	display: block;
	font-size: 14px;
	line-height: 1.4;
	padding: 12px 16px;
}

.story-footer-pager span {
	color: var(--vp-c-text-2);
	display: block;
	font-size: 12px;
	font-weight: 500;
}

.story-footer-next {
	grid-column: -2;
	text-align: right;
}

.story-footer-more {
	color: var(--vp-c-text-3);
	font-size: 14px;
	margin: 24px 0 0;
}

@media (min-width: 640px) {
	.story-footer-pager {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
</style>
