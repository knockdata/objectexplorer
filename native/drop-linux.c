// Reading a dragged folder's real path on linux. The mac file next to this one explains what the
// page is handed and why; this is the same answer through GTK3 and WebKitGTK.
//
// WebKitGTK asks for the drag data itself — it has to, because it must fill the page's
// DataTransfer before it can send a DOM drag event — so the data arrives on the view's
// "drag-data-received" signal. A handler connected here runs before WebKit's own class handler,
// which puts the paths in the page ahead of anything the page is told about the drag.
//
// Everything is dlopen'd, exactly as webview-linux.c does it: no -dev package to build against,
// no DT_NEEDED on webkit in the shipped .node, and a missing symbol turns the feature off
// instead of taking the window down with it.
//
// One window per process, so the resolved functions are file statics. Attaching twice would
// simply overwrite them with the same answers.
#include <dlfcn.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include "drop-linux.h"

// long enough for a drag of a few dozen folders; a bigger drag sends what fits
#define SCRIPT_SIZE 8192

typedef void (*Callback)(void);

static void *dropView;
static char **(*selectionGetUris)(void *selection);
static char *(*filenameFromUri)(const char *uri, char **hostname, void **error);
static void (*freeMemory)(void *memory);
static void (*freeStringList)(char **list);
static void (*evaluateJavaScript)(void *view, const char *script, long length, const char *world, const char *sourceUri, void *cancellable, void *callback, void *userData);
static void (*runJavaScript)(void *view, const char *script, void *cancellable, void *callback, void *userData);

// never touches an ok flag: every symbol here is optional, and the caller checks the one thing
// that matters, which is whether there is a way to reach the page at all
static void *symbol(void *library, const char *name) {
	return dlsym(library, name);
}

// A percent-encoded uri is made only of these, and every character that would end the JS string
// literal early is escaped into them. One that holds anything else is not sent.
static int safeUri(const char *uri) {
	static const char *allowed = "-._~:/?#[]@!$&'()*+,;=%";
	int safe = 1;
	for (const char *at = uri; *at; at++) {
		char one = *at;
		int ordinary = (one >= 'A' && one <= 'Z') || (one >= 'a' && one <= 'z') || (one >= '0' && one <= '9');
		if (ordinary || strchr(allowed, one)) {
		} else {
			safe = 0;
		}
	}
	return safe;
}

static int isFolder(const char *uri) {
	int folder = 0;
	char *path = filenameFromUri(uri, NULL, NULL);
	if (path) {
		struct stat entry;
		folder = stat(path, &entry) == 0 && S_ISDIR(entry.st_mode);
		freeMemory(path);
	} else {
		// a uri that is not a local file
	}
	return folder;
}

static void pushScript(const char *script) {
	if (evaluateJavaScript) {
		evaluateJavaScript(dropView, script, -1, NULL, NULL, NULL, NULL, NULL);
	} else {
		runJavaScript(dropView, script, NULL, NULL, NULL);
	}
}

static void pushFolders(char **uris) {
	char script[SCRIPT_SIZE];
	int written = snprintf(script, SCRIPT_SIZE, "window.nativeDragFolders={time:Date.now(),uris:[");
	int count = 0;
	for (int index = 0; uris[index]; index++) {
		const char *uri = uris[index];
		int room = written + (int)strlen(uri) + 4 < SCRIPT_SIZE;
		if (room && safeUri(uri) && isFolder(uri)) {
			written += snprintf(script + written, SCRIPT_SIZE - written, count > 0 ? ",\"%s\"" : "\"%s\"", uri);
			count = count + 1;
		} else {
		}
	}
	if (count > 0) {
		snprintf(script + written, SCRIPT_SIZE - written, "]}");
		pushScript(script);
	} else {
		// a drag of files only: the page already has those
	}
}

// the GTK3 signature of "drag-data-received"; only the selection is read
static void onDragDataReceived(void *widget, void *context, int x, int y, void *selection, unsigned int info, unsigned int time, void *userData) {
	(void)widget;
	(void)context;
	(void)x;
	(void)y;
	(void)info;
	(void)time;
	(void)userData;

	char **uris = selectionGetUris(selection);
	if (uris) {
		pushFolders(uris);
		freeStringList(uris);
	} else {
		// the drag carries something that is not a list of files
	}
}

void dropLinuxAttach(void *view, void *gtkLibrary, void *gobjectLibrary, void *webkitLibrary) {
	unsigned long (*signalConnect)(void *instance, const char *signal, Callback handler, void *data, void *destroyData, int flags);

	dropView = view;
	selectionGetUris = symbol(gtkLibrary, "gtk_selection_data_get_uris");
	// dlsym on a handle searches its dependencies too, and gobject pulls in glib
	filenameFromUri = symbol(gobjectLibrary, "g_filename_from_uri");
	freeMemory = symbol(gobjectLibrary, "g_free");
	freeStringList = symbol(gobjectLibrary, "g_strfreev");
	signalConnect = symbol(gobjectLibrary, "g_signal_connect_data");
	// 2.40 and later; run_javascript is the deprecated one that both 4.0 and 4.1 still have
	evaluateJavaScript = symbol(webkitLibrary, "webkit_web_view_evaluate_javascript");
	runJavaScript = symbol(webkitLibrary, "webkit_web_view_run_javascript");

	int ready = selectionGetUris && filenameFromUri && freeMemory && freeStringList && signalConnect
		&& (evaluateJavaScript || runJavaScript);
	if (ready) {
		signalConnect(view, "drag-data-received", (Callback)onDragDataReceived, NULL, NULL, 0);
	} else {
		// this webkit cannot be asked; the window is fine and a dropped folder does nothing
		dropView = NULL;
	}
}
