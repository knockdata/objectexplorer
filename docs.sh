#!/usr/bin/env bash
# Publishes the site to https://objectexplorer.com — the landing page and the documentation, which
# are one VitePress site now. The old nano landing in rock2/sites/explorer is retired: this build
# is what the apex serves.
#
# The front door in rock2/server serves sites/<domain>/ as that domain's static root, and answers
# /app, /api and the source maps from mountApp BEFORE it ever reaches these files — so publishing
# the site here cannot take the app down.
#
#   ./docs.sh
set -euo pipefail

cd "$(dirname "$0")"

npm run docs:build

# --delete, so a page removed from docs/ stops being served and the retired landing's index.js and
# index.css do not linger next to the new home page. Every exclusion is anchored with a leading '/'
# because an unanchored one matches at every depth: `--exclude='app/'` would also swallow any
# folder named app inside the built site. These are the host's, not the site's:
#   app/ maps/ WebServer.mjs   the product, installed from npm and mounted at /app
#   releases/                  the OTA feed the desktop app polls — deleting it breaks updates
#   download/ build/           installers and build leftovers that predate this site
rsync -av --delete \
	--exclude='/app/' --exclude='/maps/' --exclude='/WebServer.mjs' \
	--exclude='/releases/' --exclude='/download/' --exclude='/build/' \
	docs/.vitepress/dist/ node@explorer:/www/sites/objectexplorer.com/

# The vhost and its certificate already exist for this domain, so no restart is needed to serve
# the new files — serveStatic reads them from disk on every request.

# A URL is the only honest check, and it is worth retrying: a request can lose the race with a
# restart happening for other reasons. Four shapes, because each exercises a different rule —
# the root, a page without .html, a section index, and the app the front door mounts.
function verify {
	local url=$1
	local what=$2
	local tries=0
	local ok=false
	while [ $tries -lt 15 ] && [ "$ok" = false ]; do
		if curl -sf "$url" >/dev/null; then
			ok=true
		else
			tries=$((tries + 1))
			sleep 2
		fi
	done
	if [ "$ok" = true ]; then
		echo "  ✓ $what"
	else
		echo "  ✗ $what — $url did not answer in 30s" >&2
		exit 1
	fi
}

verify https://objectexplorer.com/ "the home page"
verify https://objectexplorer.com/reference/shortcuts "a page, addressed without .html"
verify https://objectexplorer.com/formats/ "a section index"
verify https://objectexplorer.com/app/ "the app, still mounted at /app"

echo "published to https://objectexplorer.com"
