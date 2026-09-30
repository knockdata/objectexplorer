// What Explorer shows for a data file: its first rows as the thumbnail (medium and large icons) and
// in the preview pane (Alt+P). One COM class serves both, registered in the msix
// (scripts/fileTypes.mjs) under PREVIEW_CLSID as desktop2:ThumbnailHandler and
// desktop2:DesktopPreviewHandler. The picture comes from preview-windows-image.c.
//
// C with hand-written vtables, like the WebView2 handlers in webview-windows.c: one struct holds
// a pointer per interface, and each method finds the struct from the interface it was called on.
#define _WIN32_WINNT 0x0A00
#include "preview-windows.h"
#include <thumbcache.h>
#include <shobjidl.h>
#include <propsys.h>
#include <stddef.h>

// {6A1D3B1E-4F2A-4C8B-9E5D-0B7F3C2A9E41} — the same string is in scripts/fileTypes.mjs
static const CLSID PREVIEW_CLSID = { 0x6a1d3b1e, 0x4f2a, 0x4c8b, { 0x9e, 0x5d, 0x0b, 0x7f, 0x3c, 0x2a, 0x9e, 0x41 } };
#define VIEW_CLASS L"ObjectExplorerPreview"

HINSTANCE previewModule = NULL;
static LONG liveObjects = 0;
static LONG serverLocks = 0;

typedef struct {
	IThumbnailProvider thumbnail;
	IInitializeWithStream initialize;
	IPreviewHandler preview;
	IObjectWithSite site;
	IOleWindow window;
	LONG references;
	IStream *stream;
	wchar_t *name;
	IUnknown *siteObject;
	HWND parent;
	RECT bounds;
	HWND view;
	HBITMAP bitmap;
} Handler;

#define HANDLER(pointer, field) ((Handler *)((BYTE *)(pointer) - offsetof(Handler, field)))

static HRESULT queryHandler(Handler *handler, REFIID riid, void **out) {
	*out = NULL;
	if (IsEqualIID(riid, &IID_IUnknown) || IsEqualIID(riid, &IID_IThumbnailProvider)) {
		*out = &handler->thumbnail;
	} else if (IsEqualIID(riid, &IID_IInitializeWithStream)) {
		*out = &handler->initialize;
	} else if (IsEqualIID(riid, &IID_IPreviewHandler)) {
		*out = &handler->preview;
	} else if (IsEqualIID(riid, &IID_IObjectWithSite)) {
		*out = &handler->site;
	} else if (IsEqualIID(riid, &IID_IOleWindow)) {
		*out = &handler->window;
	} else {
	}
	if (*out != NULL) {
		InterlockedIncrement(&handler->references);
		return S_OK;
	} else {
		return E_NOINTERFACE;
	}
}

static void unloadPreview(Handler *handler) {
	if (handler->view) DestroyWindow(handler->view);
	if (handler->bitmap) DeleteObject(handler->bitmap);
	handler->view = NULL;
	handler->bitmap = NULL;
}

static ULONG releaseHandler(Handler *handler) {
	LONG left = InterlockedDecrement(&handler->references);
	if (left == 0) {
		unloadPreview(handler);
		if (handler->stream) IStream_Release(handler->stream);
		if (handler->siteObject) IUnknown_Release(handler->siteObject);
		CoTaskMemFree(handler->name);
		HeapFree(GetProcessHeap(), 0, handler);
		InterlockedDecrement(&liveObjects);
	} else {
	}
	return (ULONG)left;
}

// every interface's IUnknown, forwarded to the one object
#define UNKNOWN_METHODS(Interface, field) \
	static HRESULT STDMETHODCALLTYPE field##Query(Interface *self, REFIID riid, void **out) { return queryHandler(HANDLER(self, field), riid, out); } \
	static ULONG STDMETHODCALLTYPE field##AddRef(Interface *self) { return (ULONG)InterlockedIncrement(&HANDLER(self, field)->references); } \
	static ULONG STDMETHODCALLTYPE field##Release(Interface *self) { return releaseHandler(HANDLER(self, field)); }

UNKNOWN_METHODS(IThumbnailProvider, thumbnail)
UNKNOWN_METHODS(IInitializeWithStream, initialize)
UNKNOWN_METHODS(IPreviewHandler, preview)
UNKNOWN_METHODS(IObjectWithSite, site)
UNKNOWN_METHODS(IOleWindow, window)

// IInitializeWithStream: the file, as Explorer hands it over, and its name for the extension
static HRESULT STDMETHODCALLTYPE initializeWith(IInitializeWithStream *self, IStream *stream, DWORD mode) {
	Handler *handler = HANDLER(self, initialize);
	if (handler->stream == NULL) {
		STATSTG stat = { 0 };
		handler->stream = stream;
		IStream_AddRef(stream);
		if (SUCCEEDED(IStream_Stat(stream, &stat, STATFLAG_DEFAULT))) {
			handler->name = stat.pwcsName;
		} else {
		}
		return S_OK;
	} else {
		return HRESULT_FROM_WIN32(ERROR_ALREADY_INITIALIZED);
	}
}

// IThumbnailProvider: the table drawn `size` pixels tall
static HRESULT STDMETHODCALLTYPE thumbnailGet(IThumbnailProvider *self, UINT size, HBITMAP *bitmap, WTS_ALPHATYPE *alpha) {
	Handler *handler = HANDLER(self, thumbnail);
	*bitmap = handler->stream ? previewBitmap(handler->stream, handler->name, size) : NULL;
	*alpha = WTSAT_ARGB;
	return *bitmap != NULL ? S_OK : E_FAIL;
}

// the preview pane's own child window: the picture fitted in the middle on white
static LRESULT CALLBACK viewProc(HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam) {
	if (message == WM_PAINT) {
		Handler *handler = (Handler *)GetWindowLongPtrW(hwnd, GWLP_USERDATA);
		PAINTSTRUCT paint;
		HDC dc = BeginPaint(hwnd, &paint);
		RECT client;
		GetClientRect(hwnd, &client);
		FillRect(dc, &client, (HBRUSH)GetStockObject(WHITE_BRUSH));
		BITMAP info;
		if (handler && handler->bitmap && GetObjectW(handler->bitmap, sizeof info, &info)) {
			double scale = min((double)client.right / info.bmWidth, (double)client.bottom / info.bmHeight);
			int width = (int)(info.bmWidth * scale);
			int height = (int)(info.bmHeight * scale);
			HDC source = CreateCompatibleDC(dc);
			HGDIOBJ previous = SelectObject(source, handler->bitmap);
			SetStretchBltMode(dc, HALFTONE);
			StretchBlt(dc, (client.right - width) / 2, (client.bottom - height) / 2, width, height, source, 0, 0, info.bmWidth, info.bmHeight, SRCCOPY);
			SelectObject(source, previous);
			DeleteDC(source);
		} else {
		}
		EndPaint(hwnd, &paint);
		return 0;
	} else {
		return DefWindowProcW(hwnd, message, wparam, lparam);
	}
}

static HRESULT STDMETHODCALLTYPE previewSetWindow(IPreviewHandler *self, HWND parent, const RECT *bounds) {
	Handler *handler = HANDLER(self, preview);
	handler->parent = parent;
	handler->bounds = *bounds;
	if (handler->view) {
		SetParent(handler->view, parent);
		MoveWindow(handler->view, bounds->left, bounds->top, bounds->right - bounds->left, bounds->bottom - bounds->top, TRUE);
	} else {
	}
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE previewSetRect(IPreviewHandler *self, const RECT *bounds) {
	Handler *handler = HANDLER(self, preview);
	handler->bounds = *bounds;
	if (handler->view) {
		MoveWindow(handler->view, bounds->left, bounds->top, bounds->right - bounds->left, bounds->bottom - bounds->top, TRUE);
	} else {
	}
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE previewDo(IPreviewHandler *self) {
	Handler *handler = HANDLER(self, preview);
	WNDCLASSW windowClass = { 0 };
	windowClass.lpfnWndProc = viewProc;
	windowClass.hInstance = previewModule;
	windowClass.lpszClassName = VIEW_CLASS;
	windowClass.hCursor = LoadCursor(NULL, IDC_ARROW);
	RegisterClassW(&windowClass);
	unloadPreview(handler);
	UINT height = (UINT)max(256, handler->bounds.bottom - handler->bounds.top);
	handler->bitmap = handler->stream ? previewBitmap(handler->stream, handler->name, min(height, 2048)) : NULL;
	if (handler->bitmap) {
		RECT *bounds = &handler->bounds;
		handler->view = CreateWindowExW(0, VIEW_CLASS, L"", WS_CHILD | WS_VISIBLE, bounds->left, bounds->top,
			bounds->right - bounds->left, bounds->bottom - bounds->top, handler->parent, NULL, previewModule, NULL);
		SetWindowLongPtrW(handler->view, GWLP_USERDATA, (LONG_PTR)handler);
		return handler->view ? S_OK : E_FAIL;
	} else {
		return E_FAIL;
	}
}

static HRESULT STDMETHODCALLTYPE previewUnload(IPreviewHandler *self) {
	unloadPreview(HANDLER(self, preview));
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE previewSetFocus(IPreviewHandler *self) {
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE previewQueryFocus(IPreviewHandler *self, HWND *focused) {
	*focused = GetFocus();
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE previewTranslate(IPreviewHandler *self, MSG *message) {
	return S_FALSE;
}

// IObjectWithSite: the preview frame keeps a pointer to itself here
static HRESULT STDMETHODCALLTYPE siteSet(IObjectWithSite *self, IUnknown *site) {
	Handler *handler = HANDLER(self, site);
	if (handler->siteObject) IUnknown_Release(handler->siteObject);
	handler->siteObject = site;
	if (site) IUnknown_AddRef(site);
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE siteGet(IObjectWithSite *self, REFIID riid, void **out) {
	Handler *handler = HANDLER(self, site);
	*out = NULL;
	return handler->siteObject ? IUnknown_QueryInterface(handler->siteObject, riid, out) : E_FAIL;
}

static HRESULT STDMETHODCALLTYPE windowGet(IOleWindow *self, HWND *hwnd) {
	*hwnd = HANDLER(self, window)->parent;
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE windowHelp(IOleWindow *self, BOOL enter) {
	return E_NOTIMPL;
}

static IThumbnailProviderVtbl thumbnailVtbl = { thumbnailQuery, thumbnailAddRef, thumbnailRelease, thumbnailGet };
static IInitializeWithStreamVtbl initializeVtbl = { initializeQuery, initializeAddRef, initializeRelease, initializeWith };
static IPreviewHandlerVtbl previewVtbl = { previewQuery, previewAddRef, previewRelease, previewSetWindow, previewSetRect,
	previewDo, previewUnload, previewSetFocus, previewQueryFocus, previewTranslate };
static IObjectWithSiteVtbl siteVtbl = { siteQuery, siteAddRef, siteRelease, siteSet, siteGet };
static IOleWindowVtbl windowVtbl = { windowQuery, windowAddRef, windowRelease, windowGet, windowHelp };

// the class factory: one static object, counted only by LockServer
static HRESULT STDMETHODCALLTYPE factoryQuery(IClassFactory *self, REFIID riid, void **out) {
	*out = (IsEqualIID(riid, &IID_IUnknown) || IsEqualIID(riid, &IID_IClassFactory)) ? self : NULL;
	return *out ? S_OK : E_NOINTERFACE;
}
static ULONG STDMETHODCALLTYPE factoryAddRef(IClassFactory *self) { return 2; }
static ULONG STDMETHODCALLTYPE factoryRelease(IClassFactory *self) { return 1; }

static HRESULT STDMETHODCALLTYPE factoryCreate(IClassFactory *self, IUnknown *outer, REFIID riid, void **out) {
	Handler *handler = outer == NULL ? HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, sizeof(Handler)) : NULL;
	*out = NULL;
	if (handler) {
		handler->thumbnail.lpVtbl = &thumbnailVtbl;
		handler->initialize.lpVtbl = &initializeVtbl;
		handler->preview.lpVtbl = &previewVtbl;
		handler->site.lpVtbl = &siteVtbl;
		handler->window.lpVtbl = &windowVtbl;
		handler->references = 1;
		InterlockedIncrement(&liveObjects);
		HRESULT result = queryHandler(handler, riid, out);
		releaseHandler(handler);
		return result;
	} else {
		return outer ? CLASS_E_NOAGGREGATION : E_OUTOFMEMORY;
	}
}

static HRESULT STDMETHODCALLTYPE factoryLock(IClassFactory *self, BOOL lock) {
	if (lock) InterlockedIncrement(&serverLocks); else InterlockedDecrement(&serverLocks);
	return S_OK;
}

static IClassFactoryVtbl factoryVtbl = { factoryQuery, factoryAddRef, factoryRelease, factoryCreate, factoryLock };
static IClassFactory factory = { &factoryVtbl };

STDAPI DllGetClassObject(REFCLSID clsid, REFIID riid, void **out) {
	*out = NULL;
	return IsEqualCLSID(clsid, &PREVIEW_CLSID) ? factoryQuery(&factory, riid, out) : CLASS_E_CLASSNOTAVAILABLE;
}

STDAPI DllCanUnloadNow(void) {
	return liveObjects == 0 && serverLocks == 0 ? S_OK : S_FALSE;
}

BOOL WINAPI DllMain(HINSTANCE instance, DWORD reason, void *reserved) {
	if (reason == DLL_PROCESS_ATTACH) {
		previewModule = instance;
		DisableThreadLibraryCalls(instance);
	} else {
	}
	return TRUE;
}
