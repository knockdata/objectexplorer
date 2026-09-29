// "Open with": a second launch hands its files to the window already open (src/openFiles.js).
//
//   npm test
//
// HOME points at a fresh folder before the module loads, so objectexplorer.running.json and
// app.log are written there and never over a real install's.
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"

const home = fs.mkdtempSync(path.join(os.tmpdir(), "objectexplorer-open-"))
process.env.HOME = home
process.env.USERPROFILE = home
const { filesFromArgs, handOver, newToken, writeRunning, clearRunning, listenForOpen } = await import("../src/openFiles.js")
const { runningFile } = await import("../src/paths.js")

test("the running file lives under this test's HOME", function () {
	assert.ok(runningFile.startsWith(home), runningFile)
})

test("only arguments that are files on disk are files to open", function () {
	const file = path.join(home, "sales=2026.csv")
	fs.writeFileSync(file, "region,amount\n")
	const found = filesFromArgs(["port=9421", "mode=browser", file, home, path.join(home, "missing.csv")])
	assert.deepEqual(found, [path.resolve(file)])
})

test("a second launch hands its files to the running window", async function () {
	const token = newToken()
	const received = []
	const { port, server } = await listenForOpen(paths => received.push(...paths), token)
	writeRunning(port, token)
	try {
		const taken = await handOver(["/data/a.parquet", "C:\\data\\b.csv"])
		assert.equal(taken, true)
		assert.deepEqual(received, ["/data/a.parquet", "C:\\data\\b.csv"])
	} finally {
		clearRunning()
		server.close()
	}
	assert.equal(fs.existsSync(runningFile), false)
})

test("a request without the token is refused and opens nothing", async function () {
	const received = []
	const { port, server } = await listenForOpen(paths => received.push(...paths), newToken())
	try {
		const response = await fetch(`http://127.0.0.1:${port}/open`, { method: "POST", body: JSON.stringify(["/etc/hosts"]) })
		assert.equal(response.status, 403)
		assert.deepEqual(received, [])
	} finally {
		server.close()
	}
})

test("a running file left by a crash is not a window: the launch opens its own", async function () {
	const { port, server } = await listenForOpen(() => {}, newToken())
	server.close()
	writeRunning(port, newToken())
	try {
		assert.equal(await handOver(["/data/a.parquet"]), false)
	} finally {
		clearRunning()
	}
})

test("the running file is readable by this user only", { skip: process.platform === "win32" }, function () {
	writeRunning(1, newToken())
	try {
		assert.equal(fs.statSync(runningFile).mode & 0o077, 0)
	} finally {
		clearRunning()
	}
})
