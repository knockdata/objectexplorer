// Files the OS asked the app to open: "Open with ObjectExplorer" on a file, or a file dropped on
// the Dock icon.
//
// Like the dragged folder in drop-mac.m, the paths go straight into the page and never back to
// Node. The page is handed them as
//
//   (window.nativeOpenFiles = window.nativeOpenFiles || []).push(...paths)
//   window.dispatchEvent(new Event("native-open"))
//
// and explorer/src/components/native-open.js takes it from there: the folder around each file
// becomes a hidden root on the server, and the file opens in a tab.
//
// Paths that arrive before the page has loaded wait here and go in once it has, which is how the
// file a cold start was launched on reaches a page that did not exist yet.
#ifndef OPEN_H
#define OPEN_H

// paths is a JSON array of absolute path strings. Safe from any thread — the server worker calls
// it when a second launch hands its files over. Also brings the window to the front.
void webviewOpenFiles(const char *paths);

// Windows only: a second launch owns the foreground, and the running window may only take it when
// this process says so before handing over. A no-op everywhere else.
void webviewAllowForeground(void);

#endif
