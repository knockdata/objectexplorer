#!/usr/bin/env bash
# Rebuilds and re-releases the desktop binaries for the version already on npm.
#
# This is the second door. The first one is rock2/objectexplorer/publish.sh, which ships a new
# version: it uploads a candidate, and the workflow tests it, builds the binaries, publishes npm and
# cuts the release. Use this one when only the binaries need to be rebuilt — the npm package is
# untouched and nothing is published to it.
#
# The version is not this repo's to choose: it is whatever @knockdata/objectexplorer says is latest,
# because that is what the binaries will embed. package.json's version is a placeholder that CI
# overwrites.
#
# A dispatch, not a tag push: pushing v<version> is how publish.sh ships a new version, and doing it
# from here would tell CI to publish a package that is already on npm. The dispatch says the opposite
# — take the version off npm, rebuild the binaries around it, publish nothing.
#
#   ./release.sh
set -euo pipefail

cd "$(dirname "$0")"

version=$(npm view @knockdata/objectexplorer version)
tag="v$version"

echo "rebuilding the binaries for $tag"

# The release for this version already exists — this is a version that shipped. It holds the old
# assets, and the run replaces it rather than adding to it.
if gh release view "$tag" >/dev/null 2>&1; then
	echo "deleting the old release $tag"
	gh release delete "$tag" --yes
fi

previous=$(gh run list --workflow release.yml -L 1 --json databaseId --jq '.[0].databaseId // ""')

gh workflow run release.yml -f version="$version"

# The run does not exist the instant the dispatch lands, so poll until one shows up that is not the
# run from the previous attempt.
run=""
for attempt in 1 2 3 4 5 6 7 8 9 10; do
	if [ -z "$run" ]; then
		sleep 3
		latest=$(gh run list --workflow release.yml -L 1 --json databaseId --jq '.[0].databaseId // ""')
		if [ -n "$latest" ] && [ "$latest" != "$previous" ]; then
			run="$latest"
		fi
	fi
done

if [ -n "$run" ]; then
	# watch can drop on a network blip, so the verdict comes from a second call, not from its
	# exit code. --exit-status is no good here either: it returns 0 for a cancelled run.
	gh run watch "$run" --exit-status || true
	conclusion=$(gh run view "$run" --json conclusion --jq '.conclusion')
	if [ "$conclusion" = "success" ]; then
		echo "$tag released"
	else
		echo "$tag did not release: $conclusion" >&2
		exit 1
	fi
else
	echo "no run picked up $tag yet; check with: gh run list"
fi
