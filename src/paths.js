// One folder holds everything the product owns — the log, folders.json, provider caches, the
// extracted app bundles, the extracted native addon. It is the same folder the objectexplorer
// CLI uses, so the binary and `npx objectexplorer` share folders and favourites.
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

export const userData = path.join(os.homedir(), ".objectexplorer")
export const appDir = path.join(userData, ".app")
export const binDir = path.join(userData, ".bin")
export const logFile = path.join(userData, "one.log")

fs.mkdirSync(appDir, { recursive: true })
fs.mkdirSync(binDir, { recursive: true })
