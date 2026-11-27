// node test/site.mjs [site] — every page of the site opened in headless Chrome, and three kinds of issue
// reported (test.sh runs it):
//
//   dead link     a link, image, video or frame on a page that does not answer (HTTP 400 or more, no answer
//                 at all), or a link to #anchor that the page it points to does not have
//   cannot play   a <video> or <audio> that does not start, muted, within PLAY_SECONDS; a YouTube film whose
//                 Play is pressed and that YouTube says is missing, private or not embeddable (its oEmbed)
//   error         a console error, an uncaught exception or a failed request on the page (in its frames too:
//                 the app the landing frames), and a page that is the site's own "not found" page
//   other site    a link, image, video or frame on objectexplorer.com that goes to cn.objectexplorer.com, or the
//                 other way round: each site keeps its visitor (1108-3; mainland China cannot reach the first)
//   blank app     a page's framed app (AppDemo), opened at its own address with its query, that draws nothing
//                 within PAGE_SECONDS, or whose item does not open ("Cannot read this file"): the address
//                 names a key the app stopped on, or an item no longer in its demo (foldone 1115-8)
//
// Each page, and each framed app, has PAGE_LIMIT_SECONDS (120) in all: one that has not finished by
// then is an error naming the step it was on, its tab closed, and the run goes on (/story/view-a-file held the
// v0.9.47 release's check 45 minutes). A dialog a page opens (alert, confirm, leave this page?) is an
// error and answered at once: Chrome answers nothing else on the page while one is open.
//
// The pages: the sitemap's, and every page of the site a visited page links to (the app, /app/, is
// opened but not crawled further). Links to other sites are checked once each; EXTERNAL=0 leaves them out.
// The report goes to build/test/report.txt (and report.json), one line an issue, grouped by kind; the exit
// code is 1 when there is any.
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const site = new URL(process.argv[2] ?? process.env.SITE ?? "https://objectexplorer.com/")
const checkExternal = process.env.EXTERNAL !== "0"
const tabs = Number(process.env.TABS ?? 4)
const playSeconds = Number(process.env.PLAY_SECONDS ?? 10)
const pageSeconds = Number(process.env.PAGE_SECONDS ?? 30)
const pageLimitSeconds = Number(process.env.PAGE_LIMIT_SECONDS ?? 120)
const debugPort = Number(process.env.DEBUG_PORT ?? 9333)
const reportFolder = "build/test"
// our two sites: a page of one never names the other
const ourSites = ["objectexplorer.com", "cn.objectexplorer.com"]
// pages that are the host's, not the site's: opened when linked, never crawled
const notCrawled = ["/app/", "/demo/", "/learning/", "/releases/"]
// a browser user agent: some sites answer a script's default one with 403
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"

const browserCandidates = [
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
	"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
	"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
]

const issues = []
// url without its #anchor → { pages: Set of pages linking to it, anchors: Map anchor → Set of pages, kind }
const links = new Map()
// page url → Set of the element ids it has, for #anchor checks
const pageIds = new Map()
const youtubeFilms = new Map()
// a framed app's address, with its query → Set of the pages framing it
const appFrames = new Map()
// page url → the HTTP status its document answered with
const pageStatus = new Map()
// the pages open while this machine's network changed (net::ERR_NETWORK_CHANGED): their requests failed for
// that, not for the site (1126-7: the release's check failed so while its VMs brought their network up)
const networkChanged = new Set()

function report(kind, page, what, detail) {
	issues.push({ kind, page, what, detail })
	console.log(`  ${kind}: ${page} → ${what}${detail ? ` (${detail})` : ""}`)
}

function wait(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

// the page url the site serves: no #anchor, no query
function pageKey(address) {
	const url = new URL(address)
	url.hash = ""
	url.search = ""
	return url.href
}

function onSite(address) {
	const url = new URL(address)
	return url.origin === site.origin
}

function crawled(address) {
	const url = new URL(address)
	return onSite(address) && !notCrawled.some((folder) => url.pathname.startsWith(folder)) && !/\.[a-z0-9]+$/i.test(url.pathname.replace(/\.html$/, ""))
}

function remember(address, page, kind) {
	const url = new URL(address)
	const anchor = decodeURIComponent(url.hash.slice(1))
	url.hash = ""
	if (!links.has(url.href)) {
		links.set(url.href, { pages: new Set(), anchors: new Map(), kind })
	}
	const link = links.get(url.href)
	link.pages.add(page)
	if (anchor !== "") {
		if (!link.anchors.has(anchor)) {
			link.anchors.set(anchor, new Set())
		}
		link.anchors.get(anchor).add(page)
	}
}

// ---------------------------------------------------------------------------
// Chrome, through its DevTools protocol (node's own WebSocket, no dependencies)
// ---------------------------------------------------------------------------

async function startBrowser() {
	const browserPath = process.env.CHROME ?? browserCandidates.find((candidate) => existsSync(candidate))
	if (browserPath) {
		const profile = mkdtempSync(path.join(tmpdir(), "site-test-"))
		const child = spawn(browserPath, ["--headless=new", "--no-first-run", "--mute-audio", "--autoplay-policy=no-user-gesture-required", `--remote-debugging-port=${debugPort}`, "--window-size=1400,1000", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" })
		let ready = false
		let attempt = 0
		while (!ready && attempt < 100) {
			try {
				await fetch(`http://127.0.0.1:${debugPort}/json/version`)
				ready = true
			} catch (error) {
				await wait(200)
				attempt += 1
			}
		}
		if (ready) {
			// stopped from outside (tools/test-release.sh stops a part that stalls): Chrome with it, or it
			// stays, holding the debugging port the next run asks (the v0.9.47 release's stayed)
			for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
				process.once(signal, function () {
					child.kill()
					process.exit(1)
				})
			}
			// the profile removed once Chrome is gone: it writes there until it exits
			async function stop() {
				const exited = new Promise((resolve) => child.once("exit", resolve))
				child.kill()
				await Promise.race([exited, wait(5000)])
				rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
			}
			return { stop }
		} else {
			child.kill()
			throw new Error(`${browserPath}: its debugger did not answer on port ${debugPort}`)
		}
	} else {
		throw new Error("no Chrome found (CHROME=<path> names one)")
	}
}

// a tab with its own socket: send(method, params) and the events of the page
// a page in a window of its own: tabs sharing a window are hidden but one, and Chrome pauses a muted film in
// a hidden tab ("video-only background media was paused to save power"), 1108-3
async function newWindow() {
	const version = await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json()
	const browser = new WebSocket(version.webSocketDebuggerUrl)
	await new Promise((resolve, reject) => {
		browser.addEventListener("open", resolve)
		browser.addEventListener("error", reject)
	})
	const created = new Promise((resolve) => browser.addEventListener("message", (event) => resolve(JSON.parse(event.data))))
	browser.send(JSON.stringify({ id: 1, method: "Target.createTarget", params: { url: "about:blank", newWindow: true } }))
	const answer = await created
	browser.close()
	return { id: answer.result.targetId, webSocketDebuggerUrl: `ws://127.0.0.1:${debugPort}/devtools/page/${answer.result.targetId}` }
}

async function openTab() {
	const target = await newWindow()
	const socket = new WebSocket(target.webSocketDebuggerUrl)
	await new Promise((resolve, reject) => {
		socket.addEventListener("open", resolve)
		socket.addEventListener("error", reject)
	})
	const waiting = new Map()
	const listeners = new Set()
	let nextId = 1
	// the tab closed or Chrome gone: what waits for an answer is told, instead of waiting for ever
	socket.addEventListener("close", function () {
		for (const { reject, method } of waiting.values()) {
			reject(new Error(`${method}: the tab's connection closed`))
		}
		waiting.clear()
	})
	socket.addEventListener("message", function (event) {
		const message = JSON.parse(event.data)
		if (message.method === "Page.javascriptDialogOpening") {
			// while a dialog is open the page answers nothing (Runtime.evaluate waits for ever)
			send("Page.handleJavaScriptDialog", { accept: true }).catch(() => {})
		}
		if (message.id && waiting.has(message.id)) {
			const { resolve, reject, method } = waiting.get(message.id)
			waiting.delete(message.id)
			if (message.error) {
				reject(new Error(`${method}: ${message.error.message}`))
			} else {
				resolve(message.result)
			}
		} else if (message.method) {
			for (const listener of listeners) {
				listener(message)
			}
		}
	})
	function send(method, params = {}) {
		return new Promise(function (resolve, reject) {
			const id = nextId
			nextId += 1
			waiting.set(id, { resolve, reject, method })
			socket.send(JSON.stringify({ id, method, params }))
		})
	}
	async function evaluate(expression) {
		const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })
		if (exceptionDetails) {
			throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
		} else {
			return result.value
		}
	}
	await send("Page.enable")
	await send("Runtime.enable")
	await send("Network.enable")
	await send("Log.enable")
	async function close() {
		try {
			await fetch(`http://127.0.0.1:${debugPort}/json/close/${target.id}`, { signal: AbortSignal.timeout(10000) })
		} catch (error) {
			console.log(`  (a tab did not close: ${error.message})`)
		}
		socket.close()
	}
	return { send, evaluate, listeners, close }
}

// a page's work given pageLimitSeconds in all: past it the page is said with the step it was on
// (work sets state.step as it goes, and state.tab once its tab is open), its tab closed, and null
// returned; state.abandoned tells the work to say nothing more
async function withinLimit(kind, page, what, work) {
	const state = { step: "opening its tab", tab: null, abandoned: false }
	let timer = null
	const limit = new Promise((resolve) => {
		timer = setTimeout(() => resolve(state), pageLimitSeconds * 1000)
	})
	const outcome = await Promise.race([work(state), limit])
	clearTimeout(timer)
	if (outcome === state) {
		state.abandoned = true
		report(kind, page, what, `not done in ${pageLimitSeconds} s: stopped while ${state.step}`)
		if (state.tab) {
			await state.tab.close()
		}
		return null
	} else {
		return outcome
	}
}

// ---------------------------------------------------------------------------
// One page
// ---------------------------------------------------------------------------

// what the page holds, read in the page: its links, its ids, its media, whether it is "not found"
const readPage = `(() => {
	const addresses = []
	function add(kind, value) {
		if (value && !value.startsWith("data:") && !value.startsWith("blob:") && !value.startsWith("javascript:") && !value.startsWith("mailto:") && !value.startsWith("tel:")) {
			addresses.push({ kind, address: new URL(value, document.baseURI).href })
		}
	}
	document.querySelectorAll("a[href]").forEach((element) => add("link", element.getAttribute("href")))
	document.querySelectorAll("img[src]").forEach((element) => add("image", element.getAttribute("src")))
	document.querySelectorAll("video[src], audio[src], source[src]").forEach((element) => add("media", element.getAttribute("src")))
	document.querySelectorAll("video[poster]").forEach((element) => add("image", element.getAttribute("poster")))
	document.querySelectorAll("iframe[src]").forEach((element) => add("frame", element.getAttribute("src")))
	document.querySelectorAll("link[rel=stylesheet][href], link[rel=icon][href]").forEach((element) => add("asset", element.getAttribute("href")))
	return {
		addresses,
		ids: [...document.querySelectorAll("[id]")].map((element) => element.id),
		notFound: document.querySelector(".NotFound") !== null,
		appFrames: [...document.querySelectorAll(".app-demo-frame iframe[src]")].map((element) => new URL(element.getAttribute("src"), document.baseURI).href),
	}
})()`

// every Play pressed: our posters and the story cards' buttons
const pressPlay = `(() => {
	const buttons = [...document.querySelectorAll("button.youtube-player-poster, button.story-card-badge")]
	buttons.forEach((button) => button.click())
	return buttons.length
})()`

const youtubeFrames = `[...document.querySelectorAll("iframe[src*='youtube']")].map((frame) => frame.src)`
// the download links of this site that VitePress's router would catch (no target, no download)
const routedDownloads = `[...document.querySelectorAll("a[href]")].filter((link) => link.origin === location.origin && link.pathname.startsWith("/download/") && link.hasAttribute("target") === false && link.hasAttribute("download") === false).map((link) => link.href)`

// each <video> and <audio>, muted, played: started or why not, within the seconds given
function playMedia(seconds) {
	return `(async () => {
		const media = [...document.querySelectorAll("video, audio")]
		const results = []
		for (const element of media) {
			const source = element.currentSrc || element.src || element.querySelector("source")?.src || "(no source)"
			element.muted = true
			let outcome = "started"
			try {
				await Promise.race([
					element.play(),
					new Promise((resolve, reject) => setTimeout(() => reject(new Error("did not start in ${seconds} s")), ${seconds * 1000})),
				])
				const start = element.currentTime
				await new Promise((resolve) => setTimeout(resolve, 1500))
				if (element.currentTime <= start && !element.ended) {
					outcome = "started but did not advance (readyState " + element.readyState + ")"
				}
			} catch (error) {
				outcome = element.error ? "media error " + element.error.code + (element.error.message ? ": " + element.error.message : "") : error.message
			}
			element.pause()
			results.push({ source, outcome })
		}
		return results
	})()`
}

function visit(address) {
	return withinLimit("error", address, "the page", (state) => visitWithin(address, state))
}

async function visitWithin(address, state) {
	const tab = await openTab()
	state.tab = tab
	if (state.abandoned) {
		await tab.close()
	}
	function say(kind, page, what, detail) {
		if (!state.abandoned) {
			report(kind, page, what, detail)
		}
	}
	const errors = []
	const requests = new Map()
	tab.listeners.add(function (message) {
		if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
			errors.push(`console: ${message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" ")}`)
		} else if (message.method === "Runtime.exceptionThrown") {
			const details = message.params.exceptionDetails
			errors.push(`exception: ${details.exception?.description?.split("\n")[0] ?? details.text}`)
		} else if (message.method === "Log.entryAdded" && message.params.entry.level === "error" && message.params.entry.source !== "network") {
			errors.push(`${message.params.entry.source}: ${message.params.entry.text}`)
		} else if (message.method === "Page.javascriptDialogOpening") {
			errors.push(`dialog (${message.params.type}): ${message.params.message}`)
		} else if (message.method === "Network.requestWillBeSent") {
			requests.set(message.params.requestId, message.params.request.url)
		} else if (message.method === "Network.responseReceived" && message.params.type === "Document" && pageKey(message.params.response.url) === address && !pageStatus.has(address)) {
			pageStatus.set(address, message.params.response.status)
		} else if (message.method === "Network.responseReceived" && message.params.response.status >= 400) {
			errors.push(`request ${message.params.response.status}: ${message.params.response.url}`)
		} else if (message.method === "Network.loadingFailed" && message.params.errorText === "net::ERR_NETWORK_CHANGED") {
			networkChanged.add(address)
		} else if (message.method === "Network.loadingFailed" && !message.params.canceled && message.params.errorText !== "net::ERR_ABORTED") {
			errors.push(`request failed (${message.params.errorText}): ${requests.get(message.params.requestId) ?? message.params.requestId}`)
		}
	})
	let content = null
	try {
		const loaded = new Promise((resolve) => tab.listeners.add((message) => message.method === "Page.loadEventFired" && resolve()))
		state.step = "navigating to it"
		const navigation = await tab.send("Page.navigate", { url: address })
		if (navigation.errorText) {
			say("dead link", address, address, navigation.errorText)
		} else {
			state.step = "waiting for its load event"
			await Promise.race([loaded, wait(pageSeconds * 1000)])
			// the app and the components fill in after load
			await wait(2000)
			state.step = "reading its links"
			content = await tab.evaluate(readPage)
			if (content.notFound) {
				say("dead link", address, address, "the site's not-found page")
			}
			// a link to /download/… with no target or download attribute: VitePress's router takes it for
			// a page of the site when it does not know the extension (.dmg, .msix) and shows its 404
			for (const link of await tab.evaluate(routedDownloads)) {
				say("dead link", address, link, "a download link VitePress takes for a page: give it target=\"_self\"")
			}
			state.step = "pressing its films' Play"
			const pressed = await tab.evaluate(pressPlay)
			if (pressed > 0) {
				await wait(3000)
				state.step = "reading its YouTube frames"
				for (const frame of await tab.evaluate(youtubeFrames)) {
					const film = new URL(frame).pathname.split("/").pop()
					if (!youtubeFilms.has(film)) {
						youtubeFilms.set(film, new Set())
					}
					youtubeFilms.get(film).add(address)
				}
			}
			state.step = "playing its videos"
			for (const result of await tab.evaluate(playMedia(playSeconds))) {
				if (result.outcome !== "started") {
					say("cannot play", address, result.source, result.outcome)
				}
			}
		}
	} catch (error) {
		say("error", address, "the test itself", error.message)
	}
	for (const error of new Set(errors)) {
		say("error", address, error)
	}
	if (!state.abandoned) {
		state.step = "closing its tab"
		await tab.close()
	}
	return content
}


// ---------------------------------------------------------------------------
// The links, each checked once
// ---------------------------------------------------------------------------

// a "share this" link (Hacker News, X, LinkedIn, Reddit, Bluesky): it asks the viewer to sign in, so a
// script gets 4xx from a link that works
function shareLink(address) {
	return /news\.ycombinator\.com\/submitlink|twitter\.com\/intent|x\.com\/intent|linkedin\.com\/(sharing|shareArticle)|reddit\.com\/submit|bsky\.app\/intent/.test(address)
}

// GitHub answers 429 to a script asking many pages of a repository; the file behind an edit or blob
// link is asked of raw.githubusercontent.com instead, which does not
function checkedAddress(address) {
	const match = address.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:edit|blob)\/(.+)$/)
	return match ? `https://raw.githubusercontent.com/${match[1]}/${match[2]}` : address
}

// the status of an address: HEAD first, and GET (one byte asked) when a server refuses HEAD
async function status(address) {
	const headers = { "user-agent": userAgent }
	try {
		let response = await fetch(address, { method: "HEAD", redirect: "follow", headers, signal: AbortSignal.timeout(20000) })
		if (response.status >= 400) {
			response = await fetch(address, { method: "GET", redirect: "follow", headers: { ...headers, range: "bytes=0-0" }, signal: AbortSignal.timeout(20000) })
			await response.body?.cancel()
		}
		return { code: response.status, text: response.status >= 400 ? `HTTP ${response.status}` : "" }
	} catch (error) {
		return { code: 0, text: error.cause?.code ?? error.message }
	}
}

async function checkLinks(visited) {
	for (const [address, link] of links) {
		const host = new URL(address).hostname
		if (ourSites.includes(host) && host !== site.hostname) {
			for (const page of link.pages) {
				report("other site", page, address, `not ${site.hostname}`)
			}
		}
	}
	const pending = [...links.entries()].filter(([address]) => !visited.has(address) && !shareLink(address) && (onSite(address) || checkExternal))
	console.log(`== ${pending.length} links not opened as pages, checked (${checkExternal ? "other sites too" : "this site only: EXTERNAL=0"})`)
	// one request at a time to each host: GitHub answers 429 to eight at once
	const byHost = new Map()
	for (const entry of pending) {
		const host = new URL(entry[0]).host
		if (!byHost.has(host)) {
			byHost.set(host, [])
		}
		byHost.get(host).push(entry)
	}
	// a line every 50 links, so a long check (GitHub's 429s waited out) is not taken for a hang
	let checked = 0
	async function checkHost(entries) {
		for (const [address, link] of entries) {
			checked += 1
			if (checked % 50 === 0) {
				console.log(`== ${checked} of ${pending.length} links checked`)
			}
			let result = await status(checkedAddress(address))
			let attempt = 1
			while (result.code === 429 && attempt < 4) {
				await wait(5000 * attempt)
				result = await status(checkedAddress(address))
				attempt += 1
			}
			// a site that refuses robots (403, 429, LinkedIn's 999) is not a dead link; it is said, as a warning
			if (result.code === 403 || result.code === 429 || result.code === 999) {
				console.log(`  (unsure: ${address} answers ${result.code} to a script)`)
			} else if (result.text !== "") {
				for (const page of link.pages) {
					report("dead link", page, address, result.text)
				}
			}
		}
	}
	await Promise.all([...byHost.values()].map(checkHost))
	// the pages opened whose document did not answer: dead for every page linking to them
	for (const [address, code] of pageStatus) {
		if (code >= 400 && links.has(address)) {
			for (const page of links.get(address).pages) {
				report("dead link", page, address, `HTTP ${code}`)
			}
		}
	}
	// #anchors, on the pages that were opened
	for (const [address, link] of links) {
		if (pageIds.has(address)) {
			for (const [anchor, pages] of link.anchors) {
				if (!pageIds.get(address).has(anchor)) {
					for (const page of pages) {
						report("dead link", page, `${address}#${anchor}`, "no such anchor on the page")
					}
				}
			}
		}
	}
}

// each film pressed: YouTube's oEmbed answers 200 for a public, embeddable film, 401 or 403 when it
// may not be embedded, 404 when it is gone or private
async function checkFilms() {
	console.log(`== ${youtubeFilms.size} YouTube films`)
	for (const [film, pages] of youtubeFilms) {
		const result = await status(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${film}`)}`)
		if (result.code !== 200) {
			const why = result.code === 404 ? "not found or private" : result.code === 401 || result.code === 403 ? "embedding not allowed" : result.text
			for (const page of pages) {
				report("cannot play", page, `youtube ${film}`, why)
			}
		}
	}
}

// ---------------------------------------------------------------------------

async function sitemapPages() {
	const result = []
	try {
		const response = await fetch(new URL("sitemap.xml", site))
		if (response.ok) {
			const text = await response.text()
			for (const match of text.matchAll(/<loc>([^<]+)<\/loc>/g)) {
				result.push(match[1].replace(/^https?:\/\/[^/]+/, site.origin))
			}
		} else {
			console.log(`  (no sitemap.xml: HTTP ${response.status}; starting from the home page alone)`)
		}
	} catch (error) {
		console.log(`  (no sitemap.xml: ${error.message})`)
	}
	return result
}

// ---------------------------------------------------------------------------
// The framed apps, each opened at its own address
// ---------------------------------------------------------------------------

// what the app shows: its text, and whether a tab says it cannot read its item
const readApp = `(() => ({
	text: document.body ? document.body.innerText.trim().length : 0,
	unreadable: [...document.querySelectorAll(".unreachable_reason")].map((element) => element.innerText),
}))()`

// a frame drew nothing (the app stopped before drawing) or opened its item with an error; its
// console lines said with it, since the app's own reason is there (objectexplorer: not an argument …)
function checkAppFrame(frame, pages) {
	return withinLimit("blank app", [...pages][0], frame, (state) => checkAppFrameWithin(frame, pages, state))
}

async function checkAppFrameWithin(frame, pages, state) {
	const tab = await openTab()
	state.tab = tab
	if (state.abandoned) {
		await tab.close()
	}
	function say(kind, page, what, detail) {
		if (!state.abandoned) {
			report(kind, page, what, detail)
		}
	}
	const lines = []
	tab.listeners.add(function (message) {
		if (message.method === "Runtime.consoleAPICalled" && message.params.args.some((argument) => String(argument.value ?? "").startsWith("objectexplorer:"))) {
			lines.push(message.params.args.map((argument) => argument.value ?? "").join(" "))
		}
	})
	const page = [...pages][0]
	try {
		state.step = "navigating to it"
		await tab.send("Page.navigate", { url: frame })
		state.step = "waiting for it to draw"
		let shown = { text: 0, unreadable: [] }
		const until = Date.now() + pageSeconds * 1000
		while (shown.text === 0 && Date.now() < until) {
			await wait(1000)
			shown = await tab.evaluate(readApp)
		}
		// an item opens a moment after the window draws
		await wait(3000)
		shown = await tab.evaluate(readApp)
		if (shown.text === 0) {
			say("blank app", page, frame, lines.join("; ") || `nothing drawn in ${pageSeconds} s`)
		} else if (shown.unreadable.length > 0) {
			say("blank app", page, frame, shown.unreadable.join("; "))
		}
	} catch (error) {
		say("blank app", page, frame, error.message)
	}
	if (!state.abandoned) {
		await tab.close()
	}
}

async function checkAppFrames() {
	console.log(`== ${appFrames.size} framed apps`)
	const entries = [...appFrames.entries()]
	let checked = 0
	async function worker() {
		while (entries.length > 0) {
			const [frame, pages] = entries.shift()
			await checkAppFrame(frame, pages)
			checked += 1
			if (checked % 20 === 0) {
				console.log(`== ${checked} framed apps opened, ${entries.length} to go`)
			}
		}
	}
	await Promise.all(Array.from({ length: tabs }, worker))
}

async function main() {
	console.log(`== ${site.href}`)
	const browser = await startBrowser()
	const queue = [site.href, ...await sitemapPages()].map(pageKey)
	const seen = new Set(queue)
	const visited = new Set()
	// a worker with an empty queue waits while another still visits: that page may add more
	let visiting = 0
	async function worker() {
		while (queue.length > 0 || visiting > 0) {
			if (queue.length > 0) {
				visiting += 1
				await visitNext()
				visiting -= 1
			} else {
				await wait(200)
			}
		}
	}
	async function visitNext() {
		const address = queue.shift()
		const content = await visit(address)
		visited.add(address)
		if (content) {
			pageIds.set(address, new Set(content.ids))
			for (const frame of content.appFrames) {
				if (!appFrames.has(frame)) {
					appFrames.set(frame, new Set())
				}
				appFrames.get(frame).add(address)
			}
			for (const { kind, address: linked } of content.addresses) {
				remember(linked, address, kind)
				if (kind === "link" && onSite(linked) && crawled(linked) || kind === "frame" && onSite(linked)) {
					const key = pageKey(linked)
					if (!seen.has(key) && !notCrawled.some((folder) => new URL(address).pathname.startsWith(folder))) {
						seen.add(key)
						queue.push(key)
					}
				}
			}
		}
		if (visited.size % 20 === 0) {
			console.log(`== ${visited.size} pages opened, ${queue.length} to go`)
		}
	}
	try {
		await Promise.all(Array.from({ length: tabs }, worker))
		// with the browser still open: each opens a tab
		await checkAppFrames()
	} finally {
		await browser.stop()
	}
	console.log(`== ${visited.size} pages opened`)
	if (networkChanged.size > 0) {
		console.log(`  (unsure: this machine's network changed while ${networkChanged.size} pages were open, their failed requests not counted: ${[...networkChanged].join(" ")})`)
	}
	await checkLinks(visited)
	await checkFilms()

	mkdirSync(reportFolder, { recursive: true })
	const kinds = ["dead link", "other site", "cannot play", "blank app", "error"]
	const lines = [`${site.href}: ${visited.size} pages, ${links.size} links, ${youtubeFilms.size} films; ${issues.length} issues`]
	for (const kind of kinds) {
		const ofKind = issues.filter((issue) => issue.kind === kind)
		lines.push("", `## ${kind}: ${ofKind.length}`)
		for (const issue of ofKind) {
			lines.push(`${issue.page} → ${issue.what}${issue.detail ? ` (${issue.detail})` : ""}`)
		}
	}
	writeFileSync(`${reportFolder}/report.txt`, lines.join("\n") + "\n")
	writeFileSync(`${reportFolder}/report.json`, JSON.stringify(issues, null, "\t") + "\n")
	console.log("")
	console.log(kinds.map((kind) => `${issues.filter((issue) => issue.kind === kind).length} ${kind}`).join(", ") + ` — ${reportFolder}/report.txt`)
	process.exitCode = issues.length > 0 ? 1 : 0
}

await main()
