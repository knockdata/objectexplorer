#!/usr/bin/env bash
# Every page of the published site opened in headless Chrome, and what is wrong with it reported:
# dead links (and #anchors no page has), videos and YouTube films that cannot play, and pages that
# show an error (console errors, exceptions, failed requests, the not-found page). test/site.mjs
# says how each is found.
#
#   ./test.sh                              https://objectexplorer.com/
#   ./test.sh http://localhost:5173/       the local VitePress (npm run docs:dev), or staging
#   EXTERNAL=0 ./test.sh                   links to other sites left out
#   TABS=8 PLAY_SECONDS=20 ./test.sh       pages opened at once (4); the seconds a video may take to start (10)
#
# The report: build/test/report.txt, one line an issue grouped by kind; the exit code is 1 when there is any.
# docs.sh runs it after publishing (TEST=0 skips it).
set -euo pipefail

cd "$(dirname "$0")"

node test/site.mjs "${1:-https://objectexplorer.com/}"
