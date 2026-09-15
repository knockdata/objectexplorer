import { defineConfig } from "vitepress"

// Where the built site is rooted. objectexplorer.com serves it at the domain root, which is the
// default; GitHub Pages serves the same build under /objectexplorer/, and sets DOCS_BASE to say
// so. Everything VitePress generates — assets, links, the logo — is prefixed with this.
const base = process.env.DOCS_BASE ?? "/"

// Every absolute URL a crawler or a share preview sees names the real site, whichever copy built it.
const site = "https://objectexplorer.com"
const defaultDescription = "The VS Code for cloud storage. Every byte stays on your machine."

// Which kind of machine is looking, written onto <html data-platform> before the first paint, so
// a phone never sees a download grid that then swaps for a share button. The width decides the
// layout; this decides whether an installer is any use. iPadOS says "Macintosh" exactly like a
// Mac does, so a touch screen is what gives it away. ES5, because it runs before anything else.
const platformScript = `(function () {
	var agent = navigator.userAgent;
	var platform = "unknown";
	if (/iPhone|iPad|iPod|Android/i.test(agent) || (/Macintosh/.test(agent) && navigator.maxTouchPoints > 1)) {
		platform = "mobile";
	}
	else if (/CrOS/.test(agent)) {
		platform = "unknown";
	}
	else if (/Macintosh/.test(agent)) {
		platform = "mac";
	}
	else if (/Windows/.test(agent)) {
		platform = "windows";
	}
	else if (/Linux|X11/.test(agent)) {
		platform = "linux";
	}
	document.documentElement.dataset.platform = platform;
})()`

// A story's page title is its question and its answer together: the question says what the page
// is about, the answer is the reason anyone opens it. Every other page keeps its own title.
function pageTitle(frontmatter) {
	if (frontmatter.answer) {
		return `${frontmatter.title} ${frontmatter.answer}`
	}
	else {
		return frontmatter.title
	}
}

// The whole site — the landing page and the documentation are one thing, served at
// objectexplorer.com by the front door in rock2/server, with the app itself at /app on the same
// origin. Dark is the default: the app is dark, and every screenshot here was taken in it.
export default defineConfig({
	base,
	title: "ObjectExplorer",
	description: "Browse, preview, query and search S3, GCS, Azure Blob and local folders in one window",
	// force-dark, not "dark": "dark" is only the starting value, so a reader whose browser remembers
	// light walks from the landing — which is dark whatever the setting — into a white page. The app
	// is dark, every screenshot here was taken in it, and the site is one surface.
	appearance: "force-dark",
	cleanUrls: true,
	lastUpdated: true,
	head: [
		["link", { rel: "icon", type: "image/png", href: `${base}img/favicon.png` }],
		["script", {}, platformScript],
	],
	// a story is an article: no sidebar and no outline beside it
	transformPageData(pageData) {
		if (pageData.relativePath.startsWith("story/")) {
			pageData.frontmatter.sidebar = false
			pageData.frontmatter.aside = false
			pageData.title = pageTitle(pageData.frontmatter)
		}
	},
	// Open Graph and a canonical link on every page, from its own frontmatter, so a story shared on
	// LinkedIn, X or Slack previews with its own question, answer and picture rather than the site's.
	transformHead({ pageData }) {
		const { frontmatter, relativePath } = pageData
		const pagePath = relativePath.replace(/index\.md$/, "").replace(/\.md$/, "")
		const pageUrl = `${site}/${pagePath}`
		const isStory = relativePath.startsWith("story/") && relativePath !== "story/index.md"
		const title = [pageTitle(frontmatter), pageData.title, "ObjectExplorer"].find(Boolean)
		const description = frontmatter.description ?? defaultDescription
		const image = `${site}${frontmatter.poster ?? "/screenshot/hero.png"}`
		return [
			["link", { rel: "canonical", href: pageUrl }],
			["meta", { property: "og:type", content: isStory ? "article" : "website" }],
			["meta", { property: "og:title", content: title }],
			["meta", { property: "og:description", content: description }],
			["meta", { property: "og:image", content: image }],
			["meta", { property: "og:url", content: pageUrl }],
			["meta", { name: "twitter:card", content: "summary_large_image" }],
		]
	},
	sitemap: {
		hostname: site,
	},
	themeConfig: {
		logo: { light: "/img/favicon.png", dark: "/img/64.png" },
		nav: [
			{ text: "Pricing", link: "/pricing" },
			{ text: "Docs", link: "/what-is-objectexplorer" },
			{ text: "Changelog", link: "/changelog" },
			{ text: "Download", link: "/#download" },
			// the running app, on the same origin once this site is objectexplorer.com. Absolute
			// so it still reaches the app from the GitHub Pages copy of these pages, and in this
			// tab — a reader who wants a second one right-clicks, which no site can take away.
			{ text: "Open app", link: "https://objectexplorer.com/app", target: "_self", noIcon: true },
		],
		sidebar: [
			{
				text: "Introduction",
				items: [
					{ text: "What is ObjectExplorer?", link: "/what-is-objectexplorer" },
					{ text: "Why ObjectExplorer?", link: "/why-objectexplorer" },
					{ text: "Getting started", link: "/getting-started" },
					{ text: "Your data stays here", link: "/privacy" },
				],
			},
			{
				text: "Storage",
				collapsed: false,
				items: [
					{ text: "Connecting storage", link: "/storage/connect" },
					{ text: "Amazon S3", link: "/storage/s3" },
					{ text: "Google Cloud Storage", link: "/storage/gcs" },
					{ text: "Azure Blob Storage", link: "/storage/azure" },
					{ text: "MinIO", link: "/storage/minio" },
					{ text: "Local folders", link: "/storage/local" },
				],
			},
			{
				text: "Explore",
				collapsed: false,
				items: [
					{ text: "The tree and the list", link: "/explore/tree" },
					{ text: "Previewing an object", link: "/explore/preview" },
					{ text: "Column summaries", link: "/explore/column-summary" },
					{ text: "Search", link: "/explore/search" },
					{ text: "Hex", link: "/explore/hex" },
					{ text: "Archives", link: "/explore/archives" },
					{ text: "Copy, move, rename, delete", link: "/explore/file-management" },
					{ text: "Sharing a table", link: "/explore/share" },
				],
			},
			{
				text: "Analyze",
				collapsed: false,
				items: [
					{ text: "The notebook", link: "/analyze/notebook" },
					{ text: "SQL", link: "/analyze/sql" },
					{ text: "Python", link: "/analyze/python" },
					{ text: "Charts", link: "/analyze/charts" },
					{ text: "Models", link: "/analyze/model" },
					{ text: "Data lake tables", link: "/analyze/lake" },
					{ text: "Cloud Logging", link: "/analyze/logging" },
				],
			},
			{
				text: "Agents",
				collapsed: false,
				items: [
					{ text: "ObjectExplorer for agents", link: "/agents/" },
					{ text: "Connecting an agent", link: "/agents/connect" },
					{ text: "PII rules", link: "/agents/pii" },
					{ text: "Sessions, replay and audit", link: "/agents/sessions" },
				],
			},
			{
				text: "Formats",
				collapsed: true,
				items: [
					{ text: "Every format", link: "/formats/" },
					{ text: "Tabular", link: "/formats/tabular" },
					{ text: "Statistics", link: "/formats/statistics" },
					{ text: "Documents", link: "/formats/documents" },
					{ text: "Images", link: "/formats/images" },
					{ text: "Audio and video", link: "/formats/media" },
					{ text: "Ebooks", link: "/formats/ebooks" },
					{ text: "Sprite sheets", link: "/formats/sprite-sheets" },
				],
			},
			{
				text: "Reference",
				collapsed: true,
				items: [
					{ text: "Keyboard shortcuts", link: "/reference/shortcuts" },
					{ text: "Where your data lives", link: "/reference/data-locations" },
					{ text: "Updating", link: "/reference/updating" },
					{ text: "The MCP rule file", link: "/reference/mcp-rules" },
					{ text: "The MCP endpoint", link: "/reference/mcp-protocol" },
					{ text: "Troubleshooting", link: "/reference/troubleshooting" },
				],
			},
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/knockdata/objectexplorer" },
			{ icon: "linkedin", link: "https://www.linkedin.com/in/rockieyang/" },
			{ icon: "youtube", link: "https://www.youtube.com/@objectexplorercom" },
			{ icon: "x", link: "https://x.com/objectexplorer" },
			{ icon: "tiktok", link: "https://www.tiktok.com/@objectexplorer" },
		],
		search: {
			provider: "local",
		},
		editLink: {
			pattern: "https://github.com/knockdata/objectexplorer/edit/main/docs/:path",
			text: "Edit this page on GitHub",
		},
		footer: {
			message: `<a href="${base}what-is-objectexplorer">Docs</a> · <a href="${base}pricing">Pricing</a> · <a href="${base}changelog">Changelog</a> · <a href="${base}privacy">Privacy</a> · <a href="mailto:rockie@knockdata.com">Contact</a>`,
			copyright: "© Knock Data AB, Sweden 2026",
		},
	},
})
