<script setup>
import { withBase } from "vitepress"
import { computed } from "vue"
import { data as stories } from "../data/story.data.js"
import storyFeatured from "../data/storyFeatured.js"
import StoryCard from "./StoryCard.vue"

// One component, three layouts by width: a stack on a phone, two across on a tablet, a rail on a
// desktop. `list` is the /story page, which shows every story in episode order; the landing shows
// the ones named in storyFeatured.js, in that file's order, and ends with a More card.
const props = defineProps({
	list: { type: Boolean, default: false },
})

const visibleStories = computed(function () {
	if (props.list) {
		return stories
	}
	else {
		return storyFeatured.map(url => stories.find(story => story.url === url)).filter(Boolean)
	}
})
</script>

<template>
	<section class="story" :class="list ? 'story-list' : 'story-landing'">
		<div class="landing-wrap">
			<div v-if="list" class="story-list-head">
				<h1>This Shouldn't Be That Hard</h1>
				<p>
					Each one is an afternoon it happens in: how it goes today, and how it goes in ObjectExplorer.
					Articles for now; the lightboard video joins each one as it is recorded.
				</p>
			</div>
			<div v-else class="story-head">
				<h2 style="text-transform: uppercase;">This Shouldn't Be That Hard</h2>
				<p>ONE at a time</p>
			</div>
			<div class="story-rail">
				<StoryCard v-for="story in visibleStories" :key="story.url" :story="story" />
				<a v-if="list === false" class="story-card story-card-more" :href="withBase('/story/')">More …</a>
			</div>
		</div>
	</section>
</template>

<style>
.story-landing {
	padding-block: clamp(40px, 7vh, 80px) clamp(48px, 8vh, 96px);
}

.story-list {
	padding-block: 48px 96px;
}

.story-head {
	margin-bottom: 32px;
}

.story-head h2 {
	font-size: clamp(1.45rem, 2.7vw, 2.1rem);
	font-weight: 600;
	letter-spacing: -0.024em;
	line-height: 1.08;
	margin: 0;
	word-spacing: 4px;
	/* max-width: 22ch; */
}

.story-list-head {
	margin-bottom: 36px;
}

.story-list-head h1 {
	color: var(--vp-c-text-1);
	font-size: 32px;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
	margin: 0 0 12px;
	word-spacing: 4px;
    text-transform: uppercase;
}

.story-list-head p {
	color: var(--vp-c-text-2);
	font-size: 16px;
	line-height: 1.6;
	margin: 0;
	max-width: 60ch;
}

.story-rail {
	display: grid;
	gap: 18px;
	grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 768px) {
	.story-rail {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1200px) {
	/* the rail is the content box: the first card snaps onto the heading's edge and the last visible
	   one is cut at the header's right edge, which says there is more */
	.story-landing .story-rail {
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 4px 0 22px;
		scroll-snap-type: x mandatory;
		scrollbar-color: var(--rule) transparent;
		scrollbar-width: thin;
	}

	.story-list .story-rail {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}
</style>
