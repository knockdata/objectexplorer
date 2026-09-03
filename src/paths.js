// One folder holds everything the product owns — the log, folders.json, provider caches, the
// extracted app bundles, the extracted native addon. It is the same folder the objectexplorer
// CLI uses, so the binary and `npx objectexplorer` share folders and favourites.
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

export const userData = path.join(os.homedir(), ".objectexplorer")
export const appDir = path.join(userData, ".app")
export const binDir = path.join(userData, ".bin")
// the same file server/src/logger.js writes, so the launcher and the server it starts share one log
export const logFile = path.join(userData, "app.log")
// main.js debounces Windows' install-time double launch against this file's mtime, and
// VersionManager clears it so a restart is not taken for one
export const launchGuardFile = path.join(userData, "objectexplorer.last-launch")

fs.mkdirSync(appDir, { recursive: true })
fs.mkdirSync(binDir, { recursive: true })
