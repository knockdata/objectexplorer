// Loads a native addon that ships inside the SEA.
//
// A SEA cannot dlopen an embedded asset, so the .node is written to ~/.objectexplorer/.bin
// once and loaded from there. That is also why the reference binding's `bindings` package is
// gone: it searches build/Release folders that do not exist next to a single binary.
//
// Assets are named <name>-<platform>-<arch>.node. A build embeds only its own platform's
// addon, but the pattern means adding a second addon later is one more line in sea.mjs.
import fs from "node:fs"
import path from "node:path"
import { binDir } from "./paths.js"
import { log } from "./log.js"
import { version } from "./version.js"

export function loadAddon(name, readAsset) {
	const assetName = `${name}-${process.platform}-${process.arch}.node`
	const target = path.join(binDir, `${name}-${version}-${process.arch}.node`)

	if (fs.existsSync(target)) {
		log("addon already extracted:", target)
	} else {
		fs.writeFileSync(target, Buffer.from(readAsset(assetName)))
		log("addon extracted:", target)
	}

	const holder = { exports: {} }
	process.dlopen(holder, target)
	return holder.exports
}
