// A story's page is its transcript, but for two things: the recognition sentence is left off, and
// the poster is drawn before the closing line.
function isStoryPage(relativePath) {
	return relativePath.startsWith("story/") && relativePath !== "story/index.md"
}

// paragraph_open, then an inline token that opens with bold and closes with bold — markdown-it leaves
// empty text tokens either side of the bold, so only the children that carry something count
function isBoldParagraph(tokens, index) {
	if (tokens[index].type === "paragraph_open") {
		const children = tokens[index + 1].children.filter(child => child.type.startsWith("strong") || child.content.trim() !== "")
		return children.length >= 3 && children[0].type === "strong_open" && children[children.length - 1].type === "strong_close"
	}
	else {
		return false
	}
}

// The recognition sentence is spoken walking in, before `## Today`. Under the question and its answer
// on the page it reads as a second subtitle, so the page leaves it out; the transcript keeps it.
function skipRecognition(state) {
	const firstHeading = state.tokens.findIndex(token => token.type === "heading_open")
	const recognition = state.tokens.findIndex((token, index) => index < firstHeading && token.type === "paragraph_open")
	if (recognition >= 0) {
		state.tokens.splice(recognition, 3)
	}
}

// The poster stands right before the closing line — the bold last paragraph, written for System 1 —
// whether or not the story has a video yet. StoryPoster draws nothing without a poster.
function placePoster(state) {
	const closingLine = state.tokens.findLastIndex((token, index) => isBoldParagraph(state.tokens, index))
	if (closingLine >= 0) {
		const poster = new state.Token("html_block", "", 0)
		poster.content = "<StoryPoster />\n"
		state.tokens.splice(closingLine, 0, poster)
	}
}

export default function storyMarkdown(md) {
	md.core.ruler.push("story_markdown", function (state) {
		if (isStoryPage(state.env.relativePath ?? "")) {
			skipRecognition(state)
			placePoster(state)
		}
	})
}
