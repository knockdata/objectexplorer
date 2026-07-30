// Opens a url in the machine's default browser.
//
// This is the escape hatch: `ObjectExplorer mode=browser`, and the automatic fallback when
// the native window cannot be created (no WebView2 runtime, no webkitgtk). The server half
// of the app has no native code in it at all, so this path works wherever node runs.
import { spawn } from "node:child_process"

export function openBrowser(url) {
	if (process.platform === "darwin") {
		spawn("open", [url], { stdio: "ignore", detached: true }).unref()
	} else if (process.platform === "win32") {
		spawn(process.env.COMSPEC || "cmd.exe", ["/c", "start", "", url], { stdio: "ignore", detached: true }).unref()
	} else {
		spawn("xdg-open", [url], { stdio: "ignore", detached: true }).unref()
	}
}
