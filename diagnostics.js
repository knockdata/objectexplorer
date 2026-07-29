// The blank-window fallback.
//
// When startup fails there is nothing on screen and, on a packaged Windows build, no
// DevTools and no console — the window just stays white. This builds a self-contained
// page describing what went wrong and loads it into the window instead, so the failure is
// readable on the machine that hit it and copyable off it in one click.
import fs from "node:fs";

// keep the tail small enough for a data: URL and for a clipboard paste
const logTailLines = 120;

function readLogTail(logPath) {
	try {
		const content = fs.readFileSync(logPath, "utf8");
		return content.split("\n").slice(-logTailLines).join("\n");
	} catch (error) {
		return `could not read ${logPath}: ${error.message}`;
	}
}

function exists(filePath) {
	if (filePath) {
		return fs.existsSync(filePath) ? "yes" : "NO";
	} else {
		return "unset";
	}
}

function escapeHtml(text) {
	return String(text)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

// the whole report as plain text: what the page shows, what the copy button copies, and
// what gets written to the log
export function diagnosticsText(details) {
	const { error, logPath, packageDir, bundleDir, appDir, webServerPath, indexHtmlPath, mode } = details;
	const lines = [
		`ObjectExplorer failed to start`,
		``,
		`error       : ${error ? `${error.message}` : "no url to load"}`,
		`stack       : ${error && error.stack ? error.stack : "(none)"}`,
		``,
		`mode        : ${mode}`,
		`platform    : ${process.platform} ${process.arch}`,
		`electron    : ${process.versions.electron}  node: ${process.versions.node}  chrome: ${process.versions.chrome}`,
		`log file    : ${logPath}`,
		`exe         : ${process.execPath}`,
		`cwd         : ${process.cwd()}`,
		`argv        : ${JSON.stringify(process.argv)}`,
		``,
		`packageDir  : ${packageDir}`,
		`bundleDir   : ${bundleDir}`,
		`appDir      : ${appDir}`,
		`WebServer.mjs exists : ${exists(webServerPath)}  (${webServerPath})`,
		`index.html exists    : ${exists(indexHtmlPath)}  (${indexHtmlPath})`,
		``,
		`--- last ${logTailLines} lines of app.log ---`,
		readLogTail(logPath),
	];
	return lines.join("\n");
}

// a data: url so the page needs no server — the server is exactly what failed
export function diagnosticsUrl(details) {
	const report = diagnosticsText(details);
	const html = `<!doctype html>
<meta charset="utf-8">
<title>ObjectExplorer — startup failed</title>
<style>
	:root { color-scheme: dark; background: #1f1f1f; color: #f8f8f2; }
	body { font: 13px/1.5 ui-monospace, Consolas, monospace; margin: 0; padding: 24px; }
	h1 { color: #f92672; font-size: 18px; margin: 0 0 4px; }
	p { color: #75715e; margin: 0 0 16px; }
	button { background: #66d9ef; border: 0; border-radius: 4px; color: #1f1f1f; cursor: pointer;
		font: inherit; font-weight: bold; margin-bottom: 16px; padding: 8px 16px; }
	pre { background: #272822; border: 1px solid #3e3d32; border-radius: 4px; margin: 0;
		overflow-x: auto; padding: 16px; white-space: pre-wrap; word-break: break-word; }
</style>
<h1>ObjectExplorer failed to start</h1>
<p>Copy this report and send it along with the log file above.</p>
<button id="copy">Copy diagnostics</button>
<pre id="report">${escapeHtml(report)}</pre>
<script>
	document.getElementById("copy").addEventListener("click", function () {
		navigator.clipboard.writeText(document.getElementById("report").textContent);
		document.getElementById("copy").textContent = "Copied";
	});
</script>`;
	return "data:text/html;charset=utf-8," + encodeURIComponent(html);
}
