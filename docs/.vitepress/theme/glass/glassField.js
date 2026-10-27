// The physics of the glass, run once per size on the CPU: the shape's signed distance and normal, a
// convex squircle surface over a bezel at the rim, and where one ray from the eye lands on the page
// behind once Snell's law has bent it at that surface.

export function smoothstep(low, high, value) {
	const fraction = Math.min(Math.max((value - low) / (high - low), 0), 1)
	return fraction * fraction * (3 - 2 * fraction)
}

// height of the surface across the bezel: 0 at the rim, 1 where the flat top starts
function surfaceHeight(fraction) {
	const clamped = Math.min(Math.max(fraction, 0), 1)
	return Math.pow(1 - (1 - clamped) ** 4, 0.25)
}

function surfaceSlope(fraction) {
	const step = 0.001
	const low = Math.max(fraction - step, 0)
	const high = Math.min(fraction + step, 1)
	return (surfaceHeight(high) - surfaceHeight(low)) / (high - low)
}

// a rounded rectangle centred on 0, 0: negative inside, positive outside
function shapeField(shape, x, y) {
	const radiusX = Math.max(Math.min(shape.cornerRadius, shape.halfWidth), 1)
	const radiusY = Math.max(Math.min(shape.cornerRadius, shape.halfHeight), 1)
	const cornerX = Math.abs(x) - (shape.halfWidth - radiusX)
	const cornerY = Math.abs(y) - (shape.halfHeight - radiusY)
	let field = Math.max(cornerX - radiusX, cornerY - radiusY)
	if (cornerX >= 0 && cornerY >= 0) {
		const length = Math.hypot(cornerX / radiusX, cornerY / radiusY)
		field = (length - 1) * Math.min(radiusX, radiusY)
	}
	return field
}

// signed distance to the rim and the outward normal, from the field and its gradient
export function sampleShape(shape, x, y) {
	const step = 0.5
	const field = shapeField(shape, x, y)
	const gradientX = (shapeField(shape, x + step, y) - shapeField(shape, x - step, y)) / (2 * step)
	const gradientY = (shapeField(shape, x, y + step) - shapeField(shape, x, y - step)) / (2 * step)
	const length = Math.max(Math.hypot(gradientX, gradientY), 1e-6)
	return { distance: field / Math.max(length, 0.5), normalX: gradientX / length, normalY: gradientY / length }
}

// One ray straight down from the eye, bent once at the glass surface, then on to the page under the
// glass. Returns where it lands, relative to the pixel it left: zero on the flat top, pulled in from
// further inside across the bezel.
export function refractionOffset(glass, sample) {
	const fraction = Math.min(Math.max(-sample.distance / glass.bezelWidth, 0), 1)
	const slope = glass.thickness * surfaceSlope(fraction) / glass.bezelWidth
	const length = Math.hypot(slope, 1)
	const surfaceX = sample.normalX * slope / length
	const surfaceY = sample.normalY * slope / length
	const surfaceZ = 1 / length
	const ratio = 1 / glass.refractiveIndex
	const under = 1 - ratio * ratio * (1 - surfaceZ * surfaceZ)
	const factor = ratio * surfaceZ - Math.sqrt(Math.max(under, 0))
	const rayX = factor * surfaceX
	const rayY = factor * surfaceY
	const rayZ = -ratio + factor * surfaceZ
	const travel = glass.depth + glass.thickness * surfaceHeight(fraction)
	return { x: rayX / -rayZ * travel, y: rayY / -rayZ * travel }
}

export function shapeOf(glass) {
	return { cornerRadius: glass.cornerRadius, halfHeight: glass.height / 2, halfWidth: glass.width / 2 }
}
