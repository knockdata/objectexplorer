import { defineConfig } from "vitepress"

// The documentation site, served at docs.objectexplorer.com. Dark is the default —
// the app is dark, and every screenshot on these pages was taken in it.
export default defineConfig({
	title: "ObjectExplorer",
	description: "Browse, preview, query and search S3, GCS, Azure Blob and local folders in one window",
	appearance: "dark",
	cleanUrls: true,
	lastUpdated: true,
	head: [
		["link", { rel: "icon", type: "image/png", href: "/img/64.png" }],
		["meta", { property: "og:title", content: "ObjectExplorer" }],
		["meta", { property: "og:description", content: "The VS Code for cloud storage. Every byte stays on your machine." }],
		["meta", { property: "og:image", content: "https://docs.objectexplorer.com/shot/hero.png" }],
	],
	sitemap: {
		hostname: "https://docs.objectexplorer.com",
	},
	themeConfig: {
		logo: "/img/64.png",
		nav: [
			{ text: "Guide", link: "/what-is-objectexplorer" },
			{ text: "Formats", link: "/formats/" },
			{ text: "Changelog", link: "/changelog" },
			{ text: "Download", link: "/getting-started#download" },
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
		],
		search: {
			provider: "local",
		},
		editLink: {
			pattern: "https://github.com/knockdata/objectexplorer/edit/main/docs/:path",
			text: "Edit this page on GitHub",
		},
		footer: {
			message: "Released under the terms on objectexplorer.com",
			copyright: "© Knockdata",
		},
	},
})
