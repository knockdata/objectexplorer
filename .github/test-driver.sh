#!/usr/bin/env bash
# Unpacks the app's own test driver into smoke/test, so smoke.sh can drive the built binary's UI
# with the same CDP client the package suite uses. The tarball comes from the candidate artifact
# this run is building — not from the network, so the driver always matches the package inside the
# binary.
#
#   bash .github/test-driver.sh <path to objectexplorer-test.tgz>
#
# A missing tarball is not fatal. smoke.sh then checks serving only and says so.
set -uo pipefail

tarball="${1:-}"

if [ -f "$tarball" ]; then
	mkdir -p smoke
	tar xzf "$tarball" -C smoke
	echo "test driver unpacked into smoke/test"
else
	echo "no test driver at '$tarball'; the smoke test will check serving only"
fi

bash "$(dirname "$0")/browser.sh"
