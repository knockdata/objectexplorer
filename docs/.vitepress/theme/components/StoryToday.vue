<script setup>
import { useData } from "vitepress"

const { frontmatter } = useData()
</script>

<!-- How the thing is done today, drawn the way it would be drawn on the board: one amber box per
     step, the tool it happens in above it, an arrow to the next, and the cost of the whole walk
     written in pink under it. The steps are the story's `today:` list, the cost its `tally:`. -->
<template>
	<figure v-if="frontmatter.today" class="story-today">
		<ol class="story-today-steps">
			<li v-for="(step, index) in frontmatter.today" :key="index" class="story-today-step">
				<span class="story-today-tool">{{ step.tool }}</span>
				<span class="story-today-box">{{ step.step }}</span>
			</li>
		</ol>
		<figcaption v-if="frontmatter.tally" class="story-today-tally">{{ frontmatter.tally }}</figcaption>
	</figure>
</template>

<style>
@font-face {
	font-display: swap;
	font-family: "Excalifont";
	src: url("/font/Excalifont-Regular.woff2") format("woff2");
}

.vp-doc .story-today {
	background: #0e0f12;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	font-family: "Excalifont", "Comic Sans MS", cursive;
	margin: 28px 0;
	padding: 24px 20px 20px;
}

.vp-doc .story-today-steps {
	align-items: flex-end;
	display: flex;
	flex-wrap: wrap;
	gap: 14px 0;
	list-style: none;
	margin: 0;
	padding: 0;
}

.vp-doc .story-today-step {
	align-items: center;
	display: flex;
	flex-direction: column;
	margin: 0;
	position: relative;
}

.vp-doc .story-today-step + .story-today-step {
	padding-left: 34px;
}

.vp-doc .story-today-step + .story-today-step::before {
	bottom: 10px;
	color: #e6e6e6;
	content: "→";
	font-size: 22px;
	left: 6px;
	position: absolute;
}

.vp-doc .story-today-tool {
	color: #9aa0a6;
	font-size: 13px;
	line-height: 1.3;
	margin-bottom: 4px;
}

.vp-doc .story-today-box {
	border: 2px solid #ffb347;
	border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
	color: #ffb347;
	font-size: 17px;
	line-height: 1.25;
	max-width: 150px;
	padding: 8px 12px;
	text-align: center;
}

.vp-doc .story-today-tally {
	color: #ff5fa2;
	font-size: 20px;
	line-height: 1.4;
	margin-top: 18px;
}

@media (max-width: 640px) {
	.vp-doc .story-today-steps {
		align-items: flex-start;
		flex-direction: column;
	}

	.vp-doc .story-today-step {
		align-items: flex-start;
	}

	.vp-doc .story-today-step + .story-today-step {
		padding-left: 0;
		padding-top: 26px;
	}

	.vp-doc .story-today-step + .story-today-step::before {
		bottom: auto;
		content: "↓";
		left: 12px;
		top: 0;
	}
}
</style>
