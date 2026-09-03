import DefaultTheme from "vitepress/theme"
import { h } from "vue"
import HeroVideo from "./HeroVideo.vue"
import LiveApp from "./LiveApp.vue"
import "./custom.css"

export default {
	extends: DefaultTheme,
	// the hero picture is the film: a poster frame that plays, full screen, on a click
	Layout() {
		return h(DefaultTheme.Layout, null, { "home-hero-image": () => h(HeroVideo) })
	},
	// <LiveApp /> is the running app embedded in a page
	enhanceApp({ app }) {
		app.component("LiveApp", LiveApp)
	},
}
