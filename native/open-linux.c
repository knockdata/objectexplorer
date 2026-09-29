// Files the OS asked the app to open, on linux. open.h says what the page is given.
//
// A file manager's "Open With" starts the binary with the path as an argument. src/main.js takes
// it from there: into this window on a cold start, or over to the window already running.
//
// GTK is single-threaded, so a call from the server worker is queued with g_idle_add and runs on
// the thread in gtk_main. Everything is dlopen'd, as in webview-linux.c and drop-linux.c, and
// every symbol is optional: without one, opening a file does nothing and the window still works.
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "open.h"
#include "open-linux.h"
#include "applog.h"

// WEBKIT_LOAD_FINISHED in the WebKitLoadEvent enum
#define LOAD_FINISHED 3
// files handed over before the page loaded; a cold start brings one batch, never many
#define WAITING_SIZE 16

typedef void (*Callback)(void);

static void *openWindow;
static void *openView;
static int pageLoaded;
static char *waitingPaths[WAITING_SIZE];
static int waitingCount;

static unsigned int (*idleAdd)(int (*function)(void *data), void *data);
static void (*windowPresent)(void *window);
static void (*evaluateJavaScript)(void *view, const char *script, long length, const char *world, const char *sourceUri, void *cancellable, void *callback, void *userData);
static void (*runJavaScript)(void *view, const char *script, void *cancellable, void *callback, void *userData);

static void pushPaths(const char *paths) {
	const char *format = "(window.nativeOpenFiles=window.nativeOpenFiles||[]).push(...%s);window.dispatchEvent(new Event('native-open'))";
	size_t size = strlen(format) + strlen(paths) + 1;
	char *script = malloc(size);
	snprintf(script, size, format, paths);
	appLog("open: pushing %s", paths);
	if (evaluateJavaScript) {
		evaluateJavaScript(openView, script, -1, NULL, NULL, NULL, NULL, NULL);
	} else if (runJavaScript) {
		runJavaScript(openView, script, NULL, NULL, NULL);
	} else {
		appLog("open: this WebKitGTK has no way to run a script");
	}
	free(script);
}

// on the gtk_main thread; takes ownership of paths
static void deliverPaths(char *paths) {
	if (pageLoaded) {
		pushPaths(paths);
		free(paths);
	} else if (waitingCount < WAITING_SIZE) {
		appLog("open: page not loaded yet, holding %s", paths);
		waitingPaths[waitingCount] = paths;
		waitingCount++;
	} else {
		appLog("open: too many files waiting, dropped %s", paths);
		free(paths);
	}
	if (windowPresent) {
		windowPresent(openWindow);
	} else {
	}
}

// a GSourceFunc; 0 is G_SOURCE_REMOVE, so it runs once
static int deliverLater(void *data) {
	deliverPaths((char *)data);
	return 0;
}

static void loadChanged(void *view, int event, void *data) {
	(void)view;
	(void)data;
	if (event == LOAD_FINISHED) {
		pageLoaded = 1;
		for (int i = 0; i < waitingCount; i++) {
			pushPaths(waitingPaths[i]);
			free(waitingPaths[i]);
		}
		waitingCount = 0;
	} else {
	}
}

void openLinuxAttach(void *window, void *view, void *gtkLibrary, void *gobjectLibrary, void *webkitLibrary) {
	openWindow = window;
	openView = view;
	void *glibLibrary = dlopen("libglib-2.0.so.0", RTLD_LAZY | RTLD_GLOBAL);
	if (glibLibrary) {
		idleAdd = dlsym(glibLibrary, "g_idle_add");
	} else {
		appLog("open: no glib, files cannot be handed to the window");
	}
	windowPresent = dlsym(gtkLibrary, "gtk_window_present");
	evaluateJavaScript = dlsym(webkitLibrary, "webkit_web_view_evaluate_javascript");
	runJavaScript = dlsym(webkitLibrary, "webkit_web_view_run_javascript");
	unsigned long (*signalConnect)(void *instance, const char *signal, Callback handler, void *data, void *destroyData, int flags) = dlsym(gobjectLibrary, "g_signal_connect_data");
	if (signalConnect) {
		signalConnect(view, "load-changed", (Callback)loadChanged, NULL, NULL, 0);
	} else {
	}
}

void webviewOpenFiles(const char *paths) {
	if (idleAdd) {
		idleAdd(deliverLater, strdup(paths));
	} else {
		appLog("open: dropped %s, no g_idle_add", paths);
	}
}

void webviewAllowForeground(void) {
}
