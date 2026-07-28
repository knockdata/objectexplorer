#!/usr/bin/env bash
# Generate the Microsoft Store tile assets in build/appx/ from build/icon.png.
# Run once on macOS (uses sips) and commit the result — the Windows CI runner has no sips,
# and electron-builder silently substitutes Microsoft's placeholder tiles for anything missing.
set -euo pipefail

cd "$(dirname "$0")/.."

source="build/icon.png"
outDir="build/appx"
# same colour as the window background in main.js, so padded tiles blend with the app
padColor="1F1F1F"

mkdir -p "$outDir"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# square tiles: plain resize
square() {
	local size="$1"
	local name="$2"
	sips -s format png -z "$size" "$size" "$source" --out "$outDir/$name" >/dev/null
	echo "$name ${size}x${size}"
}

# wide tiles: resize to the tile height, then pad out to the full width
wide() {
	local height="$1"
	local width="$2"
	local name="$3"
	sips -s format png -z "$height" "$height" "$source" --out "$work/$name" >/dev/null
	sips -p "$height" "$width" --padColor "$padColor" "$work/$name" --out "$outDir/$name" >/dev/null
	echo "$name ${width}x${height}"
}

square 50 StoreLogo.png
square 44 Square44x44Logo.png
square 150 Square150x150Logo.png
square 71 SmallTile.png
square 310 LargeTile.png
wide 150 310 Wide310x150Logo.png
wide 300 620 SplashScreen.png
