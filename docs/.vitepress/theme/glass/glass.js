// Liquid glass for small controls (the landing's call to action, the search button): the page
// behind is refracted at the rim through an SVG filter (glassFilter.js), tinted, and lit by a light
// that follows the pointer (glassLight.js). Three layers are added under the control's own content,
// so its text, its size and its focus ring stay as they were.
//
// Only Chromium applies an SVG filter as a backdrop-filter. Safari and Firefox get frosted glass
// (blur and tint, glass.css) with the same light. Before the page is hydrated, and with scripts
// off, the control keeps its own look: the glass is added in the browser only.

import "./glass.css"
import { releaseFilter, useFilter } from "./glassFilter.js"
import { unwatchLight, watchLight } from "./glassLight.js"

// a thin bezel and a little frost, as the sandbox's dark bars, scaled down for a button
const material = { bezelWidth: 8, blur: 2, depth: 6, edgeSmoothing: 0.6, refractiveIndex: 1.5, saturation: 1.5, thickness: 12 }
const glasses = new Map()

// navigator.userAgentData is Chromium's alone, and Chromium the one that refracts
function refracts() {
	return "userAgentData" in navigator && CSS.supports("backdrop-filter", "url(#glass)")
}

function layer(className) {
	const span = document.createElement("span")
	span.className = className
	span.setAttribute("aria-hidden", "true")
	return span
}

// a filter for the control's size and corner, made again when the control's size changes
function refract(glass) {
	const width = glass.element.offsetWidth
	const height = glass.element.offsetHeight
	if (width > 0 && height > 0) {
		const radius = parseFloat(getComputedStyle(glass.element).borderTopLeftRadius) || 0
		const filter = useFilter({ ...material, cornerRadius: Math.min(radius, height / 2), height, width })
		releaseFilter(glass.filterKey)
		glass.filterKey = filter.key
		glass.lens.style.backdropFilter = `url(#${filter.id})`
	}
}

// variant: "brand" (the call to action's green glass, dark text) or "clear" (a smoky glass)
export function attachGlass(element, variant) {
	if (element && glasses.has(element) === false) {
		const glass = { element, filterKey: "", lens: layer("glass-lens"), observer: undefined }
		element.classList.add("glass", `glass-${variant}`)
		element.append(glass.lens, layer("glass-glow"), layer("glass-rim"))
		if (refracts()) {
			element.classList.add("glass-refracting")
			glass.observer = new ResizeObserver(function () {
				refract(glass)
			})
			glass.observer.observe(element)
		}
		glasses.set(element, glass)
		watchLight(element)
	}
}

export function detachGlass(element) {
	const glass = glasses.get(element)
	if (glass) {
		if (glass.observer) {
			glass.observer.disconnect()
		}
		releaseFilter(glass.filterKey)
		unwatchLight(element)
		glasses.delete(element)
	}
}

// v-glass="'brand'" on an element or a component: mounted runs in the browser only, never in the
// server build
export const glassDirective = {
	mounted(element, binding) {
		attachGlass(element, binding.value ?? "clear")
	},
	unmounted(element) {
		detachGlass(element)
	},
}
