<script setup>
import { ref } from "vue"

const props = defineProps({
	url: { type: String, required: true },
	title: { type: String, default: "ObjectExplorer" },
	text: { type: String, default: "" },
	label: { type: String, default: "Share" },
})

const copied = ref(false)

// The device's own share sheet where there is one; a copied link where there is not — desktop
// Firefox has no navigator.share at all. Decided by what the browser can do, never by its width.
// Dismissing a share sheet rejects too, which is not an error worth more than a line.
async function share() {
	if (navigator.share) {
		try {
			await navigator.share({ url: props.url, title: props.title, text: props.text })
		}
		catch (error) {
			console.warn(error)
		}
	}
	else {
		try {
			await navigator.clipboard.writeText(props.url)
			copied.value = true
			setTimeout(function () {
				copied.value = false
			}, 1600)
		}
		catch (error) {
			console.warn(error)
		}
	}
}
</script>

<template>
	<button class="share-link" type="button" @click="share">
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<path d="m16 6-4-4-4 4" />
			<path d="M12 2v13" />
		</svg>
		<span>{{ copied ? "Link copied" : label }}</span>
	</button>
</template>

<style>
.share-link {
	align-items: center;
	background: transparent;
	border: 1px solid currentColor;
	border-radius: 999px;
	color: inherit;
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	gap: 8px;
	padding: 8px 16px;
}

.share-link svg {
	flex: none;
}
</style>
