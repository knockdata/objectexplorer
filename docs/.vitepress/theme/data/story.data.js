import { createContentLoader } from "vitepress"
import posterPlacement from "./posterPlacement.js"

// The marker colours, cycled by position rather than chosen per story: the first card is always the
// brand's own green, and no two cards in a row carry the same colour.
const markers = ["neon", "amber", "pink", "violet"]

// Every story, read from docs/story/*.md when the site is built: adding an episode is adding one
// markdown file. Ordered by episode, which is the usage scenario's number in
// rock2/explorer/features.md.
export default createContentLoader("story/*.md", {
	transform(pages) {
		const stories = pages
			.filter(page => page.url !== "/story/")
			.map(function (page) {
				const { title, subtitle, episode, runtime, video, poster, focus, published, description } = page.frontmatter
				const posterStyle = posterPlacement(poster, focus)
				return { url: page.url, title, subtitle, episode, runtime, video, poster, posterStyle, published, description }
			})
		return stories
			.sort((left, right) => left.episode - right.episode)
			.map((story, index) => ({ ...story, marker: markers[index % markers.length] }))
	},
})
