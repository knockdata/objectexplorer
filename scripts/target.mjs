// The platform and arch the build produces, which is the host unless TARGET_PLATFORM /
// TARGET_ARCH say otherwise:
//
//   TARGET_PLATFORM=win32 TARGET_ARCH=x64 npm run build
//
// win32 and linux can be built from any host — the node binary is downloaded per target, and
// postject, resedit and tar all run everywhere. darwin can only be built on darwin, because
// codesign, hdiutil and notarytool have no substitute.
//
// The native addon is the part that usually cannot cross-build: the backends call Cocoa,
// WebKitGTK or WebView2, so each needs its own platform's compiler and SDK. macOS is the
// exception — one Xcode targets both arm64 and x86_64 — which is how the Intel mac is built on
// an Apple Silicon runner. Any other cross build needs out/webview_napi-<platform>-<arch>.node
// to already be there; see scripts/addon.mjs.
export const targetPlatform = process.env.TARGET_PLATFORM || process.platform
export const targetArch = process.env.TARGET_ARCH || process.arch
export const isCrossBuild = targetPlatform !== process.platform || targetArch !== process.arch
export const canCompileAddon = targetPlatform === process.platform && (targetArch === process.arch || process.platform === "darwin")
