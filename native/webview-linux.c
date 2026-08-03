// The Linux window: GTK3 + WebKitGTK, reached entirely with dlopen.
//
// Nothing here is linked or included from GTK. The build needs no -dev package, the shipped
// .node has no DT_NEEDED on webkit, and a machine without WebKitGTK installed still loads the
// addon — webviewCreate just returns NULL and src/main.js opens a browser instead. Linking it
// the ordinary way makes that machine fail to load the addon at all.
//
// The handles are void *: GtkWidget, GtkWindow and WebKitWebView are opaque pointers, and this
// file never looks inside one.
#include <dlfcn.h>
#include <stdlib.h>
#include "webview.h"

// gtk_window_new(GTK_WINDOW_TOPLEVEL)
#define TOPLEVEL 0

typedef void (*Callback)(void);

struct Webview {
	void *gtkLibrary;
	void *gobjectLibrary;
	void *webkitLibrary;

	int (*initCheck)(int *argc, char ***argv);
	void *(*windowNew)(int type);
	void (*windowSetTitle)(void *window, const char *title);
	void (*windowSetDefaultSize)(void *window, int width, int height);
	void (*containerAdd)(void *container, void *child);
	void (*widgetShowAll)(void *widget);
	void (*mainLoop)(void);
	void (*mainQuit)(void);
	unsigned long (*signalConnect)(void *instance, const char *signal, Callback handler, void *data, void *destroyData, int flags);
	void *(*viewNew)(void);
	void (*viewLoadUri)(void *view, const char *uri);
	void *(*viewGetSettings)(void *view);
	void (*settingsSetDeveloperExtras)(void *settings, int enabled);

	void *pixbufLibrary;
	void (*windowSetIcon)(void *window, void *pixbuf);
	void *(*loaderNew)(void);
	int (*loaderWrite)(void *loader, const unsigned char *data, unsigned long count, void **error);
	int (*loaderClose)(void *loader, void **error);
	void *(*loaderGetPixbuf)(void *loader);

	void *window;
	void *view;
};

// clears ok on the first symbol that is missing, so the caller checks once at the end
static void *symbol(void *library, const char *name, int *ok) {
	void *found = dlsym(library, name);
	if (found) {
	} else {
		*ok = 0;
	}
	return found;
}

// 4.1 is the current WebKitGTK for GTK3; 4.0 is what older distributions still ship
static void *openWebkit(void) {
	void *library = dlopen("libwebkit2gtk-4.1.so.0", RTLD_LAZY | RTLD_GLOBAL);
	if (library) {
	} else {
		library = dlopen("libwebkit2gtk-4.0.so.0", RTLD_LAZY | RTLD_GLOBAL);
	}
	return library;
}

// The icon is the one optional part: a machine without gdk-pixbuf still gets a window, it just
// keeps the generic icon. That is why these symbols never touch the caller's ok flag.
static void loadIconSymbols(Webview *webview) {
	int ok = 1;
	webview->pixbufLibrary = dlopen("libgdk_pixbuf-2.0.so.0", RTLD_LAZY | RTLD_GLOBAL);
	if (webview->pixbufLibrary) {
		webview->windowSetIcon = symbol(webview->gtkLibrary, "gtk_window_set_icon", &ok);
		webview->loaderNew = symbol(webview->pixbufLibrary, "gdk_pixbuf_loader_new", &ok);
		webview->loaderWrite = symbol(webview->pixbufLibrary, "gdk_pixbuf_loader_write", &ok);
		webview->loaderClose = symbol(webview->pixbufLibrary, "gdk_pixbuf_loader_close", &ok);
		webview->loaderGetPixbuf = symbol(webview->pixbufLibrary, "gdk_pixbuf_loader_get_pixbuf", &ok);
	} else {
		ok = 0;
	}
	if (ok) {
	} else {
		// one missing symbol is the whole feature missing; webviewSetIcon checks this one
		webview->windowSetIcon = NULL;
	}
}

static void loadSymbols(Webview *webview, int *ok) {
	void *gtk = webview->gtkLibrary;
	void *gobject = webview->gobjectLibrary;
	void *webkit = webview->webkitLibrary;

	webview->initCheck = symbol(gtk, "gtk_init_check", ok);
	webview->windowNew = symbol(gtk, "gtk_window_new", ok);
	webview->windowSetTitle = symbol(gtk, "gtk_window_set_title", ok);
	webview->windowSetDefaultSize = symbol(gtk, "gtk_window_set_default_size", ok);
	webview->containerAdd = symbol(gtk, "gtk_container_add", ok);
	webview->widgetShowAll = symbol(gtk, "gtk_widget_show_all", ok);
	webview->mainLoop = symbol(gtk, "gtk_main", ok);
	webview->mainQuit = symbol(gtk, "gtk_main_quit", ok);
	webview->signalConnect = symbol(gobject, "g_signal_connect_data", ok);
	webview->viewNew = symbol(webkit, "webkit_web_view_new", ok);
	webview->viewLoadUri = symbol(webkit, "webkit_web_view_load_uri", ok);
	webview->viewGetSettings = symbol(webkit, "webkit_web_view_get_settings", ok);
	webview->settingsSetDeveloperExtras = symbol(webkit, "webkit_settings_set_enable_developer_extras", ok);
	loadIconSymbols(webview);
}

static void buildWindow(Webview *webview, int debug) {
	webview->window = webview->windowNew(TOPLEVEL);
	webview->view = webview->viewNew();
	webview->containerAdd(webview->window, webview->view);
	// closing the window ends the run loop, which is what unblocks the calling thread
	webview->signalConnect(webview->window, "destroy", (Callback)webview->mainQuit, NULL, NULL, 0);

	if (debug) {
		webview->settingsSetDeveloperExtras(webview->viewGetSettings(webview->view), 1);
	} else {
	}
}

static void closeLibraries(Webview *webview) {
	if (webview->pixbufLibrary) {
		dlclose(webview->pixbufLibrary);
	} else {
	}
	if (webview->webkitLibrary) {
		dlclose(webview->webkitLibrary);
	} else {
	}
	if (webview->gobjectLibrary) {
		dlclose(webview->gobjectLibrary);
	} else {
	}
	if (webview->gtkLibrary) {
		dlclose(webview->gtkLibrary);
	} else {
	}
}

Webview *webviewCreate(int debug) {
	Webview *webview = calloc(1, sizeof(Webview));
	webview->gtkLibrary = dlopen("libgtk-3.so.0", RTLD_LAZY | RTLD_GLOBAL);
	webview->gobjectLibrary = dlopen("libgobject-2.0.so.0", RTLD_LAZY | RTLD_GLOBAL);
	webview->webkitLibrary = openWebkit();

	int ok = 1;
	if (webview->gtkLibrary && webview->gobjectLibrary && webview->webkitLibrary) {
		loadSymbols(webview, &ok);
	} else {
		ok = 0;
	}

	// gtk_init_check is the one that says whether there is a display to draw on; over ssh with
	// no X11 or Wayland it returns false, and that is a browser fallback rather than a crash
	if (ok && webview->initCheck(NULL, NULL)) {
		buildWindow(webview, debug);
	} else {
		ok = 0;
	}

	if (ok) {
	} else {
		// nothing was initialised on this path, so unloading is safe here and only here
		closeLibraries(webview);
		free(webview);
		webview = NULL;
	}
	return webview;
}

void webviewSetTitle(Webview *webview, const char *title) {
	webview->windowSetTitle(webview->window, title);
}

// The loader keeps the only reference to the pixbuf, and both live as long as the window does,
// so there is nothing to unref here.
void webviewSetIcon(Webview *webview, const unsigned char *png, int length) {
	if (webview->windowSetIcon) {
		void *loader = webview->loaderNew();
		webview->loaderWrite(loader, png, (unsigned long)length, NULL);
		webview->loaderClose(loader, NULL);
		void *pixbuf = webview->loaderGetPixbuf(loader);
		if (pixbuf) {
			webview->windowSetIcon(webview->window, pixbuf);
		} else {
		}
	} else {
	}
}

// the window is not shown until webviewRun, so the default size is the size it opens at
void webviewSetSize(Webview *webview, int width, int height) {
	webview->windowSetDefaultSize(webview->window, width, height);
}

void webviewNavigate(Webview *webview, const char *url) {
	webview->viewLoadUri(webview->view, url);
}

void webviewRun(Webview *webview) {
	webview->widgetShowAll(webview->window);
	webview->mainLoop();
}

// The window is already gone by the time the run loop returns, and dlclosing GTK after it has
// registered types is a known way to crash on exit. Only the struct is ours to release.
void webviewDestroy(Webview *webview) {
	free(webview);
}
