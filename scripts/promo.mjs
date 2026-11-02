// Records promo/promo.html into a video, frame by frame.
//
//   node scripts/promo.mjs                    # frames + mp4 (the poster is not the film's: docs/public/video/poster.png,
//                                             # the usage disc cut from docs/public/screenshot/usage-visualization.png)
//   node scripts/promo.mjs --preview          # one still per cut, into promo/preview
//   node scripts/promo.mjs --music track.mp3  # with that track under it
//   node scripts/promo.mjs --encode           # the last recording's frames encoded again
//
// The cuts fall on the music's beat: the track's <name>.beats.json beside it (scripts/promo-beats.py)
// gives the page its tempo and first beat. A track shorter than the film is played again from a stop
// to a later stop (whole phrases), as often as the film needs, so that its own ending comes as the end
// card does; one without stops is looped on a phrase of 16 beats and faded under the end card.
//
// The film's track is TRACK in promo/music, which is not in git (Pixabay's licence: never handed out on
// its own; promo/CREDITS.md says where to get it); without it, the first other track there.
//
// The page is a function of time (`window.renderFrame(t)`), so every frame is asked for and then
// screenshotted: nothing is captured in real time, which is what keeps a busy machine from
// dropping frames and makes two builds of the film identical.
//
// Chrome is driven over the DevTools protocol with node's own WebSocket — no puppeteer, no ws.
import { spawn, spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, "..")
const frameDir = path.join(root, "promo", "frames")
const outDir = path.join(root, "docs", "public", "video")
const profileDir = path.join(os.tmpdir(), "chrome-promo")

// the page is laid out at 1280x720 and drawn at 1.5x, so the film is 1080p with every picture
// sampled from its own full size rather than blown up from a 720p frame
const WIDTH = 1280
const HEIGHT = 720
const SCALE = 1.5
const FPS = 30
// a track without stops is looped on a phrase of this many beats
const PHRASE = 16
// the film's music, in promo/music
const TRACK = "mrclaps-clapping-492559.mp3"
// a fixed port is somebody else's the moment two things debug a browser on this machine, and the
// poll below would then talk to their Chrome instead of ours
const PORT = 9400 + Math.floor(Math.random() * 90)

const args = process.argv.slice(2)
const preview = args.includes("--preview")
const musicArg = args.indexOf("--music")
const music = musicArg >= 0 ? args[musicArg + 1] : defaultMusic()
const beats = readBeats(music)
const page = `${pathToFileURL(path.join(root, "promo", "promo.html")).href}?tempo=${beats.tempo}&first=${beats.first}`

// the track's tempo, first beat and length (scripts/promo-beats.py); without one, 134 beats a minute from 0
function readBeats(track) {
	let found = { tempo: 134, first: 0, duration: Infinity }
	if (track) {
		const file = track.replace(/\.[^.]*$/, ".beats.json")
		if (fs.existsSync(file)) {
			found = JSON.parse(fs.readFileSync(file, "utf8"))
		}
		else {
			console.log(`no ${path.basename(file)}: the cuts are not on the track's beat (scripts/promo-beats.py)`)
		}
	}
	return found
}

// The track as long as the film. With stops (beats.loop and beats.hit): to the middle of a stop, then
// again from the middle of an earlier one, as many phrases as needed, so the downbeat of its own ending
// lands one beat into the end card, then on to its end. Shorter and without stops: to the last whole phrase that
// ends 2 s before its end, then again from its first beat, faded out where the end card comes. Long
// enough: as it is.
function musicFilter(musicEnd, duration) {
	let filter = `[1:a]apad,atrim=0:${duration.toFixed(3)}[a]`
	if (beats.loop !== undefined) {
		filter = stopsFilter(musicEnd, duration)
	}
	else if (beats.duration < musicEnd) {
		filter = phraseFilter(musicEnd, duration)
	}
	return filter
}

// The film asks for so many phrases more than the track has; they are taken back from its last stop: the
// whole stretch between the stops as often as it fits, then the rest from a stop that many phrases before
// the last one (every phrase ends on a stop, so each seam falls in one)
function stopsFilter(musicEnd, duration) {
	const period = 60 / beats.tempo
	const phrase = PHRASE * period
	const more = Math.max(0, Math.round((musicEnd + period - beats.hit) / phrase))
	const landing = beats.hit + more * phrase
	if (Math.abs(landing - (musicEnd + period)) > 0.05) {
		console.log(`the track's ending lands ${(landing - musicEnd - period).toFixed(2)} s off the end card's first beat: the film's beats are not whole phrases from it`)
	}
	let pieces = [[0, beats.duration]]
	if (more > 0) {
		pieces = [[0, beats.loop.to]]
		let left = more
		while (left > 0) {
			const span = Math.min(left, beats.loop.phrases)
			const from = beats.loop.to - span * phrase
			left -= span
			pieces.push([from, left > 0 ? beats.loop.to : beats.duration])
		}
	}
	console.log(`music: ${more} phrases more than the track, played as ${pieces.map(([from, to]) => `${from.toFixed(2)}–${to.toFixed(2)}`).join(", ")} s; its ending at ${landing.toFixed(2)} s`)
	return joinPieces(pieces, `apad,atrim=0:${duration.toFixed(3)}`)
}

function phraseFilter(musicEnd, duration) {
	const period = 60 / beats.tempo
	const phrase = PHRASE * period
	const loopEnd = beats.first + Math.floor((beats.duration - beats.first - 2) / phrase) * phrase
	// the whole first time, then from the first beat on
	const pieces = [[0, loopEnd]]
	let covered = loopEnd
	while (covered < musicEnd) {
		pieces.push([beats.first, loopEnd])
		covered += loopEnd - beats.first
	}
	return joinPieces(pieces, `afade=t=out:st=${(musicEnd - 0.6).toFixed(3)}:d=0.6,apad,atrim=0:${duration.toFixed(3)}`)
}

// pieces of the track one after another, each seam faded over 10 ms so it cannot click; the input is
// read once and asplit hands each piece its own copy to trim
function joinPieces(pieces, after) {
	const copies = pieces.map((piece, index) => `[copy${index}]`).join("")
	const trims = pieces.map(function trim([from, to], index) {
		const fadeIn = index > 0 ? ",afade=t=in:d=0.01" : ""
		const fadeOut = index < pieces.length - 1 ? `,afade=t=out:st=${(to - from - 0.01).toFixed(3)}:d=0.01` : ""
		return `[copy${index}]atrim=${from.toFixed(3)}:${to.toFixed(3)},asetpts=PTS-STARTPTS${fadeIn}${fadeOut}[piece${index}]`
	})
	const joined = pieces.map((piece, index) => `[piece${index}]`).join("")
	return [`[1:a]asplit=${pieces.length}${copies}`, ...trims, `${joined}concat=n=${pieces.length}:v=0:a=1,${after}[a]`].join(";")
}

// the film's track when it is there, else the first other one in promo/music
function defaultMusic() {
	const dir = path.join(root, "promo", "music")
	let found = null
	if (fs.existsSync(path.join(dir, TRACK))) {
		found = path.join(dir, TRACK)
	}
	else if (fs.existsSync(dir)) {
		console.log(`no promo/music/${TRACK} (promo/CREDITS.md says where to get it): the film takes another track`)
		const tracks = fs.readdirSync(dir).filter((name) => name.endsWith(".mp3") || name.endsWith(".m4a") || name.endsWith(".wav"))
		if (tracks.length) {
			found = path.join(dir, tracks[0])
		}
	}
	return found
}

function chromePath() {
	const candidates = [
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		"/usr/bin/google-chrome",
		"/usr/bin/chromium",
	]
	return candidates.find((candidate) => fs.existsSync(candidate))
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

async function browserSocket() {
	let version = null
	for (let tries = 0; tries < 40 && version === null; tries++) {
		try {
			version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()
		} catch (error) {
			await wait(250)
		}
	}
	return version.webSocketDebuggerUrl
}

function connect(url) {
	return new Promise((resolve, reject) => {
		const socket = new WebSocket(url)
		socket.onopen = () => resolve(socket)
		socket.onerror = reject
	})
}

function send(socket, method, params = {}, sessionId) {
	return new Promise((resolve, reject) => {
		const id = Math.floor(Math.random() * 1e9)
		function onMessage(event) {
			const message = JSON.parse(event.data)
			if (message.id === id) {
				socket.removeEventListener("message", onMessage)
				if (message.error) {
					reject(new Error(JSON.stringify(message.error)))
				}
				else {
					resolve(message.result)
				}
			}
		}
		socket.addEventListener("message", onMessage)
		socket.send(JSON.stringify({ id, method, params, sessionId }))
	})
}

async function evaluate(socket, sessionId, expression) {
	const { result, exceptionDetails } = await send(socket, "Runtime.evaluate",
		{ expression, returnByValue: true, awaitPromise: true }, sessionId)
	if (exceptionDetails) {
		throw new Error(exceptionDetails.exception?.description ?? JSON.stringify(exceptionDetails))
	}
	else {
		return result.value
	}
}

function ffmpeg(params) {
	const run = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...params], { stdio: "inherit" })
	if (run.status !== 0) {
		throw new Error(`ffmpeg failed: ${params.join(" ")}`)
	}
}

async function record() {
	// a fresh profile every run: the old one cached the screenshots by file path, so re-taking a
	// picture changed nothing on screen
	fs.rmSync(profileDir, { recursive: true, force: true })
	fs.rmSync(frameDir, { recursive: true, force: true })
	fs.mkdirSync(frameDir, { recursive: true })
	fs.mkdirSync(outDir, { recursive: true })

	const chrome = spawn(chromePath(), [
		"--headless=new",
		"--disable-gpu",
		"--hide-scrollbars",
		"--allow-file-access-from-files",
		`--remote-debugging-port=${PORT}`,
		`--window-size=${WIDTH},${HEIGHT}`,
		`--user-data-dir=${profileDir}`,
		"--disk-cache-size=1",
		page,
	], { stdio: "ignore" })

	const socket = await connect(await browserSocket())
	// by url, not by type: a fresh profile also carries chrome:// pages and an extension page,
	// and attaching to one of those leaves every evaluate returning undefined. The tab appears a
	// moment after the debugging port does, so it is waited for.
	let target = null
	for (let tries = 0; tries < 40 && target === null; tries++) {
		const targets = await send(socket, "Target.getTargets")
		target = targets.targetInfos.find((info) => info.url.includes("promo.html")) ?? null
		if (target === null) {
			await wait(250)
		}
	}
	const { sessionId } = await send(socket, "Target.attachToTarget", { targetId: target.targetId, flatten: true })
	await send(socket, "Page.enable", {}, sessionId)
	await send(socket, "Runtime.enable", {}, sessionId)
	await send(socket, "Emulation.setDeviceMetricsOverride",
		{ width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE, mobile: false }, sessionId)

	// the page decodes every picture before it draws its first frame
	await evaluate(socket, sessionId, "window.promoReady")
	const duration = await evaluate(socket, sessionId, "window.promoDuration")
	const musicEnd = await evaluate(socket, sessionId, "window.promoMusicEnd")
	const warnings = await evaluate(socket, sessionId, "window.promoWarnings")
	for (const warning of warnings) {
		console.log("reads badly:", warning)
	}
	const frames = Math.round(duration * FPS)

	// --preview writes one still per scene into promo/preview instead of the film, which is how
	// a cut, a crop or a line is checked without waiting for a thousand frames
	if (preview) {
		const previewDir = path.join(root, "promo", "preview")
		fs.mkdirSync(previewDir, { recursive: true })
		const scenes = await evaluate(socket, sessionId, "window.promoScenes")
		for (const [index, at] of scenes.entries()) {
			await evaluate(socket, sessionId, `window.renderFrame(${at + 0.9})`)
			const shot = await send(socket, "Page.captureScreenshot", { format: "jpeg", quality: 90 }, sessionId)
			fs.writeFileSync(path.join(previewDir, `${String(index).padStart(2, "0")}.jpg`), Buffer.from(shot.data, "base64"))
		}
		socket.close()
		chrome.kill()
		console.log("wrote", previewDir)
		return
	}

	console.log(`recording ${duration}s — ${frames} frames`)

	for (let frame = 0; frame < frames; frame++) {
		await evaluate(socket, sessionId, `window.renderFrame(${frame / FPS})`)
		// png, not jpeg: a lossy frame fed to a lossy encoder is two rounds of loss, and the fine
		// text of a screenshot is what shows it first
		const shot = await send(socket, "Page.captureScreenshot", { format: "png" }, sessionId)
		fs.writeFileSync(path.join(frameDir, `${String(frame).padStart(5, "0")}.png`), Buffer.from(shot.data, "base64"))
		if (frame % 60 === 0) {
			console.log(`  frame ${frame}/${frames}`)
		}
	}

	socket.close()
	chrome.kill()

	// what the encode needs from the page, kept with the frames so --encode can run again without it
	const film = { frames, musicEnd }
	fs.writeFileSync(path.join(frameDir, "film.json"), JSON.stringify(film))
	encode(film)
}

// the frames into the mp4 with its music
function encode({ frames, musicEnd }) {
	const silent = path.join(frameDir, "silent.mp4")
	// crf 22 is near what the eye can tell from the frames and keeps the 135 s film under 20 MB;
	// -color_range tv with yuv420p so players that expect broadcast range read it right, and bt709
	// because that is what 1080p is shown in
	ffmpeg(["-framerate", String(FPS), "-i", path.join(frameDir, "%05d.png"),
		"-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
		"-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", silent])

	const mp4 = path.join(outDir, "objectexplorer.mp4")
	if (music) {
		console.log("music:", music)
		ffmpeg(["-i", silent, "-i", music,
			"-filter_complex", musicFilter(musicEnd, frames / FPS),
			"-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
		"-movflags", "+faststart", mp4])
	}
	else {
		console.log("no track in promo/music — the mp4 comes out silent")
		ffmpeg(["-i", silent, "-c", "copy", "-movflags", "+faststart", mp4])
	}

	// One encode, with its music. The page plays it behind controls rather than autoplaying, so
	// there is no silent copy to keep: a reader who wants it quiet uses the mute button.

	console.log("wrote", outDir)
}

// --encode: the frames of the last recording encoded again (another crf, another track), without Chrome
if (args.includes("--encode")) {
	encode(JSON.parse(fs.readFileSync(path.join(frameDir, "film.json"), "utf8")))
}
else {
	record()
}
