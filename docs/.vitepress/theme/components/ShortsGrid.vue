<script setup>
import { withBase } from "vitepress"
import { computed } from "vue"
import { data as shorts } from "../data/shorts.data.js"
import ShortCard from "./ShortCard.vue"

// One component, three layouts by width: a stack on a phone, two across on a tablet, a rail on a
// desktop. `list` is the /shorts page, which shows every episode as a grid; the landing passes a
// limit and links there.
const props = defineProps({
	limit: { type: Number, default: 0 },
	list: { type: Boolean, default: false },
})

const visibleShorts = computed(function () {
	if (props.limit > 0) {
		return shorts.slice(0, props.limit)
	}
	else {
		return shorts
	}
})
</script>

<template>
	<section class="shorts" :class="list ? 'shorts-list' : 'shorts-landing'">
		<div class="landing-wrap">
			<div v-if="list" class="shorts-list-head">
				<h1>Things that shouldn't be hard</h1>
				<p>
					Each one is an afternoon it happens in: how it goes today, and how it goes in ObjectExplorer.
					Articles for now; the lightboard video joins each one as it is recorded.
				</p>
			</div>
			<div v-else class="shorts-head">
				<h2>Things that shouldn't be hard, one afternoon at a time</h2>
				<p>
					How each one goes today, and how it goes here.
					<a class="shorts-all" :href="withBase('/shorts/')">All {{ shorts.length }} problems →</a>
				</p>
			</div>
			<div class="shorts-rail">
				<ShortCard v-for="short in visibleShorts" :key="short.url" :short="short" />
			</div>
		</div>
	</section>
</template>

<style>
.shorts-landing {
	padding-block: clamp(40px, 7vh, 80px) clamp(48px, 8vh, 96px);
}

.shorts-list {
	padding-block: 48px 96px;
}

.shorts-head {
	align-items: flex-end;
	display: flex;
	flex-wrap: wrap;
	gap: 18px 40px;
	margin-bottom: 32px;
}

.shorts-head h2 {
	font-size: clamp(1.45rem, 2.7vw, 2.1rem);
	font-variation-settings: "wdth" 106, "wght" 600;
	letter-spacing: -0.024em;
	line-height: 1.08;
	margin: 0;
	max-width: 22ch;
}

.shorts-head p {
	color: var(--chalk-3);
	font-size: 15.5px;
	margin: 0;
	max-width: 40ch;
}

.landing .shorts-all {
	border-bottom: 1px solid var(--rule);
	color: var(--chalk-2);
	white-space: nowrap;
}

.landing .shorts-all:hover {
	border-bottom-color: var(--brand);
	color: var(--brand);
}

.shorts-list-head {
	margin-bottom: 36px;
}

.shorts-list-head h1 {
	color: var(--vp-c-text-1);
	font-size: 32px;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
	margin: 0 0 12px;
}

.shorts-list-head p {
	color: var(--vp-c-text-2);
	font-size: 16px;
	line-height: 1.6;
	margin: 0;
	max-width: 60ch;
}

.shorts-rail {
	display: grid;
	gap: 18px;
	grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 768px) {
	.shorts-rail {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1200px) {
	.shorts-landing .shorts-rail {
		display: flex;
		margin-inline: calc(-1 * var(--landing-gutter));
		overflow-x: auto;
		overflow-y: hidden;
		padding: 4px var(--landing-gutter) 22px;
		scroll-snap-type: x mandatory;
		scrollbar-color: var(--rule) transparent;
		scrollbar-width: thin;
	}

	.shorts-list .shorts-rail {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}
</style>
