#!/usr/bin/env bash
# Tags a version and pushes it, which is what .github/workflows/release.yml waits for.
#
#   ./release.sh          patch bump from package.json  0.3.0 -> 0.3.1
#   ./release.sh 0.4.0    explicit version
#   ./release.sh v0.4.0   leading v is fine
set -euo pipefail

cd "$(dirname "$0")"

if [ $# -gt 0 ]; then
	version="${1#v}"
else
	version=$(node -e '
		const fs = require("fs")
		const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
		const part = pkg.version.split(".")
		part[2] = Number(part[2]) + 1
		console.log(part.join("."))
	')
fi

tag="v$version"

if [ -z "$(git status --porcelain)" ]; then
	echo "releasing $tag"
else
	echo "working tree is dirty; commit or stash first" >&2
	git status --short >&2
	exit 1
fi

if [ -z "$(git tag -l "$tag")" ]; then
	bash .github/set-version.sh "$version"
else
	echo "$tag already exists" >&2
	exit 1
fi

git add -A
git commit -m "release $tag"
# refs/heads/main, not main: a tag of the same name makes plain "main" ambiguous and git
# refuses the push. One such tag exists because a workflow run named a release after the branch.
git push origin refs/heads/main:refs/heads/main

git tag "$tag"
git push origin "refs/tags/$tag"

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
