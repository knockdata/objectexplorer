import { createContentLoader } from "vitepress"
import posterPlacement from "./posterPlacement.js"
import storyOrder from "./stories.js"

// The marker colours, cycled by position rather than chosen per story: the first card is always the
// brand's own green, and no two cards in a row carry the same colour.
const markers = ["neon", "amber", "pink", "violet"]

// Every story, read from docs/story/*.md when the site is built, in the order stories.js names them.
// A file stories.js does not name yet goes after every named one.
function orderOf(story) {
	const position = storyOrder.indexOf(story.url)
	if (position >= 0) {
		return position
	}
	else {
		return storyOrder.length
	}
}

export default createContentLoader("story/*.md", {
	transform(pages) {
		const stories = pages
			.filter(page => page.url !== "/story/")
			.map(function (page) {
				const { title, subtitle, episode, runtime, video, recording, poster, focus, background, published, description } = page.frontmatter
				const posterStyle = posterPlacement(poster, focus)
				return { url: page.url, title, subtitle, episode, runtime, video, recording, poster, posterStyle, background: background ?? "#202020", published, description }
			})
		return stories
			.sort((left, right) => orderOf(left) - orderOf(right))
			.map((story, index) => ({ ...story, marker: markers[index % markers.length] }))
	},
})
