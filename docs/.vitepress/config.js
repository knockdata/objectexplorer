import { defineConfig } from "vitepress"

// Where the built site is rooted. objectexplorer.com serves it at the domain root, which is the
// default; GitHub Pages serves the same build under /objectexplorer/, and sets DOCS_BASE to say
// so. Everything VitePress generates — assets, links, the logo — is prefixed with this.
const base = process.env.DOCS_BASE ?? "/"

// The whole site — the landing page and the documentation are one thing now, served at
// objectexplorer.com by the front door in rock2/server, with the app itself at /app on the same
// origin. Dark is the default: the app is dark, and every screenshot here was taken in it.
export default defineConfig({
	base,
	title: "ObjectExplorer",
	description: "Browse, preview, query and search S3, GCS, Azure Blob and local folders in one window",
	appearance: "dark",
	cleanUrls: true,
	lastUpdated: true,
	head: [
		["link", { rel: "icon", type: "image/png", href: `${base}img/64.png` }],
		["meta", { property: "og:title", content: "ObjectExplorer" }],
		["meta", { property: "og:description", content: "The VS Code for cloud storage. Every byte stays on your machine." }],
		["meta", { property: "og:image", content: "https://objectexplorer.com/shot/hero.png" }],
	],
	sitemap: {
		hostname: "https://objectexplorer.com",
	},
	themeConfig: {
		logo: "/img/64.png",
		nav: [
			{ text: "Guide", link: "/what-is-objectexplorer" },
			{ text: "Formats", link: "/formats/" },
			{ text: "Changelog", link: "/changelog" },
			{ text: "Download", link: "/getting-started#download" },
			// the running app, on the same origin once this site is objectexplorer.com. Absolute
			// so it still reaches the app from the GitHub Pages copy of these pages.
			{ text: "Open app", link: "https://objectexplorer.com/app" },
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
					{ text: "Charts", link: "/analyze/charts" },
					{ text: "Models", link: "/analyze/model" },
					{ text: "Data lake tables", link: "/analyze/lake" },
					{ text: "Cloud Logging", link: "/analyze/logging" },
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
					{ text: "Troubleshooting", link: "/reference/troubleshooting" },
				],
			},
		],
		socialLinks: [
			{ icon: "github", link: "https://github.com/knockdata/objectexplorer" },
			{ icon: "linkedin", link: "https://www.linkedin.com/in/rockieyang/" },
		],
		search: {
			provider: "local",
		},
		editLink: {
			pattern: "https://github.com/knockdata/objectexplorer/edit/main/docs/:path",
			text: "Edit this page on GitHub",
		},
		footer: {
			message: 'Every byte stays on your machine. Questions: <a href="mailto:rockie@knockdata.com">rockie@knockdata.com</a>',
			copyright: "© 2025 ObjectExplorer — a product of Knock Data AB, Sweden.",
		},
	},
})
