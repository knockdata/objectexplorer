<script setup>
import HeroVideo from "./HeroVideo.vue"
import ShareLink from "./ShareLink.vue"

const emit = defineEmits(["open-app"])
</script>

<template>
	<section class="landing-hero landing-wrap">
		<div class="landing-hero-copy">
			<h1>
				This Shouldn't Be That Hard
				<span class="landing-hero-sub">to work with cloud storage.</span>
			</h1>
			<!-- the one drawn mark on the page: a squeegee stroke, echoing the wipe -->
			<svg class="landing-hero-stroke" viewBox="0 0 340 16" fill="none" aria-hidden="true">
				<path d="M2 11.5c54-6 96 2 148-2.5C196 5 246 12 338 5.5" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />
			</svg>
			<p class="landing-hero-lede">
				One app, explorer, analyze, plot over S3, GCS, Azure Blob ...
			</p>
			<p class="landing-hero-lede">
				Agent is just another user, full control with audit
			</p>
			<div class="landing-hero-actions" style="display: flex;">
				<button class="landing-hero-primary desktop-only" type="button" @click="emit('open-app')">Open App</button>
				<p class="landing-hero-note desktop-only">
					<span style="display: block;">It opens right here.</span>
					<span style="display: block;">Nothing leaves your browser.</span>
				</p>
				<ShareLink
					class="landing-hero-primary mobile-only"
					url="https://objectexplorer.com/download"
					title="Download ObjectExplorer"
					text="ObjectExplorer is a desktop app. Open this link on your computer to install it."
					label="Share the download link"
				/>
			</div>
			
			<p class="landing-hero-note mobile-only">
				A desktop app: a tree, a grid and a notebook side by side.
				<b>Send the link to the computer you work on.</b>
			</p>
		</div>
		<div class="landing-hero-demo">
			<HeroVideo />
			<p class="landing-hero-caption">The 40-second tour. Click it to play full screen, with sound.</p>
		</div>
	</section>
</template>

<style>
.landing-hero {
	align-items: center;
	display: grid;
	gap: 40px;
	grid-template-columns: minmax(0, 1fr);
	padding-block: clamp(40px, 9vh, 108px) clamp(40px, 9vh, 96px);
}

.landing-hero h1 {
	font-size: clamp(2.35rem, 5.2vw, 4.1rem);
	font-weight: 700;
	letter-spacing: -0.032em;
	line-height: 0.97;
	margin: 0;
	max-width: 500px;
	text-wrap: balance;
}

.landing-hero-sub {
	color: var(--chalk-2);
	display: block;
	font-size: clamp(1.2rem, 2.1vw, 1.7rem);
	font-weight: 400;
	letter-spacing: -0.016em;
	line-height: 1.16;
	margin-top: 0.36em;
	max-width: 500px;
}

.landing-hero-stroke {
	color: var(--brand);
	display: block;
	height: 16px;
	margin: 24px 0 26px;
	overflow: visible;
	width: min(300px, 50vw);
}

.landing-hero-lede {
	color: var(--chalk-2);
	font-size: clamp(1rem, 1.25vw, 1.11rem);
	margin: 10px 0;
	max-width: 500px;
}

.landing-hero-actions {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: 14px 18px;
	padding: 10px 0;
}

.landing-hero .landing-hero-primary {
	align-items: center;
	background: var(--brand);
	border: 0;
	border-radius: 6px;
	box-shadow: 0 0 0 1px var(--brand-glow), 0 18px 40px -22px var(--brand-glow);
	color: var(--brand-text);
	cursor: pointer;
	display: inline-flex;
	font-family: var(--landing-font);
	font-size: 17px;
	font-weight: 600;
	gap: 10px;
	letter-spacing: -0.008em;
	padding: 15px 26px;
	transition: box-shadow 0.18s ease, transform 0.18s ease;
}

.landing-hero .landing-hero-primary:hover {
	box-shadow: 0 0 0 1px var(--brand), 0 22px 46px -20px var(--brand-glow);
	transform: translateY(-1px);
}

/* on a desktop Download in the header is the call to action, so Open App is outlined only */
.landing-hero button.landing-hero-primary {
	background: transparent;
	box-shadow: 0 0 0 1.5px var(--brand-glow);
	color: var(--brand);
}

.landing-hero button.landing-hero-primary:hover {
	background: var(--brand-soft);
	box-shadow: 0 0 0 1.5px var(--brand);
}

.landing-hero-note {
	color: var(--chalk-3);
	font-size: 14.5px;
	max-width: 500px;
}

.landing-hero-note b {
	color: var(--chalk-2);
	font-weight: 600;
}

.landing-hero-caption {
	color: var(--chalk-3);
	font-size: 14px;
	line-height: 1.45;
	margin: 13px 2px 0;
}

@media (min-width: 1200px) {
	.landing-hero {
		gap: clamp(30px, 4.5vw, 62px);
		grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
	}
}
</style>
