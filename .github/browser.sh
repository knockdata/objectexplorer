#!/usr/bin/env bash
# Makes sure a browser the CDP driver can use exists. Google ships no arm64 Chrome for linux, and
# an AppImage build runner has no browser of its own; macOS and windows runners already carry
# Chrome or Edge, and test/browser.js finds whichever is there.
set -uo pipefail

if [ "$(uname -s)" = "Linux" ]; then
	if [ -x /usr/bin/google-chrome ]; then
		echo "google-chrome is installed"
	else
		sudo apt-get update
		sudo apt-get install -y chromium-browser || sudo snap install chromium
	fi
else
	echo "$(uname -s) ships a browser"
fi
