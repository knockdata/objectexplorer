<script setup>
import { copyright, footerLinks, linkOf, socialLinks } from "../data/siteLinks.js"
</script>

<!-- the links and the social marks live in data/siteLinks.js, which the phone menu shows too -->
<template>
	<footer class="site-footer landing-wrap">
		<nav class="site-footer-links" aria-label="Footer">
			<a v-for="footerLink in footerLinks" :key="footerLink.name" :href="linkOf(footerLink.link)">{{ footerLink.name }}</a>
			<span>{{ copyright }}</span>
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
/* links on the left, the icons on the right. The landing's type sits on the footer itself, so it
   looks the same under a story or the pricing page. The full width keeps it on the header's edges
   inside VitePress's flex column, where its auto margins would otherwise shrink it to its content. */
.site-footer {
	-webkit-font-smoothing: antialiased;
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	font-family: var(--landing-font);
	gap: 12px;
	justify-content: space-between;
	line-height: 1.55;
	padding-block: 26px 44px;
	width: 100%;
}



.site-footer a {
	color: inherit;
	text-decoration: none;
}

.site-footer-links {
	align-items: center;
	color: var(--chalk-3);
	display: flex;
	flex-wrap: wrap;
	font-size: 14.5px;
	gap: 25px;

}



.site-footer .site-footer-links a:hover {
	color: var(--chalk);
	border-bottom: 2px solid var(--brand);
}

/* the negative margin lines the first icon's glyph up with the links rather than its 36px box */
.site-footer-social {
	display: flex;
	gap: 20px;
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
	/* width: 36px; */
}

.site-footer .site-footer-social a:hover {
	color: var(--chalk);
	border-bottom: 2px solid var(--brand);
}

/* on a phone the footer folds into the header's menu (SiteMenu) */
@media (max-width: 767px) {
	.site-footer {
		display: none;
	}
}

@media (max-width: 1000px) {
	.site-footer-links {
		gap: 10px;
	}
}

@media (max-width: 800px) {
	.site-footer-links {
		gap: 16px;
		justify-content: space-between;
	}
	.site-footer {
		flex-direction: column;
	}
}
</style>
