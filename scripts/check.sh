#!/bin/bash
# check.sh — every check that the site says what the product does, in one run: links, formats, plan
# numbers, app folder paths, settings paths, the words the site leaves out, the newest release notes.
# Each check prints what is wrong; this ends with 1 when any of them found something.
#
#   scripts/check.sh <foldone>      e.g. scripts/check.sh ~/git/foldone
#
# <foldone> is the product's source, which the formats, the plan numbers, the folder layout and the
# settings labels, and the list of what the site leaves out, are read from.
here="$(cd "$(dirname "$0")" && pwd)"
foldone="$1"
if [ -n "$foldone" ] && [ -d "$foldone/service" ]; then
	failed=0
	run() {
		uv run --no-project python "$@" || failed=1
	}
	run "$here/check_links.py"
	run "$here/check_formats.py" "$foldone"
	run "$here/check_plans.py" "$foldone/service/plan/features.js"
	run "$here/check_app_folder.py" "$foldone/service/app_folder.js"
	run "$here/check_settings.py" "$foldone/explorer/ui/settings"
	run "$here/check_words.py" "$foldone/tools/site_left_out.txt"
	run "$here/check_changelog.py" "$here/../CHANGELOG.md"
	exit $failed
else
	echo "usage: scripts/check.sh <foldone>   (the product's source, with service/ in it)"
	exit 2
fi
