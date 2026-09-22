import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const publicFolder = fileURLToPath(new URL("../../../public", import.meta.url))

// The card's art is 9:16, measured in card widths: 1 wide, 16/9 tall.
const cardHeight = 16 / 9

function clamp(value, low, high) {
	return Math.min(Math.max(value, low), high)
}

// A PNG's width and height sit at bytes 16 and 20 of its header.
function pngSize(poster) {
	const file = path.join(publicFolder, poster)
	if (poster.endsWith(".png") && fs.existsSync(file)) {
		const header = fs.readFileSync(file).subarray(0, 24)
		return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
	}
	else {
		return null
	}
}

// Where one axis of the image goes: the focus point on the card's middle, pulled back so the image
// never leaves an empty edge, or centred when the image is shorter than the card on that axis.
function offset(imageLength, cardLength, focusShare) {
	if (imageLength > cardLength) {
		return clamp(cardLength / 2 - focusShare * imageLength, cardLength - imageLength, 0)
	}
	else {
		return (cardLength - imageLength) / 2
	}
}

// `focus` names the area of a poster the card shows: its centre `x` and `y`, and the `width` of the
// image it spans, all percentages of the image. Without a width the image covers the card.
// Returns the img's inline style, or null when the poster's size is unknown and CSS cover applies.
export default function posterPlacement(poster, focus) {
	const size = poster ? pngSize(poster) : null
	if (size) {
		const aspect = size.width / size.height
		const coverWidth = Math.max(1, cardHeight * aspect)
		const imageWidth = focus?.width ? 100 / focus.width : coverWidth
		const imageHeight = imageWidth / aspect
		const left = offset(imageWidth, 1, (focus?.x ?? 50) / 100)
		const top = offset(imageHeight, cardHeight, (focus?.y ?? 50) / 100)
		return {
			height: "auto",
			left: `${(left * 100).toFixed(2)}%`,
			maxWidth: "none",
			position: "absolute",
			top: `${(top / cardHeight * 100).toFixed(2)}%`,
			width: `${(imageWidth * 100).toFixed(2)}%`,
		}
	}
	else {
		return null
	}
}
