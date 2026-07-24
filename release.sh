#!/usr/bin/env bash
# Tags the version already in package.json and pushes the tag, which is what
# .github/workflows/release.yml waits for. Bump the version and commit it yourself first.
#
# Retagging is the normal way to retry: a run that failed published nothing, so the same version
# gets deleted and pushed again rather than burning a version number per attempt.
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

# A previous attempt left the tag behind, locally and on the remote. Deleting the remote one
# first is what makes the re-push count as a new tag push and start a new run.
if [ -n "$(git tag -l "$tag")" ]; then
	git tag -d "$tag"
fi

if [ -n "$(git ls-remote --tags origin "refs/tags/$tag")" ]; then
	echo "deleting the old $tag"
	git push origin ":refs/tags/$tag"
fi

# Only a run that got all the way through publishes a release, so there is normally none to
# clean up. If one is there anyway, it holds the old assets and has to go.
if gh release view "$tag" >/dev/null 2>&1; then
	echo "deleting the old release $tag"
	gh release delete "$tag" --yes
fi

previous=$(gh run list --workflow release.yml -L 1 --json databaseId --jq '.[0].databaseId // ""')

git tag "$tag"
git push origin "refs/tags/$tag"

# The run does not exist the instant the tag lands, so poll until one shows up that is not the
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
