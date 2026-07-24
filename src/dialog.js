// The OS-native "choose folder" dialog, handed to the backend as its openFolder callback so
// clicking "add folder" in the UI can reach any folder on the machine.
//
// Copied from @knockdata/objectexplorer's cli.js: three one-shot subprocesses, no native
// code. It runs inside the server worker, which is fine — spawning does not touch the main
// thread that webview_run is blocking.
import { execFile } from "node:child_process"

export function openFolder() {
	return new Promise(function (resolve) {
		if (process.platform === "darwin") {
			const script = 'POSIX path of (choose folder with prompt "Add a folder" default location (path to home folder))'
			execFile("osascript", ["-e", script], function (error, stdout) {
				resolve(pick(error, stdout))
			})
		} else if (process.platform === "win32") {
			const script = 'Add-Type -AssemblyName System.Windows.Forms; $dialog = New-Object System.Windows.Forms.FolderBrowserDialog; if ($dialog.ShowDialog() -eq "OK") { $dialog.SelectedPath }'
			execFile("powershell", ["-NoProfile", "-Command", script], function (error, stdout) {
				resolve(pick(error, stdout))
			})
		} else {
			execFile("zenity", ["--file-selection", "--directory", "--title=Add a folder"], function (error, stdout) {
				resolve(pick(error, stdout))
			})
		}
	})
}

// a cancelled dialog exits non-zero, which reads the same as no folder chosen
function pick(error, stdout) {
	if (error) {
		return undefined
	} else {
		return stdout.trim() || undefined
	}
}
