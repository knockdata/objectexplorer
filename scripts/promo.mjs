// Records promo/promo.html into a video, frame by frame.
//
//   node scripts/promo.mjs                    # frames + mp4 + webm + poster
//   node scripts/promo.mjs --music track.mp3  # and lay that track under it
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
const page = pathToFileURL(path.join(root, "promo", "promo.html")).href
const frameDir = path.join(root, "promo", "frames")
const outDir = path.join(root, "docs", "public", "video")
const profileDir = path.join(os.tmpdir(), "chrome-promo")

const WIDTH = 1280
const HEIGHT = 720
const FPS = 30
// a fixed port is somebody else's the moment two things debug a browser on this machine, and the
// poll below would then talk to their Chrome instead of ours
const PORT = 9400 + Math.floor(Math.random() * 90)

const args = process.argv.slice(2)
const preview = args.includes("--preview")
const musicArg = args.indexOf("--music")
const music = musicArg >= 0 ? args[musicArg + 1] : defaultMusic()

function defaultMusic() {
	const dir = path.join(root, "promo", "music")
	let found = null
	if (fs.existsSync(dir)) {
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
		{ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false }, sessionId)

	// the page decodes every picture before it draws its first frame
	await evaluate(socket, sessionId, "window.promoReady")
	const duration = await evaluate(socket, sessionId, "window.promoDuration")
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
		await evaluate(socket, sessionId, "window.drawGrid()")
		await wait(1200)
		const grid = await send(socket, "Page.captureScreenshot", { format: "jpeg", quality: 90 }, sessionId)
		fs.writeFileSync(path.join(previewDir, "grid.jpg"), Buffer.from(grid.data, "base64"))
		socket.close()
		chrome.kill()
		console.log("wrote", previewDir)
		return
	}

	console.log(`recording ${duration}s — ${frames} frames`)

	for (let frame = 0; frame < frames; frame++) {
		await evaluate(socket, sessionId, `window.renderFrame(${frame / FPS})`)
		const shot = await send(socket, "Page.captureScreenshot", { format: "jpeg", quality: 92 }, sessionId)
		fs.writeFileSync(path.join(frameDir, `${String(frame).padStart(5, "0")}.jpg`), Buffer.from(shot.data, "base64"))
		if (frame % 60 === 0) {
			console.log(`  frame ${frame}/${frames}`)
		}
	}

	socket.close()
	chrome.kill()

	const silent = path.join(frameDir, "silent.mp4")
	ffmpeg(["-framerate", String(FPS), "-i", path.join(frameDir, "%05d.jpg"),
		"-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", silent])

	const mp4 = path.join(outDir, "objectexplorer.mp4")
	if (music) {
		console.log("music:", music)
		ffmpeg(["-i", silent, "-i", music,
			"-filter_complex", `[1:a]afade=t=out:st=${(frames / FPS - 2.5).toFixed(2)}:d=2.5[a]`,
			"-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", mp4])
	}
	else {
		console.log("no track in promo/music — the mp4 comes out silent")
		fs.copyFileSync(silent, mp4)
	}

	// One encode, with its music. The page plays it behind controls rather than autoplaying, so
	// there is no silent copy to keep: a reader who wants it quiet uses the mute button.
	ffmpeg(["-i", path.join(frameDir, `${String(Math.round(11.6 * FPS)).padStart(5, "0")}.jpg`),
		"-q:v", "3", path.join(outDir, "poster.jpg")])

	console.log("wrote", outDir)
}

record()
