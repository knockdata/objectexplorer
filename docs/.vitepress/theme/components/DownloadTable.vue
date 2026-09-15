<script setup>
import useRelease from "../composables/useRelease.js"
import { downloadLink, downloadName, downloadPlatforms, releasesPage } from "../data/downloadPlatforms.js"

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
					<template v-for="download in platform.downloads" :key="download.label">
						<tr v-for="file in download.files" :key="file.target">
							<td>{{ platform.name }}, {{ download.label }}</td>
							<td>
								<a :href="downloadLink(file.target, '')">{{ downloadName(file.target) }}</a>
								<span v-if="release.sizes[file.target]" class="download-table-size"> · {{ release.sizes[file.target] }}</span>
							</td>
						</tr>
					</template>
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
