import DefaultTheme from "vitepress/theme"
import ThemeLayout from "./ThemeLayout.vue"
import DownloadBlock from "./components/DownloadBlock.vue"
import DownloadTable from "./components/DownloadTable.vue"
import Landing from "./components/Landing.vue"
import PricingTable from "./components/PricingTable.vue"
import StoryGrid from "./components/StoryGrid.vue"
import StoryPoster from "./components/StoryPoster.vue"
import "./custom.css"
import "./landing.css"

// The documentation keeps the default theme, wearing the landing's header and footer (ThemeNav and
// ThemeFooter, aliased in config.js). The landing page opts out of it entirely (index.md is
// `layout: false` around <Landing />), a story gets its video and share row around the article
// through ThemeLayout's slots, and its poster before the closing line through storyMarkdown.js.
export default {
	extends: DefaultTheme,
	Layout: ThemeLayout,
	enhanceApp({ app }) {
		app.component("DownloadBlock", DownloadBlock)
		app.component("DownloadTable", DownloadTable)
		app.component("Landing", Landing)
		app.component("PricingTable", PricingTable)
		app.component("StoryGrid", StoryGrid)
		app.component("StoryPoster", StoryPoster)
	},
}
