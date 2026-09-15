import { createContentLoader } from "vitepress"

// Every short, read from docs/shorts/*.md when the site is built: adding an episode is adding one
// markdown file. Ordered by episode, which is the usage scenario's number in
// rock2/explorer/features.md.
export default createContentLoader("shorts/*.md", {
	transform(pages) {
		const shorts = pages
			.filter(page => page.url !== "/shorts/")
			.map(function (page) {
				const { title, problem, episode, runtime, video, poster, marker, published, description } = page.frontmatter
				return { url: page.url, title, problem, episode, runtime, video, poster, marker, published, description }
			})
		return shorts.sort((left, right) => left.episode - right.episode)
	},
})
