#!/usr/bin/env bash
# Publishes the documentation site to https://docs.objectexplorer.com.
#
# The site is served by our own front door, not by GitHub Pages: rock2/server/main.js reads
# server/sites/ and gives every folder in it its own ACME certificate and static root, so
# "adding a domain" is nothing more than putting the built site in the folder named after it.
# DNS already points docs.objectexplorer.com at that host.
#
# rock2/deploy.sh rsyncs server/ without --delete, so a deploy from there leaves this folder
# alone — and this script never touches the rest of the host.
#
# The restart is what makes a new domain real: the vhost list and the certificates are read at
# start, so the very first run is when ACME issues the certificate for docs.objectexplorer.com.
# Asking for a restart on later runs costs a second and keeps one path for both cases.
#
#   ./docs.sh
set -euo pipefail

cd "$(dirname "$0")"

npm run docs:build

# --delete so a page that was removed from docs/ stops being served. It is safe because the
# path is one leaf folder, the site's own: nothing else on the host lives under it.
rsync -av --delete docs/.vitepress/dist/ node@explorer:/www/sites/docs.objectexplorer.com/

ssh explorer systemctl restart explorer

# A check straight after the restart races the server: the certificates, every vhost and the
# port 80 redirect all come up before it binds. Give each URL 30 seconds before calling it
# broken. The three URLs are the three ways this site is addressed — the root, a page, and a
# section index — and the last two are exactly what serveStatic resolves without an extension.
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

verify https://docs.objectexplorer.com/ "docs root"
verify https://docs.objectexplorer.com/reference/shortcuts "a page, addressed without .html"
verify https://docs.objectexplorer.com/formats/ "a section index"

echo "published to https://docs.objectexplorer.com"
