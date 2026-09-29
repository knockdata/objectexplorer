// Files the OS asked the app to open, on Windows. open.h says what the page is given.
//
// Explorer's "Open with" starts the exe with the path as an argument, and src/main.js takes it
// from there: into this window on a cold start, or over to the window already running.
//
// WebView2 may only be called on the thread that made it, so a call from the server worker is
// posted to the window as WM_OPEN_FILES and handled in its window procedure. The two handlers
// WebView2 wants are hand-written COM objects, as in webview-windows.c.
#define _WIN32_WINNT 0x0A00
#define NTDDI_VERSION 0x0A000006
#define COBJMACROS
#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "WebView2.h"
#include "open.h"
#include "open-windows.h"

// files handed over before the page loaded; a cold start brings one batch, never many
#define WAITING_SIZE 16

typedef struct {
	CONST_VTBL struct ICoreWebView2NavigationCompletedEventHandlerVtbl *lpVtbl;
} NavigationHandler;

typedef struct {
	CONST_VTBL struct ICoreWebView2ExecuteScriptCompletedHandlerVtbl *lpVtbl;
} ScriptHandler;

static HWND openWindow;
static ICoreWebView2 *openView;
static int pageLoaded;
static char *waitingPaths[WAITING_SIZE];
static int waitingCount;
static NavigationHandler navigationHandler;
static ScriptHandler scriptHandler;

static void pushPaths(const char *paths) {
	const char *format = "(window.nativeOpenFiles=window.nativeOpenFiles||[]).push(...%s);window.dispatchEvent(new Event('native-open'))";
	size_t size = strlen(format) + strlen(paths) + 1;
	char *script = malloc(size);
	snprintf(script, size, format, paths);
	int count = MultiByteToWideChar(CP_UTF8, 0, script, -1, NULL, 0);
	wchar_t *wide = calloc(count, sizeof(wchar_t));
	MultiByteToWideChar(CP_UTF8, 0, script, -1, wide, count);
	ICoreWebView2_ExecuteScript(openView, wide, (ICoreWebView2ExecuteScriptCompletedHandler *)&scriptHandler);
	free(wide);
	free(script);
}

// The window may be minimised or behind another; a second launch allowed this process the
// foreground before it handed over (webviewAllowForeground), which is what makes this stick.
static void raiseWindow(void) {
	if (IsIconic(openWindow)) {
		ShowWindow(openWindow, SW_RESTORE);
	} else {
	}
	SetForegroundWindow(openWindow);
}

// the static handlers live as long as the process, so there is nothing to count
static ULONG STDMETHODCALLTYPE navigationAddRef(ICoreWebView2NavigationCompletedEventHandler *self) {
	(void)self;
	return 1;
}

static ULONG STDMETHODCALLTYPE navigationRelease(ICoreWebView2NavigationCompletedEventHandler *self) {
	(void)self;
	return 1;
}

static HRESULT STDMETHODCALLTYPE navigationQueryInterface(ICoreWebView2NavigationCompletedEventHandler *self, REFIID iid, void **result) {
	(void)iid;
	*result = self;
	return S_OK;
}

// the load event has fired, so the page's listener is there; a reload lands here with nothing waiting
static HRESULT STDMETHODCALLTYPE navigationInvoke(ICoreWebView2NavigationCompletedEventHandler *self, ICoreWebView2 *sender, ICoreWebView2NavigationCompletedEventArgs *args) {
	(void)self;
	(void)sender;
	(void)args;
	pageLoaded = 1;
	for (int i = 0; i < waitingCount; i++) {
		pushPaths(waitingPaths[i]);
		free(waitingPaths[i]);
	}
	waitingCount = 0;
	return S_OK;
}

static ULONG STDMETHODCALLTYPE scriptAddRef(ICoreWebView2ExecuteScriptCompletedHandler *self) {
	(void)self;
	return 1;
}

static ULONG STDMETHODCALLTYPE scriptRelease(ICoreWebView2ExecuteScriptCompletedHandler *self) {
	(void)self;
	return 1;
}

static HRESULT STDMETHODCALLTYPE scriptQueryInterface(ICoreWebView2ExecuteScriptCompletedHandler *self, REFIID iid, void **result) {
	(void)iid;
	*result = self;
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE scriptInvoke(ICoreWebView2ExecuteScriptCompletedHandler *self, HRESULT status, LPCWSTR result) {
	(void)self;
	(void)status;
	(void)result;
	return S_OK;
}

static const ICoreWebView2NavigationCompletedEventHandlerVtbl navigationVtbl = {
	navigationQueryInterface, navigationAddRef, navigationRelease, navigationInvoke
};

static const ICoreWebView2ExecuteScriptCompletedHandlerVtbl scriptVtbl = {
	scriptQueryInterface, scriptAddRef, scriptRelease, scriptInvoke
};

void openWindowsAttach(HWND window, ICoreWebView2 *view) {
	openWindow = window;
	openView = view;
	navigationHandler.lpVtbl = &navigationVtbl;
	scriptHandler.lpVtbl = &scriptVtbl;
	EventRegistrationToken token;
	ICoreWebView2_add_NavigationCompleted(view, (ICoreWebView2NavigationCompletedEventHandler *)&navigationHandler, &token);
}

// on the window's thread, from WM_OPEN_FILES; takes ownership of paths
void openWindowsDeliver(char *paths) {
	if (pageLoaded) {
		pushPaths(paths);
		free(paths);
	} else if (waitingCount < WAITING_SIZE) {
		waitingPaths[waitingCount] = paths;
		waitingCount++;
	} else {
		free(paths);
	}
	raiseWindow();
}

void webviewOpenFiles(const char *paths) {
	char *copy = _strdup(paths);
	if (openWindow && PostMessageW(openWindow, WM_OPEN_FILES, 0, (LPARAM)copy)) {
	} else {
		free(copy);
	}
}

void webviewAllowForeground(void) {
	AllowSetForegroundWindow(ASFW_ANY);
}
