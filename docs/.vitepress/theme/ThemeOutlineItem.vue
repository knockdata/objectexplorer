<script setup>
// Stands in for VitePress's own VPDocOutlineItem (config.js aliases it), in the aside outline and in
// the "On this page" dropdown. The same list, except a release heading — "v0.7.0 — 2026-09-12" — is
// laid out as its version on the left and its date on the right, so the dates line up.
defineProps({
	headers: { type: Array, required: true },
	root: { type: Boolean, default: false },
})

function titleParts(title) {
	const parts = title.split("—").map(part => part.trim())
	if (parts.length === 2 && /^\d{4}-\d{2}-\d{2}$/.test(parts[1])) {
		return parts
	}
	else {
		return [title]
	}
}

// the link itself, not the span inside it that was clicked
function focusHeading(event) {
	const id = event.currentTarget.href.split("#")[1]
	const heading = document.getElementById(decodeURIComponent(id))
	if (heading) {
		heading.focus({ preventScroll: true })
	}
}
</script>

<template>
	<ul class="VPDocOutlineItem" :class="root ? 'root' : 'nested'">
		<li v-for="{ children, link, title } in headers" :key="link">
			<a class="outline-link" :href="link" :title="title" @click="focusHeading">
				<span v-for="part in titleParts(title)" :key="part">{{ part }}</span>
			</a>
			<ThemeOutlineItem v-if="children?.length" :headers="children" />
		</li>
	</ul>
</template>

<style>
.VPDocOutlineItem.root {
	position: relative;
	z-index: 1;
}

.VPDocOutlineItem.nested {
	padding-left: 16px;
	padding-right: 16px;
}

.VPDocOutlineItem .outline-link {
	color: var(--vp-c-text-2);
	display: flex;
	font-size: 14px;
	font-weight: 400;
	gap: 12px;
	justify-content: space-between;
	line-height: 32px;
	transition: color 0.5s;
	white-space: nowrap;
}

.VPDocOutlineItem .outline-link span {
	overflow: hidden;
	text-overflow: ellipsis;
}

/* the date never shrinks, and its digits take one width each so the column lines up */
.VPDocOutlineItem .outline-link span + span {
	flex: none;
	font-variant-numeric: tabular-nums;
}

.VPDocOutlineItem .outline-link:hover,
.VPDocOutlineItem .outline-link.active {
	color: var(--vp-c-text-1);
	transition: color 0.25s;
}
</style>
