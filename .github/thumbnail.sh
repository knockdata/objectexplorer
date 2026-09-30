#!/usr/bin/env bash
# Runs the packed binary's `cli thumbnail` the way a file manager's thumbnailer does: a parquet
# must come back as a PNG, and a file it cannot preview must exit 1 so the icon is shown instead.
#
#   bash .github/thumbnail.sh <path to the binary>
set -euo pipefail

binary="$1"
out="$(mktemp -d)"
fixture="$(cd "$(dirname "$0")/.." && pwd)/test/fixture/stations.parquet"

"$binary" cli thumbnail "$fixture" "$out/stations.png" 256
signature="$(head -c 8 "$out/stations.png" | od -An -tx1 | tr -d ' \n')"
if [ "$signature" = "89504e470d0a1a0a" ]; then
	echo "thumbnail: $(wc -c < "$out/stations.png") byte png"
else
	echo "thumbnail: not a png ($signature)" >&2
	exit 1
fi

# Windows: the thumbnail handler DLL, loaded and asked the way Explorer asks it. It runs the exe
# named ObjectExplorer.exe beside itself, which is how the msix lays the two out.
root="$(cd "$(dirname "$0")/.." && pwd)"
dll="$(ls "$root"/out/ObjectExplorerPreview-win32-*.dll 2> /dev/null | head -1 || true)"
# Best effort until the handler has shipped once: a failure is a warning on the run, not a stop.
if [ -n "$dll" ] && [ -f "$root/out/preview-windows-test.exe" ]; then
	cp "$binary" "$out/ObjectExplorer.exe"
	cp "$dll" "$out/ObjectExplorerPreview.dll"
	"$root/out/preview-windows-test.exe" "$(cygpath -w "$out/ObjectExplorerPreview.dll")" "$(cygpath -w "$fixture")" \
		|| echo "::warning::the windows thumbnail handler gave no bitmap"
else
	echo "thumbnail: no windows handler dll here"
fi

if "$binary" cli thumbnail "$0" "$out/none.png" 256; then
	echo "thumbnail: a shell script got a thumbnail, it should have been refused" >&2
	exit 1
else
	echo "thumbnail: an unsupported file is refused"
fi
