<script setup>
import useRelease from "../composables/useRelease.js"
import { downloadLink, downloadPlatforms, releasesPage } from "../data/downloadPlatforms.js"

const release = useRelease()
</script>

<template>
	<div class="download-table">
		<table>
			<thead>
				<tr>
					<th>Platform</th>
					<th>Download</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="platform in downloadPlatforms" :key="platform.id">
					<tr v-for="download in platform.downloads" :key="download.target">
						<td>{{ platform.name }}, {{ download.label }}</td>
						<td>
							<a :href="downloadLink(download.target, '')">ObjectExplorer-{{ download.target }}</a>
							<span v-if="release.sizes[download.target]" class="download-table-size"> · {{ release.sizes[download.target] }}</span>
						</td>
					</tr>
				</template>
			</tbody>
		</table>
		<p v-if="release.version">The newest release is <a :href="releasesPage">{{ release.version }}</a>.</p>
	</div>
</template>

<style>
.download-table-size {
	color: var(--vp-c-text-3);
}
</style>
