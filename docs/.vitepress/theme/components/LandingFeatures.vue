<script setup>
import { withBase } from "vitepress"
import { useLanguage } from "../language/language.js"

// What the app does today, one card a thing, each leading to its page in the documentation
// (foldone 1125-17: the landing said only "opens any file" and "no secrets to an agent" while
// notebooks, a shell, a browser, circuits and models that run had shipped since).
const features = [
	{
		title: "Every storage in one tree",
		text: "S3, Google Cloud Storage, Azure Blob, OneLake, Google Drive, Dropbox, OneDrive, Box, FTP and SFTP servers and your own disks",
		link: "/storage/connect",
	},
	{
		title: "More than 1000 kinds of file",
		text: "Parquet and lake tables, AutoCAD drawings and 3D models, DICOM scans, ebooks, packet captures: each opens as itself",
		link: "/formats/",
	},
	{
		title: "Query any table",
		text: "SQL on a CSV, a Parquet file or a whole folder, with every column summed up",
		link: "/analyze/sql",
	},
	{
		title: "Notebooks that run",
		text: "Python, JavaScript, TypeScript and Java cells, run and saved as a Jupyter notebook",
		link: "/analyze/notebook",
	},
	{
		title: "Circuits that run",
		text: "A KiCad schematic simulated live on its drawing: each part's voltage and current, the LEDs lit",
		link: "/formats/circuit-boards",
	},
	{
		title: "Models that explain",
		text: "LightGBM, XGBoost, Core ML and Keras models as their trees and layers; a tree model predicts and says why",
		link: "/analyze/model",
	},
	{
		title: "Read and present",
		text: "Notes in every ebook and PDF; slides on a second display, with the next slide and your notes on the laptop",
		link: "/formats/slides",
	},
	{
		title: "A shell and a browser beside your files",
		text: "A shell in a pane, and a Browser that blocks ads and trackers and keeps your passwords",
		link: "/explore/browser",
	},
	{
		title: "Agents that never see your secrets",
		text: "Ask Claude, Codex, Gemini or Copilot about a file; personal data is masked before the agent reads it",
		link: "/agents/pii",
	},
]

const { translate } = useLanguage()
</script>

<template>
	<section class="landing-features landing-wrap">
		<h2>{{ translate("What You Get") }}</h2>
		<div class="landing-features-grid">
			<a v-for="feature in features" :key="feature.title" class="landing-feature" :href="withBase(feature.link)">
				<h3>{{ translate(feature.title) }}</h3>
				<p>{{ translate(feature.text) }}</p>
			</a>
		</div>
	</section>
</template>

<style src="./landing-features.css"></style>
