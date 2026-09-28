<script setup>
import { useData, withBase } from "vitepress"
import { ref } from "vue"

const { frontmatter } = useData()

// Play lays the story's screen recording over the picture, which stays underneath
const playing = ref(false)

function playRecording() {
	playing.value = true
}

// the story's `open` (and `component`) as the app's query, the same one AppDemo builds
function appLink() {
	const params = new URLSearchParams()
	params.set("open", "*" + frontmatter.value.open)
	for (const [name, value] of Object.entries(frontmatter.value.component ?? {})) {
		params.set("component." + name, value)
	}
	return __APP_URL__ + "?" + params.toString()
}
</script>

<!-- The ideal, as a photo: the story's `poster`, a real screenshot of the thing done, with its
     `caption` saying what is in the picture. A story writes <StoryPoster /> where the picture goes.
     A story with `open` gets a corner icon that opens the app on that item, to see it in action;
     one with `recording` gets a play icon before it, which plays the recording over the picture. -->
<template>
	<figure v-if="frontmatter.poster" class="story-poster">
		<div class="story-poster-frame">
			<button v-if="frontmatter.recording && playing === false" class="story-poster-open story-poster-play" type="button" title="Play the recording" aria-label="Play the recording" @click="playRecording">
				<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
					<path d="M8 5v14l11-7z" />
				</svg>
			</button>
			<a v-if="frontmatter.open" class="story-poster-open" :href="appLink()" target="_blank" rel="noopener" title="See it in action" aria-label="See it in action">
				<!-- rock2 icon/src/brand/draw-arrow-sharp.svg: an arrow out, the picture is not the app -->
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M6 18l12 -12" />
					<path d="M18 10v-4h-4" />
				</svg>
			</a>
			<img :src="withBase(frontmatter.poster)" :alt="frontmatter.caption ?? frontmatter.title">
			<span v-if="playing" class="story-poster-mask"></span>
			<video v-if="playing" class="story-poster-recording" :src="withBase(frontmatter.recording)" autoplay controls playsinline></video>
		</div>
		<figcaption v-if="frontmatter.caption">{{ frontmatter.caption }}</figcaption>
	</figure>
</template>

<style>
.vp-doc .story-poster {
	margin: 28px 0;
}

.vp-doc .story-poster-frame {
	margin: 0 auto;
	position: relative;
	width: fit-content;
}

.vp-doc .story-poster-open {
	align-items: center;
	background: rgba(10, 12, 14, 0.86);
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	color: #d4d4d4;
	display: flex;
	height: 30px;
	justify-content: center;
	padding: 5px;
	position: absolute;
	right: -15px;
	top: -15px;
	width: 30px;
	z-index: 1;
}

.vp-doc .story-poster-play {
	cursor: pointer;
	right: 23px;
}

.vp-doc .story-poster-open:hover {
	color: var(--vp-c-brand-1);
}

.vp-doc .story-poster img {
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	display: block;
	margin: 0 auto;
	max-height: 70vh;
	max-width: 100%;
}

/* dims the picture while the recording plays over it */
.vp-doc .story-poster-mask {
	background: rgba(0, 0, 0, 0.8);
	border-radius: 12px;
	inset: 0;
	position: absolute;
}

/* the recording is 9:16 over a wide picture: as tall as the picture, in its middle */
.vp-doc .story-poster-recording {
	background: transparent;
	/* border: 1px solid transparent; */
	border-radius: 12px;
	display: block;
	height: 100%;
	left: 50%;
	position: absolute;
	top: 0;
	transform: translateX(-50%);
}

.vp-doc .story-poster figcaption {
	color: var(--vp-c-text-2);
	font-size: 14px;
	line-height: 1.5;
	margin-top: 10px;
	text-align: center;
}
</style>
