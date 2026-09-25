<script setup>
import { onMounted, ref } from "vue"

// The domain a page is written with. Every text on the page that says it — code blocks, tables,
// prose — is rewritten in place to the domain the reader types, so what they copy is theirs.
// The copy button of a code block reads the code when clicked, so it copies the rewritten text too;
// an address in a table or a sentence gets a copy button of its own beside it.
const EXAMPLE = "oe.example.com"
const STORAGE_KEY = "docsDomain"
const COPY_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`

const domain = ref("")
// every text on the page that holds the example, with the text as the page was built
const found = []

function readStored() {
	try {
		return localStorage.getItem(STORAGE_KEY) ?? ""
	}
	catch (error) {
		return ""
	}
}

function writeStored(value) {
	try {
		localStorage.setItem(STORAGE_KEY, value)
	}
	catch (error) {
		console.warn(error)
	}
}

function collect() {
	const page = document.querySelector(".vp-doc")
	if (page) {
		const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT)
		let node = walker.nextNode()
		while (node) {
			if (node.nodeValue.includes(EXAMPLE)) {
				found.push({ node, original: node.nodeValue })
				addCopyButton(node.parentElement)
			}
			else {
				// nothing of the domain in this text
			}
			node = walker.nextNode()
		}
	}
	else {
		// no page to rewrite
	}
}

// only an inline code value: a code block has its own copy button
function addCopyButton(element) {
	if (element.tagName === "CODE" && element.closest("pre") === null) {
		const button = document.createElement("button")
		button.type = "button"
		button.className = "domain-copy"
		button.title = "Copy"
		button.innerHTML = COPY_ICON
		button.addEventListener("click", function () {
			copy(button, element.textContent)
		})
		element.after(button)
	}
	else {
		// prose, or inside a code block
	}
}

async function copy(button, text) {
	try {
		await navigator.clipboard.writeText(text)
		button.classList.add("copied")
		setTimeout(function () {
			button.classList.remove("copied")
		}, 1600)
	}
	catch (error) {
		console.warn(error)
	}
}

function substitute(next) {
	for (const { node, original } of found) {
		node.nodeValue = original.split(EXAMPLE).join(next)
	}
}

function apply() {
	const typed = domain.value.trim().toLowerCase()
	writeStored(typed)
	substitute(typed || EXAMPLE)
}

onMounted(function () {
	collect()
	domain.value = readStored()
	apply()
})
</script>

<template>
	<label class="domain-input">
		<span>Your domain</span>
		<input v-model="domain" type="text" :placeholder="EXAMPLE" spellcheck="false" autocomplete="off" @input="apply" />
	</label>
</template>

<style>
.domain-input {
	align-items: center;
	background: var(--vp-c-bg-soft);
	border-radius: 8px;
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin: 16px 0;
	padding: 12px 16px;
}

.domain-input span {
	font-weight: 600;
}

.domain-input input {
	background: var(--vp-c-bg);
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	flex: 1;
	font-family: var(--vp-font-family-mono);
	min-width: 0;
	padding: 6px 10px;
}

.domain-input input:focus {
	border-color: var(--vp-c-brand-1);
	outline: none;
}

.domain-copy {
	background: transparent;
	border: none;
	color: var(--vp-c-text-3);
	cursor: pointer;
	margin-left: 4px;
	padding: 2px;
	vertical-align: middle;
}

.domain-copy:hover {
	color: var(--vp-c-brand-1);
}

.domain-copy.copied {
	color: var(--vp-c-green-1);
}
</style>
