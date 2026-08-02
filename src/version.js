// esbuild replaces VERSION, BUNDLE_VERSION and FFMPEG_VERSION with string literals at build
// time (scripts/sea.mjs). Running the sources straight from node leaves them undeclared, and
// `typeof` on an undeclared identifier is the one way to read it without throwing.
export const version = typeof VERSION === "string" ? VERSION : "dev"
export const bundleVersion = typeof BUNDLE_VERSION === "string" ? BUNDLE_VERSION : "dev"
export const ffmpegVersion = typeof FFMPEG_VERSION === "string" ? FFMPEG_VERSION : "dev"
