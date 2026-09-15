import DefaultTheme from "vitepress/theme"
import ThemeLayout from "./ThemeLayout.vue"
import DownloadTable from "./components/DownloadTable.vue"
import Landing from "./components/Landing.vue"
import PricingTable from "./components/PricingTable.vue"
import StoryGrid from "./components/StoryGrid.vue"
import "./custom.css"
import "./landing.css"

// The documentation keeps the default theme. The landing page opts out of it entirely
// (index.md is `layout: false` around <Landing />), and a story gets its video and share row
// around the article through ThemeLayout's slots.
export default {
	extends: DefaultTheme,
	Layout: ThemeLayout,
	enhanceApp({ app }) {
		app.component("DownloadTable", DownloadTable)
		app.component("Landing", Landing)
		app.component("PricingTable", PricingTable)
		app.component("StoryGrid", StoryGrid)
	},
}
