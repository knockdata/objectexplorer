// Proves the one unproven assumption in the design: a worker thread keeps serving HTTP
// while webview_run blocks the main thread forever.
//
// The worker serves a page that pings itself every 300ms and writes every request to
// out/smoke.log. If the log fills up with pings, the worker's event loop is alive while the
// main thread sits inside webview_run, and the whole architecture holds.
//
// Run: npm run smoke   (opens a window for 8 seconds, then exits and prints the log)
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Worker } from "node:worker_threads"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const logFile = path.join(root, "out", "smoke.log")
fs.writeFileSync(logFile, "")

const workerSource = `
import fs from "node:fs"
import http from "node:http"
import { parentPort, workerData } from "node:worker_threads"

const log = (line) => fs.appendFileSync(workerData.logFile, line + "\\n")

const page = \`<body style="font:16px sans-serif;padding:2rem">
	<h1>worker is alive</h1><pre id="out"></pre>
	<script>
		let count = 0
		setInterval(async () => {
			const text = await (await fetch("/ping")).text()
			out.textContent = ++count + " " + text
		}, 300)
	</script></body>\`

const server = http.createServer((request, response) => {
	log("served " + request.url)
	response.end(request.url === "/ping" ? "pong " + Date.now() : page)
})

server.listen(0, "127.0.0.1", () => {
	const { port } = server.address()
	log("listening on " + port)
	parentPort.postMessage({ port })
})

// the main thread is stuck in webview_run and can never do this itself
setTimeout(() => {
	log("worker timer fired after 8s, exiting")
	process.exit(0)
}, 8000)
`

const worker = new Worker(workerSource, { eval: true, workerData: { logFile } })
const { port } = await new Promise((resolve) => worker.once("message", resolve))
console.log("worker reported port", port)

const { createRequire } = await import("node:module")
const addon = createRequire(import.meta.url)(path.join(root, "out", `webview_napi-${process.platform}-${process.arch}.node`))

const handle = addon.create(true)
addon.setTitle(handle, "smoke test")
addon.setSize(handle, 700, 500)
addon.navigate(handle, `http://127.0.0.1:${port}`)
console.log("entering webview_run — main thread is now blocked")
addon.run(handle)
