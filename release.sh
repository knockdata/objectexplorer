#!/usr/bin/env bash
# Tags the version already in package.json and pushes the tag, which is what
# .github/workflows/release.yml waits for. Bump the version and commit it yourself first.
#
#   ./release.sh
set -euo pipefail

cd "$(dirname "$0")"

version=$(node -p 'require("./package.json").version')
tag="v$version"

if [ -z "$(git status --porcelain)" ]; then
	echo "releasing $tag"
else
	echo "working tree is dirty; commit or stash first" >&2
	git status --short >&2
	exit 1
fi

if [ -z "$(git tag -l "$tag")" ]; then
	git tag "$tag"
	git push origin "refs/tags/$tag"
else
	echo "$tag already exists" >&2
	exit 1
fi

# The run does not exist the instant the tag lands, so poll for its id.
run=""
for attempt in 1 2 3 4 5; do
	if [ -z "$run" ]; then
		sleep 3
		run=$(gh run list --workflow release.yml -L 1 --json databaseId --jq '.[0].databaseId // ""')
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
