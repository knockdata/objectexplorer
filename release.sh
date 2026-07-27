#!/usr/bin/env bash
# Tag the current commit with the version in package.json and push it,
# which triggers .github/workflows/release.yml
set -euo pipefail

cd "$(dirname "$0")"

version=$(node -p "require('./package.json').version")
tag="v$version"

if [ -n "$(git status --porcelain)" ]; then
	echo "working tree is dirty, commit or stash first"
	exit 1
else
	if git rev-parse "$tag" >/dev/null 2>&1; then
		echo "tag $tag already exists"
		exit 1
	else
		git tag "$tag"
		git push origin "$tag"
		echo "pushed $tag"
	fi
fi
