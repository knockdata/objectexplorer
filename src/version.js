// esbuild replaces VERSION, BUNDLE_VERSION, FFMPEG_VERSION, DUCKDB_VERSION and SQLITE_VERSION
// with string literals at build time (scripts/sea.mjs). Running the sources straight from node
// leaves them
// undeclared, and `typeof` on an undeclared identifier is the one way to read it without throwing.
export const version = typeof VERSION === "string" ? VERSION : "dev"
export const bundleVersion = typeof BUNDLE_VERSION === "string" ? BUNDLE_VERSION : "dev"
export const ffmpegVersion = typeof FFMPEG_VERSION === "string" ? FFMPEG_VERSION : "dev"
export const duckdbVersion = typeof DUCKDB_VERSION === "string" ? DUCKDB_VERSION : "dev"
export const sqliteVersion = typeof SQLITE_VERSION === "string" ? SQLITE_VERSION : "dev"
