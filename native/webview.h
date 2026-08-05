// The native window, one contract with three implementations:
//
//   webview-mac.m       Cocoa + WKWebView
//   webview-linux.c     GTK3 + WebKitGTK, reached with dlopen
//   webview-windows.c   Win32 + WebView2
//
// There is no error code anywhere. The one failure a caller can act on is "this machine has no
// webview", and webviewCreate says that by returning NULL — src/main.js turns it into an alert
// and exits. Everything after a successful create is a call that cannot fail.
//
// Eight calls, nothing more. The explorer UI talks to the Node backend over HTTP on localhost,
// so there is no JS bridge to build: no bind, no eval, no init, no dispatch.
#ifndef WEBVIEW_H
#define WEBVIEW_H

typedef struct Webview Webview;

// NULL when the platform webview is unavailable
Webview *webviewCreate(int debug);
void webviewSetTitle(Webview *webview, const char *title);
// the title bar icon, as png bytes. Windows ignores it: its title bar takes the icon from the
// exe resource that scripts/win-resources.mjs writes.
void webviewSetIcon(Webview *webview, const unsigned char *png, int length);
void webviewSetSize(Webview *webview, int width, int height);
void webviewNavigate(Webview *webview, const char *url);
// blocks until the window closes
void webviewRun(Webview *webview);
void webviewDestroy(Webview *webview);
// A message the user has to see when there is no window to put it in: the machine has no webview,
// so the app is about to exit and stdout goes nowhere in a packaged build. Needs no Webview.
void webviewAlert(const char *title, const char *text);

#endif
