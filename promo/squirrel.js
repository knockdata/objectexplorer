// The mascot, drawn: a vector squirrel and its nut as SVG strings, a pure function of a pose.
// The film asks for one pose per frame (promo.html), so the squirrel blinks, sways its tail and
// cracks the nut the same way in every build.
//
//   squirrel({ blink, tail, bounce, mood, look, tool, swing, sweat, bulb, wave })   → "<svg …>"
//   nut({ crack, glow, shake })                                                      → "<g …>"
//
// blink 0 open … 1 shut; tail −1 … 1 sway; bounce in px; mood "happy" | "curious" | "tired" |
// "excited"; look −1 … 1 where the eyes point; tool "" | "hammer" | "wrench" | "drill" | "torch";
// swing 0 … 1 through a blow; sweat and bulb 0 … 1 fade; wave 0 … 1 through a wave of the raised
// paw (0: the paw is down).

const INK = "#4a2a14"
const FUR = "#d9813f"
const FUR_DARK = "#b8642b"
const CREAM = "#fbe6c6"
const PINK = "#f4a3a0"
const LINE = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`

function tail(sway) {
	const angle = sway * 5
	return `
	<g transform="rotate(${angle} 150 300)">
		<path d="M150 310 C 60 320, 30 240, 60 170 C 85 110, 160 90, 175 40 C 215 80, 200 150, 160 180 C 120 210, 110 260, 150 310 Z"
			fill="${FUR}" ${LINE}/>
		<path d="M135 285 C 90 280, 75 230, 92 185 C 110 140, 160 125, 175 85 C 185 125, 165 160, 140 180 C 112 205, 105 250, 135 285 Z"
			fill="${CREAM}" opacity="0.55"/>
	</g>`
}

function ear(x, flip) {
	return `
	<g transform="translate(${x} 0) scale(${flip} 1)">
		<path d="M-28 118 C -40 70, -20 40, 0 30 C 15 55, 22 90, 18 118 Z" fill="${FUR}" ${LINE}/>
		<path d="M-18 112 C -26 80, -14 60, -2 52 C 6 70, 10 95, 8 112 Z" fill="${PINK}"/>
		<path d="M-4 34 C -10 20, -4 6, 6 0 C 4 10, 10 14, 18 12 C 14 22, 8 30, 4 36 Z" fill="${FUR_DARK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
	</g>`
}

function eye(x, blink, look) {
	const open = Math.max(0.06, 1 - blink)
	const lookX = look * 6
	return `
	<g transform="translate(${x} 170) scale(1 ${open})">
		<ellipse cx="0" cy="0" rx="19" ry="25" fill="${INK}"/>
		<ellipse cx="${lookX + 5}" cy="-9" rx="7.5" ry="9" fill="#fff"/>
		<circle cx="${lookX - 6}" cy="9" r="3.5" fill="#fff"/>
	</g>`
}

function mouth(mood) {
	let shape = ""
	if (mood === "tired") {
		shape = `<path d="M196 222 C 204 216, 216 216, 224 222" fill="none" ${LINE}/>`
	}
	else if (mood === "curious") {
		shape = `<ellipse cx="210" cy="222" rx="7" ry="8" fill="#7a2f2f" ${LINE}/>`
	}
	else if (mood === "excited") {
		shape = `<path d="M188 212 C 196 240, 224 240, 232 212 Z" fill="#7a2f2f" ${LINE}/>
			<rect x="202" y="211" width="16" height="12" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>`
	}
	else {
		shape = `<path d="M194 212 C 200 224, 208 224, 210 214 C 212 224, 220 224, 226 212" fill="none" ${LINE}/>
			<rect x="203" y="215" width="14" height="10" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>`
	}
	return shape
}

function sweatDrop(amount) {
	return amount > 0 ? `
	<path d="M296 112 C 306 128, 310 138, 302 146 C 294 152, 284 144, 288 134 C 290 126, 294 120, 296 112 Z"
		fill="#8fd3ff" stroke="${INK}" stroke-width="3" opacity="${amount}" transform="translate(0 ${(1 - amount) * -10})"/>` : ""
}

function bulb(amount) {
	return amount > 0 ? `
	<g opacity="${amount}" transform="translate(300 ${60 - amount * 12})">
		<g stroke="#ffd84d" stroke-width="5" stroke-linecap="round">
			<path d="M0 -44 V -58"/><path d="M-34 -30 L -44 -40"/><path d="M34 -30 L 44 -40"/>
		</g>
		<circle cx="0" cy="0" r="24" fill="#fff3a8" stroke="${INK}" stroke-width="4"/>
		<rect x="-11" y="22" width="22" height="14" rx="3" fill="#bbb" stroke="${INK}" stroke-width="4"/>
	</g>` : ""
}

// a tool in the right paw, swung around the paw by `swing`
function heldTool(tool, swing) {
	const angle = 20 + swing * 60
	let drawn = ""
	if (tool === "hammer") {
		drawn = `<rect x="-6" y="-90" width="12" height="96" rx="5" fill="#a0612d" ${LINE}/>
			<rect x="-30" y="-112" width="60" height="30" rx="6" fill="#9aa4ad" ${LINE}/>`
	}
	else if (tool === "wrench") {
		drawn = `<rect x="-7" y="-90" width="14" height="96" rx="6" fill="#b7c0c7" ${LINE}/>
			<path d="M-24 -108 a 26 26 0 1 0 48 0 l -10 0 l 0 14 l -28 0 l 0 -14 Z" fill="#b7c0c7" ${LINE}/>`
	}
	else if (tool === "drill") {
		drawn = `<rect x="-14" y="-20" width="28" height="36" rx="6" fill="#ffc533" ${LINE}/>
			<rect x="-22" y="-62" width="60" height="44" rx="12" fill="#ffc533" ${LINE}/>
			<rect x="38" y="-46" width="34" height="12" rx="3" fill="#9aa4ad" ${LINE}/>`
	}
	else if (tool === "torch") {
		drawn = `<rect x="-12" y="-30" width="24" height="44" rx="6" fill="#d24b3e" ${LINE}/>
			<rect x="-8" y="-62" width="16" height="34" rx="4" fill="#9aa4ad" ${LINE}/>
			<path d="M0 -64 C -16 -84, -6 -100, 0 -116 C 8 -100, 18 -86, 0 -64 Z" fill="#7fd4ff" stroke="${INK}" stroke-width="3"/>`
	}
	return tool ? `<g transform="translate(262 262) rotate(${tool === "drill" || tool === "torch" ? 70 + swing * 6 : angle})">${drawn}</g>` : ""
}

export function squirrel(pose) {
	const blink = pose.blink ?? 0
	const sway = pose.tail ?? 0
	const bounce = pose.bounce ?? 0
	const mood = pose.mood ?? "happy"
	const look = pose.look ?? 0.3
	const wave = pose.wave ?? 0
	return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -40 400 460" width="400" height="460">
	<ellipse cx="205" cy="402" rx="120" ry="12" fill="#000" opacity="0.18"/>
	<g transform="translate(0 ${-bounce})">
		${tail(sway)}
		<ellipse cx="205" cy="300" rx="78" ry="88" fill="${FUR}" ${LINE}/>
		<ellipse cx="212" cy="312" rx="50" ry="66" fill="${CREAM}"/>
		<ellipse cx="160" cy="382" rx="34" ry="16" fill="${FUR_DARK}" ${LINE}/>
		<ellipse cx="252" cy="382" rx="34" ry="16" fill="${FUR_DARK}" ${LINE}/>
		${ear(160, 1)}
		${ear(262, -1)}
		<ellipse cx="210" cy="175" rx="88" ry="80" fill="${FUR}" ${LINE}/>
		<ellipse cx="210" cy="212" rx="50" ry="36" fill="${CREAM}"/>
		<ellipse cx="148" cy="204" rx="16" ry="10" fill="${PINK}" opacity="0.7"/>
		<ellipse cx="272" cy="204" rx="16" ry="10" fill="${PINK}" opacity="0.7"/>
		${eye(178, blink, look)}
		${eye(242, blink, look)}
		${mood === "tired" ? `<path d="M162 160 L 194 150 M258 160 L 226 150" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : ""}
		<path d="M200 196 C 204 190, 216 190, 220 196 C 216 204, 204 204, 200 196 Z" fill="${INK}"/>
		${mouth(mood)}
		${heldTool(pose.tool ?? "", pose.swing ?? 0)}
		<ellipse cx="172" cy="268" rx="17" ry="13" fill="${FUR}" ${LINE}/>
		${wave > 0 ? `<g transform="rotate(${Math.sin(wave * Math.PI * 4) * 12} 268 250)">
			<path d="M262 262 C 280 240, 290 210, 292 190" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
			<path d="M262 262 C 280 240, 290 210, 292 190" fill="none" stroke="${FUR}" stroke-width="20" stroke-linecap="round"/>
			<ellipse cx="294" cy="180" rx="15" ry="17" fill="${FUR}" ${LINE}/>
		</g>` : `<ellipse cx="252" cy="268" rx="17" ry="13" fill="${FUR}" ${LINE}/>`}
		${sweatDrop(pose.sweat ?? 0)}
		${bulb(pose.bulb ?? 0)}
	</g>
</svg>`
}

// the nut, centred on 0,0, about 120 across; `crack` 0 … 1 splits it, `glow` lights the inside
export function nut(state) {
	const crack = state.crack ?? 0
	const glow = state.glow ?? 0
	const shake = state.shake ?? 0
	const apart = crack * 46
	const tilt = crack * 18
	const half = `
		<path d="M0 -62 C 40 -62, 64 -30, 62 6 C 60 40, 34 62, 0 62 Z" fill="#a8743f" ${LINE}/>
		<path d="M14 -48 C 34 -36, 40 -12, 30 10 M18 20 C 34 30, 40 42, 30 52 M40 -30 C 52 -14, 54 8, 48 26"
			stroke="#6f4520" stroke-width="4" fill="none" stroke-linecap="round"/>`
	return `
	<g transform="translate(${shake * 4} 0)">
		${glow > 0 ? `<circle cx="0" cy="0" r="${70 + glow * 70}" fill="#3ee08f" opacity="${glow * 0.35}"/>
			<circle cx="0" cy="0" r="${40 + glow * 30}" fill="#c8ffe2" opacity="${glow * 0.7}"/>` : ""}
		<g transform="translate(${apart} 0) rotate(${tilt})">${half}</g>
		<g transform="translate(${-apart} 0) rotate(${-tilt}) scale(-1 1)">${half}</g>
	</g>`
}
