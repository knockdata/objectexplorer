// The browser half of smoke.sh: drives the running binary's own UI in a real headless browser.
//
//   node .github/smoke-browser.mjs <test dir> <url>
//
// <test dir> is the unpacked objectexplorer-test tarball — the same driver the package's end to end
// suite uses, so there is one CDP client in the world and not two. Nothing here is specific to a
// machine's roots: it opens whatever the first root in the tree is, which is what makes it run
// identically on every runner.
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

// Defaults match what .github/smoke.sh and the release workflow always pass
// (smoke.sh's own $port, and "smoke/test" at .github/workflows/release.yml:399), so this
// also runs standalone against an already-running packaged binary — `node
// .github/smoke-browser.mjs` from the repo root, nothing else needed.
const [testDir = "smoke/test", url = "http://127.0.0.1:9421"] = process.argv.slice(2)

if (!fs.existsSync(path.join(testDir, "browser.js"))) {
	console.error(`smoke-browser: no test driver at "${testDir}" (run .github/test-driver.sh <objectexplorer-test.tgz> first, or pass the unpacked test dir as the first argument)`)
	process.exit(1)
}

const driver = (name) => import(pathToFileURL(path.resolve(testDir, name)).href)

const { launch, openPage, screenshot, wait } = await driver("browser.js")
const { $click, $waitFor, $dblclickUntil, $all } = await driver("dom.js")

let browser
let socket

try {
	const meta = await (await fetch(`${url}/api/meta`)).json()
	if (meta.appMode === "desktop") {
		console.log(`smoke: /api/meta says appMode=${meta.appMode}, ${(meta.providers || []).length} providers`)
	}
	else {
		throw new Error(`smoke: expected appMode "desktop", got "${meta.appMode}"`)
	}

	// A query naming a folder root, which is the one thing only this server can resolve: duckdb's
	// objectfs extension has to call back into it over localhost to turn `demo/…` into a real path.
	//
	// That channel is the reason this check exists. The backend runs in a worker thread here and nowhere
	// else — not under `npx objectexplorer`, not in dev — and a worker that cannot publish the callback
	// address into the environment leaves duckdb resolving every folder root against the process working
	// directory instead. v0.4.4 shipped exactly that: delta, iceberg and every hive parquet folder in the
	// desktop app answered "No files found that match the pattern" for files that were plainly there,
	// while the same build under npx read them all. The package suite runs on the main thread and can
	// never see it, so it is caught here or not at all.
	const query = "SELECT * FROM 'demo/nl_train_stations.parquet' LIMIT 1"
	const answer = await (await fetch(`${url}/api/duckdb/query`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ sql: query }),
	})).json()
	if (answer.payload && answer.payload.rows.length === 1) {
		console.log(`smoke: duckdb answered ${query} with ${answer.payload.columns.length} columns`)
	}
	else {
		throw new Error(`smoke: duckdb could not resolve a folder root — ${query} answered ${JSON.stringify(answer)}`)
	}

	browser = await launch()
	console.log(`smoke: driving ${browser.browserPath}`)
	socket = await openPage(url)
	await wait(1500)

	await $waitFor(socket, `document.querySelectorAll('[id^="tree-"]').length > 0`, "a root in the tree")
	const roots = await $all(socket, '[id^="tree-"]', "id")
	await $click(socket, roots[0])
	await $waitFor(socket, `document.querySelectorAll(".object-row").length > 0`, `a listing under ${roots[0]}`)

	const names = await $all(socket, ".object-row", "data-name")
	const file = names.find((name) => /\.[a-z0-9]+$/i.test(name))
	if (file) {
		await $dblclickUntil(socket, `object-${file}`, `document.querySelectorAll(".object-row").length === 0 && (document.getElementById("side-content-0") || {}).textContent.trim().length > 0`, `the viewer to render ${file}`)
		console.log(`smoke: ${roots[0]} listed ${names.length} entries and rendered ${file}`)
	}
	else {
		throw new Error(`smoke: ${roots[0]} has no file to open, only ${names.join(", ")}`)
	}

	await screenshot(socket, path.join(testDir, "smoke.png"))
	browser.stop()
	process.exit(0)
}
catch (err) {
	// A screenshot only ever happened on the success path, so a CI failure used to upload
	// nothing visual — the whole point of driving a real browser was to see what broke.
	if (socket) {
		await screenshot(socket, path.join(testDir, "smoke-fail.png")).catch(() => {})
	}
	console.error(`smoke-browser: ${err.message}`)
	if (browser) {
		browser.stop()
	}
	process.exit(1)
}
