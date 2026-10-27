// One light for every glass element: a point light at the pointer. The rim nearest to it shines, the
// opposite rim answers, and the top under it glows. It reaches out from each element: the nearer the
// pointer, the brighter the glass and the closer the light sits to the pointer; out of reach the light
// settles back to a key light above and to the left. Each frame the light moves a fifth of the way to
// where it should be, so it glides rather than jumps. With reduced motion asked for, it stays put.
// glass.css draws the light from the custom properties written here.

const lights = new Map()
const reach = 260
let pointer = undefined
let frameRequested = false

function movesLess() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// the key light: up and to the left of the element, outside it
function restingLight(box) {
	return { strength: 0, x: box.width * -0.25, y: box.height * -0.9 }
}

function targetLight(box) {
	const resting = restingLight(box)
	let target = resting
	if (pointer !== undefined && movesLess() === false) {
		const x = pointer.x - box.left
		const y = pointer.y - box.top
		const outsideX = Math.max(-x, 0, x - box.width)
		const outsideY = Math.max(-y, 0, y - box.height)
		const nearness = Math.max(0, 1 - Math.hypot(outsideX, outsideY) / reach)
		target = { strength: nearness, x: resting.x + (x - resting.x) * nearness, y: resting.y + (y - resting.y) * nearness }
	}
	return target
}

function writeLight(element, light, box) {
	element.style.setProperty("--glass-light-x", `${light.x.toFixed(1)}px`)
	element.style.setProperty("--glass-light-y", `${light.y.toFixed(1)}px`)
	element.style.setProperty("--glass-echo-x", `${(box.width - light.x).toFixed(1)}px`)
	element.style.setProperty("--glass-echo-y", `${(box.height - light.y).toFixed(1)}px`)
	element.style.setProperty("--glass-light-strength", light.strength.toFixed(3))
}

// moves every light a step toward its target; asks for another frame while any is still moving
function frame() {
	let moving = false
	const step = movesLess() ? 1 : 0.2
	lights.forEach(function (light, element) {
		const box = element.getBoundingClientRect()
		if (box.width > 0) {
			const target = targetLight(box)
			const distance = Math.hypot(target.x - light.x, target.y - light.y) + Math.abs(target.strength - light.strength) * 100
			if (distance > 0.5) {
				light.strength += (target.strength - light.strength) * step
				light.x += (target.x - light.x) * step
				light.y += (target.y - light.y) * step
				moving = true
			}
			else {
				Object.assign(light, target)
			}
			writeLight(element, light, box)
		}
	})
	if (moving) {
		window.requestAnimationFrame(frame)
	}
	else {
		frameRequested = false
	}
}

function requestFrame() {
	if (frameRequested === false) {
		frameRequested = true
		window.requestAnimationFrame(frame)
	}
}

function followPointer(event) {
	pointer = { x: event.clientX, y: event.clientY }
	requestFrame()
}

// the pointer left the window
function losePointer(event) {
	if (event.relatedTarget === null) {
		pointer = undefined
		requestFrame()
	}
}

export function watchLight(element) {
	if (lights.size === 0) {
		window.addEventListener("pointermove", followPointer, { passive: true })
		window.addEventListener("scroll", requestFrame, { passive: true })
		document.addEventListener("pointerout", losePointer)
	}
	const box = element.getBoundingClientRect()
	const light = restingLight(box)
	lights.set(element, light)
	writeLight(element, light, box)
	requestFrame()
}

export function unwatchLight(element) {
	lights.delete(element)
	if (lights.size === 0) {
		window.removeEventListener("pointermove", followPointer)
		window.removeEventListener("scroll", requestFrame)
		document.removeEventListener("pointerout", losePointer)
	}
}
