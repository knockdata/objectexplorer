#!/usr/bin/env bash
# Makes sure a browser the CDP driver can use exists. Google ships no arm64 Chrome for linux, and
# an AppImage build runner has no browser of its own; macOS and windows runners already carry
# Chrome or Edge, and test/browser.js finds whichever is there.
#
# Linux without Chrome gets Playwright's chromium, linked to /usr/bin/chromium where browser.js
# looks. Not apt: on ubuntu 24.04 chromium-browser is a stub that installs the snap, and the snap
# store download (snapd, core22, mesa, gtk themes) took ten minutes or timed out the job.
set -uo pipefail

if [ "$(uname -s)" = "Linux" ]; then
	if [ -x /usr/bin/google-chrome ]; then
		echo "google-chrome is installed"
	else
		for attempt in 1 2 3; do
			if npx -y playwright install --with-deps chromium; then
				break
			else
				echo "playwright install failed, attempt $attempt"
				sleep 10
			fi
		done
		chromium="$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome | head -1)"
		if [ -x "$chromium" ]; then
			sudo ln -sf "$chromium" /usr/bin/chromium
			echo "chromium is $chromium"
		else
			echo "no chromium after playwright install"
			exit 1
		fi
	fi
else
	echo "$(uname -s) ships a browser"
fi
