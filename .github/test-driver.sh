#!/usr/bin/env bash
# Downloads the app's own test driver — the objectexplorer-test tarball uploaded beside the package
# candidate — into smoke/test, so smoke.sh can drive the built binary's UI with the same CDP client
# the package suite uses. On linux it also makes sure a browser exists: Google ships no arm64 Chrome
# for linux, and an AppImage runner has no browser of its own.
#
# A missing tarball is not fatal. smoke.sh then checks serving only and says so.
set -uo pipefail

url=https://objectexplorer.com/releases/objectexplorer-test.tgz

if curl -fsSL -o objectexplorer-test.tgz "$url"; then
	mkdir -p smoke
	tar xzf objectexplorer-test.tgz -C smoke
	echo "test driver unpacked into smoke/test"
else
	echo "no test driver at $url; the smoke test will check serving only"
fi

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
