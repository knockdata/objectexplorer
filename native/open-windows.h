// Hands the window and its WebView2 to open-windows.c, and the message a worker thread posts to
// reach it. webview-windows.c routes WM_OPEN_FILES to openWindowsDeliver.
#ifndef OPEN_WINDOWS_H
#define OPEN_WINDOWS_H

#include <windows.h>
#include "WebView2.h"

#define WM_OPEN_FILES (WM_APP + 1)

void openWindowsAttach(HWND window, ICoreWebView2 *view);
void openWindowsDeliver(char *paths);

#endif
