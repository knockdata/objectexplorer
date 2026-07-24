#!/bin/bash
# Stamp the installer version from the release tag, so v1.2.3 ships as 1.2.3.
set -e
cd "$(dirname "$0")/.."

version="${1#v}"
npm version "$version" --no-git-tag-version --allow-same-version
echo "Building version $version"
