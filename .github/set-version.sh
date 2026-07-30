#!/usr/bin/env bash
# Stamps the tag into package.json before a build. "v1.2.3" and "1.2.3" both work.
set -euo pipefail

version="${1#v}"
node -e '
	const fs = require("fs")
	const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
	pkg.version = process.argv[1]
	fs.writeFileSync("package.json", JSON.stringify(pkg, null, "\t") + "\n")
	console.log("version:", pkg.version)
' "$version"
