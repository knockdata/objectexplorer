// The refraction as an SVG filter that backdrop-filter applies to whatever lies behind the glass, on
// every frame, without script. The maps are built once per size: a displacement map (where each
// pixel reads the page from) and the bezel (where the reading is smoothed, since a displacement map
// samples nearest-neighbour and the steep rim would show stairs). Glass of the same size shares one
// filter, removed once its last element is gone. Only Chromium applies an SVG filter as a
// backdrop-filter; glass.js decides where to use it.

import { refractionOffset, sampleShape, shapeOf, smoothstep } from "./glassField.js"

const svgNamespace = "http://www.w3.org/2000/svg"
const filters = new Map()
let definitions = undefined
let filterCount = 0

function imageUrl(imageData) {
	const canvas = document.createElement("canvas")
	canvas.width = imageData.width
	canvas.height = imageData.height
	canvas.getContext("2d").putImageData(imageData, 0, 0)
	return canvas.toDataURL("image/png")
}

function buildMaps(glass, pixelRatio) {
	const shape = shapeOf(glass)
	const width = Math.round(glass.width * pixelRatio)
	const height = Math.round(glass.height * pixelRatio)
	const offsets = new Float32Array(width * height * 2)
	const displacement = new ImageData(width, height)
	const bezel = new ImageData(width, height)
	let largest = 1
	for (let row = 0; row < height; row += 1) {
		for (let column = 0; column < width; column += 1) {
			const index = row * width + column
			const sample = sampleShape(shape, (column + 0.5) / pixelRatio - shape.halfWidth, (row + 0.5) / pixelRatio - shape.halfHeight)
			const offset = refractionOffset(glass, sample)
			offsets[index * 2] = offset.x
			offsets[index * 2 + 1] = offset.y
			largest = Math.max(largest, Math.abs(offset.x), Math.abs(offset.y))
			bezel.data.set([255, 255, 255, (1 - smoothstep(glass.bezelWidth * 0.75, glass.bezelWidth, -sample.distance)) * 255], index * 4)
		}
	}
	for (let index = 0; index < width * height; index += 1) {
		displacement.data.set([128 + offsets[index * 2] / largest * 127, 128 + offsets[index * 2 + 1] / largest * 127, 128, 255], index * 4)
	}
	return { bezel: imageUrl(bezel), displacement: imageUrl(displacement), scale: largest * 2 }
}

function filterMarkup(id, glass, maps) {
	const box = `x="0" y="0" width="${glass.width}" height="${glass.height}"`
	return [
		`<filter id="${id}" ${box} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">`,
		`<feGaussianBlur in="SourceGraphic" stdDeviation="${glass.blur}" result="frosted"/>`,
		`<feImage href="${maps.displacement}" ${box} preserveAspectRatio="none" result="displacementMap"/>`,
		`<feDisplacementMap in="frosted" in2="displacementMap" scale="${maps.scale}" xChannelSelector="R" yChannelSelector="G" result="refractedSharp"/>`,
		`<feGaussianBlur in="refractedSharp" stdDeviation="${glass.edgeSmoothing}" result="refractedBlurred"/>`,
		`<feImage href="${maps.bezel}" ${box} preserveAspectRatio="none" result="bezelMask"/>`,
		`<feComposite in="refractedBlurred" in2="bezelMask" operator="in" result="bezelSoft"/>`,
		`<feComposite in="bezelSoft" in2="refractedSharp" operator="over" result="refracted"/>`,
		`<feColorMatrix in="refracted" type="saturate" values="${glass.saturation}"/>`,
		"</filter>",
	].join("")
}

// the id of a filter for this glass, made the first time that size is asked for
export function useFilter(glass) {
	const key = JSON.stringify(glass)
	let entry = filters.get(key)
	if (entry === undefined) {
		if (definitions === undefined) {
			definitions = document.createElementNS(svgNamespace, "svg")
			definitions.setAttribute("aria-hidden", "true")
			definitions.setAttribute("class", "glass-definitions")
			document.body.append(definitions)
		}
		filterCount += 1
		const id = `liquid-glass-${filterCount}`
		const group = document.createElementNS(svgNamespace, "g")
		group.innerHTML = filterMarkup(id, glass, buildMaps(glass, Math.min(window.devicePixelRatio || 1, 2)))
		definitions.append(group)
		entry = { group, id, users: 0 }
		filters.set(key, entry)
	}
	entry.users += 1
	return { id: entry.id, key }
}

export function releaseFilter(key) {
	const entry = filters.get(key)
	if (entry) {
		entry.users -= 1
		if (entry.users === 0) {
			entry.group.remove()
			filters.delete(key)
		}
	}
}
