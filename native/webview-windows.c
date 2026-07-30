// The Windows window: a plain Win32 window with a WebView2 control in it.
//
// WebView2 is COM, so the two completion handlers it wants are hand-written C objects — a
// vtable plus a pointer back to the Webview. COBJMACROS is what turns the header's C++ method
// calls into ICoreWebView2_Navigate(view, url) and friends.
//
// Environment and controller creation are asynchronous, so webviewCreate pumps messages until
// both have arrived. That keeps the contract in webview.h true on this platform too: by the
// time create returns non-NULL the window is ready, and a machine with no WebView2 runtime
// returns NULL rather than failing somewhere later.
//
// The version defines are Windows 10 1809: SetProcessDpiAwarenessContext and the
// per-monitor-v2 constant are both behind them, and without those the window is blurry on any
// scaled display.
#define _WIN32_WINNT 0x0A00
#define NTDDI_VERSION 0x0A000006
#define COBJMACROS
#include <windows.h>
#include <objbase.h>
#include <shlobj.h>
#include <stdlib.h>
#include "WebView2.h"
#include "webview.h"

#define READY_TIMEOUT 15000
#define CLASS_NAME L"ObjectExplorerWebview"

struct Webview {
	HWND window;
	ICoreWebView2Controller *controller;
	ICoreWebView2 *view;
	int debug;
	int failed;
};

typedef struct {
	CONST_VTBL struct ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandlerVtbl *lpVtbl;
	Webview *webview;
} EnvironmentHandler;

typedef struct {
	CONST_VTBL struct ICoreWebView2CreateCoreWebView2ControllerCompletedHandlerVtbl *lpVtbl;
	Webview *webview;
} ControllerHandler;

static EnvironmentHandler environmentHandler;
static ControllerHandler controllerHandler;

static wchar_t *toWide(const char *text) {
	int count = MultiByteToWideChar(CP_UTF8, 0, text, -1, NULL, 0);
	wchar_t *wide = calloc(count, sizeof(wchar_t));
	MultiByteToWideChar(CP_UTF8, 0, text, -1, wide, count);
	return wide;
}

// The handlers are static and live as long as the process, so reference counting has nothing to
// do, and the only caller is the loader asking for the interface it was just handed.
static ULONG STDMETHODCALLTYPE environmentAddRef(ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler *self) {
	(void)self;
	return 1;
}

static ULONG STDMETHODCALLTYPE environmentRelease(ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler *self) {
	(void)self;
	return 1;
}

static HRESULT STDMETHODCALLTYPE environmentQueryInterface(ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler *self, REFIID iid, void **result) {
	(void)iid;
	*result = self;
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE environmentInvoke(ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler *self, HRESULT status, ICoreWebView2Environment *environment) {
	Webview *webview = ((EnvironmentHandler *)self)->webview;

	if (SUCCEEDED(status) && environment) {
		ICoreWebView2Environment_CreateCoreWebView2Controller(environment, webview->window, (ICoreWebView2CreateCoreWebView2ControllerCompletedHandler *)&controllerHandler);
	} else {
		webview->failed = 1;
	}
	return S_OK;
}

static ULONG STDMETHODCALLTYPE controllerAddRef(ICoreWebView2CreateCoreWebView2ControllerCompletedHandler *self) {
	(void)self;
	return 1;
}

static ULONG STDMETHODCALLTYPE controllerRelease(ICoreWebView2CreateCoreWebView2ControllerCompletedHandler *self) {
	(void)self;
	return 1;
}

static HRESULT STDMETHODCALLTYPE controllerQueryInterface(ICoreWebView2CreateCoreWebView2ControllerCompletedHandler *self, REFIID iid, void **result) {
	(void)iid;
	*result = self;
	return S_OK;
}

static HRESULT STDMETHODCALLTYPE controllerInvoke(ICoreWebView2CreateCoreWebView2ControllerCompletedHandler *self, HRESULT status, ICoreWebView2Controller *controller) {
	Webview *webview = ((ControllerHandler *)self)->webview;

	if (SUCCEEDED(status) && controller) {
		ICoreWebView2Controller_AddRef(controller);
		webview->controller = controller;
		ICoreWebView2Controller_get_CoreWebView2(controller, &webview->view);

		ICoreWebView2Settings *settings = NULL;
		ICoreWebView2_get_Settings(webview->view, &settings);
		ICoreWebView2Settings_put_AreDevToolsEnabled(settings, webview->debug ? TRUE : FALSE);

		RECT bounds;
		GetClientRect(webview->window, &bounds);
		ICoreWebView2Controller_put_Bounds(controller, bounds);
		ICoreWebView2Controller_put_IsVisible(controller, TRUE);
	} else {
		webview->failed = 1;
	}
	return S_OK;
}

static const ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandlerVtbl environmentVtbl = {
	environmentQueryInterface, environmentAddRef, environmentRelease, environmentInvoke
};

static const ICoreWebView2CreateCoreWebView2ControllerCompletedHandlerVtbl controllerVtbl = {
	controllerQueryInterface, controllerAddRef, controllerRelease, controllerInvoke
};

static LRESULT CALLBACK windowProcedure(HWND window, UINT message, WPARAM wparam, LPARAM lparam) {
	Webview *webview = (Webview *)GetWindowLongPtrW(window, GWLP_USERDATA);

	if (message == WM_SIZE && webview && webview->controller) {
		RECT bounds;
		GetClientRect(window, &bounds);
		ICoreWebView2Controller_put_Bounds(webview->controller, bounds);
		return 0;
	} else if (message == WM_DESTROY) {
		PostQuitMessage(0);
		return 0;
	} else {
		return DefWindowProcW(window, message, wparam, lparam);
	}
}

static HWND createWindow(void) {
	WNDCLASSEXW windowClass = { 0 };
	windowClass.cbSize = sizeof(windowClass);
	windowClass.lpfnWndProc = windowProcedure;
	windowClass.hInstance = GetModuleHandleW(NULL);
	windowClass.hCursor = LoadCursorW(NULL, IDC_ARROW);
	windowClass.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
	windowClass.hIcon = LoadIconW(GetModuleHandleW(NULL), MAKEINTRESOURCEW(1));
	windowClass.lpszClassName = CLASS_NAME;
	RegisterClassExW(&windowClass);

	return CreateWindowExW(0, CLASS_NAME, L"", WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT, CW_USEDEFAULT, 800, 600,
		NULL, NULL, GetModuleHandleW(NULL), NULL);
}

// WebView2 keeps its cache and cookies here. The whole app already owns ~/.objectexplorer, so
// this stays inside it rather than inventing a second place.
static void userDataFolder(wchar_t *folder) {
	wchar_t home[MAX_PATH] = L"";
	GetEnvironmentVariableW(L"USERPROFILE", home, MAX_PATH);
	wsprintfW(folder, L"%s\\.objectexplorer\\webview2", home);
	SHCreateDirectoryExW(NULL, folder, NULL);
}

// Nothing arrives until messages are pumped, and MsgWaitForMultipleObjectsEx is what waits
// without spinning while still letting the COM apartment deliver its calls.
static void pumpUntilReady(Webview *webview) {
	ULONGLONG deadline = GetTickCount64() + READY_TIMEOUT;
	MSG message;

	while (webview->view == NULL && webview->failed == 0 && GetTickCount64() < deadline) {
		MsgWaitForMultipleObjectsEx(0, NULL, 100, QS_ALLINPUT, MWMO_ALERTABLE | MWMO_INPUTAVAILABLE);
		while (PeekMessageW(&message, NULL, 0, 0, PM_REMOVE)) {
			TranslateMessage(&message);
			DispatchMessageW(&message);
		}
	}
}

Webview *webviewCreate(int debug) {
	CoInitializeEx(NULL, COINIT_APARTMENTTHREADED);
	SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);

	Webview *webview = calloc(1, sizeof(Webview));
	webview->debug = debug;
	webview->window = createWindow();
	SetWindowLongPtrW(webview->window, GWLP_USERDATA, (LONG_PTR)webview);

	environmentHandler.lpVtbl = &environmentVtbl;
	environmentHandler.webview = webview;
	controllerHandler.lpVtbl = &controllerVtbl;
	controllerHandler.webview = webview;

	wchar_t folder[MAX_PATH];
	userDataFolder(folder);
	HRESULT started = CreateCoreWebView2EnvironmentWithOptions(NULL, folder, NULL,
		(ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler *)&environmentHandler);

	if (SUCCEEDED(started)) {
		pumpUntilReady(webview);
	} else {
		// no WebView2 runtime on this machine
		webview->failed = 1;
	}

	if (webview->view) {
	} else {
		DestroyWindow(webview->window);
		free(webview);
		webview = NULL;
	}
	return webview;
}

void webviewSetTitle(Webview *webview, const char *title) {
	wchar_t *wide = toWide(title);
	SetWindowTextW(webview->window, wide);
	free(wide);
}

void webviewSetSize(Webview *webview, int width, int height) {
	// the caller means the drawable area, so grow the request by whatever the frame costs
	RECT frame = { 0, 0, width, height };
	AdjustWindowRect(&frame, WS_OVERLAPPEDWINDOW, FALSE);
	SetWindowPos(webview->window, NULL, 0, 0, frame.right - frame.left, frame.bottom - frame.top,
		SWP_NOMOVE | SWP_NOZORDER);
}

void webviewNavigate(Webview *webview, const char *url) {
	wchar_t *wide = toWide(url);
	ICoreWebView2_Navigate(webview->view, wide);
	free(wide);
}

void webviewRun(Webview *webview) {
	ShowWindow(webview->window, SW_SHOW);
	SetForegroundWindow(webview->window);

	MSG message;
	while (GetMessageW(&message, NULL, 0, 0) > 0) {
		TranslateMessage(&message);
		DispatchMessageW(&message);
	}
}

void webviewDestroy(Webview *webview) {
	ICoreWebView2Controller_Close(webview->controller);
	ICoreWebView2Controller_Release(webview->controller);
	free(webview);
}
