<script setup>
import { useData, withBase } from "vitepress"
import { computed } from "vue"
import { data as shorts } from "../data/shorts.data.js"
import ShareLink from "./ShareLink.vue"

const { frontmatter, page } = useData()
const site = "https://objectexplorer.com"

// always the real site's address, so a link shared from the GitHub Pages copy still lands there
const pageUrl = computed(() => `${site}/${page.value.relativePath.replace(/\.md$/, "")}`)
const encodedUrl = computed(() => encodeURIComponent(pageUrl.value))
const encodedTitle = computed(() => encodeURIComponent(frontmatter.value.title))

const linkedinUrl = computed(() => `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`)
const hackerNewsUrl = computed(() => `https://news.ycombinator.com/submitlink?u=${encodedUrl.value}&t=${encodedTitle.value}`)
const xUrl = computed(() => `https://x.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`)

const position = computed(() => shorts.findIndex(short => short.episode === frontmatter.value.episode))
const previous = computed(() => shorts[position.value - 1] ?? null)
const next = computed(() => shorts[position.value + 1] ?? null)
</script>

<template>
	<footer class="short-footer">
		<div class="short-footer-share">
			<span class="short-footer-label">Share this problem</span>
			<a :href="linkedinUrl" target="_blank" rel="noopener">LinkedIn</a>
			<a :href="hackerNewsUrl" target="_blank" rel="noopener">Hacker News</a>
			<a :href="xUrl" target="_blank" rel="noopener">X</a>
			<ShareLink :url="pageUrl" :title="frontmatter.title" :text="frontmatter.problem" label="Share link" />
		</div>
		<nav class="short-footer-pager" aria-label="Episodes">
			<a v-if="previous" class="short-footer-previous" :href="withBase(previous.url)">
				<span>Previous problem</span>
				{{ previous.problem }}
			</a>
			<a v-if="next" class="short-footer-next" :href="withBase(next.url)">
				<span>Next problem</span>
				{{ next.problem }}
			</a>
		</nav>
		<p class="short-footer-more">
			<a :href="withBase('/shorts/')">All problems</a> · <a :href="withBase('/#download')">Download ObjectExplorer</a>
		</p>
	</footer>
</template>

<style>
.short-footer {
	border-top: 1px solid var(--vp-c-divider);
	margin-top: 48px;
	padding-top: 24px;
}

.short-footer-share {
	align-items: center;
	color: var(--vp-c-text-2);
	display: flex;
	flex-wrap: wrap;
	font-size: 14px;
	gap: 10px 18px;
}

.short-footer-label {
	color: var(--vp-c-text-3);
	width: 100%;
}

.short-footer a {
	color: var(--vp-c-brand-1);
	font-weight: 500;
	text-decoration: none;
}

.short-footer a:hover {
	color: var(--vp-c-brand-2);
}

.short-footer .share-link {
	color: var(--vp-c-text-1);
	font-size: 14px;
	padding: 6px 14px;
}

.short-footer-pager {
	display: grid;
	gap: 16px;
	grid-template-columns: minmax(0, 1fr);
	margin-top: 32px;
}

.short-footer-pager a {
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	display: block;
	font-size: 14px;
	line-height: 1.4;
	padding: 12px 16px;
}

.short-footer-pager a:hover {
	border-color: var(--vp-c-brand-1);
}

.short-footer-pager span {
	color: var(--vp-c-text-2);
	display: block;
	font-size: 12px;
	font-weight: 500;
}

.short-footer-next {
	grid-column: -2;
	text-align: right;
}

.short-footer-more {
	color: var(--vp-c-text-3);
	font-size: 14px;
	margin: 24px 0 0;
}

@media (min-width: 640px) {
	.short-footer-pager {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
</style>
