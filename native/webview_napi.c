// N-API binding for the native window, written in plain C.
//
// Two headers, no node-addon-api, no bindings package: the SEA loads this file with
// process.dlopen, so nothing may go looking for a build folder at runtime.
//
// Six calls, one per function in webview.h. Only create can fail, and it fails by returning
// NULL — see that file.
//
// webviewRun blocks the calling thread until the window closes. That is the whole reason the
// HTTP server lives in a worker thread — see src/main.js.
#include <node_api.h>
#include "webview.h"

// window titles and localhost urls; nothing here is ever close to this long
#define TEXT_SIZE 2048

static Webview *readHandle(napi_env env, napi_value value) {
	void *handle = NULL;
	napi_get_value_external(env, value, &handle);
	return (Webview *)handle;
}

static void readText(napi_env env, napi_value value, char *text) {
	size_t written = 0;
	text[0] = '\0';
	napi_get_value_string_utf8(env, value, text, TEXT_SIZE, &written);
}

static int readNumber(napi_env env, napi_value value) {
	int32_t number = 0;
	napi_get_value_int32(env, value, &number);
	return number;
}

static napi_value create(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	bool debug = false;
	napi_get_value_bool(env, args[0], &debug);

	napi_value result = NULL;
	Webview *webview = webviewCreate(debug ? 1 : 0);
	if (webview) {
		napi_create_external(env, webview, NULL, NULL, &result);
	} else {
		napi_throw_error(env, NULL, "the platform webview is unavailable");
	}
	return result;
}

static napi_value setTitle(napi_env env, napi_callback_info info) {
	size_t count = 2;
	napi_value args[2];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	char title[TEXT_SIZE];
	readText(env, args[1], title);
	webviewSetTitle(readHandle(env, args[0]), title);
	return NULL;
}

static napi_value setSize(napi_env env, napi_callback_info info) {
	size_t count = 3;
	napi_value args[3];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	int width = readNumber(env, args[1]);
	int height = readNumber(env, args[2]);
	webviewSetSize(readHandle(env, args[0]), width, height);
	return NULL;
}

static napi_value navigate(napi_env env, napi_callback_info info) {
	size_t count = 2;
	napi_value args[2];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	char url[TEXT_SIZE];
	readText(env, args[1], url);
	webviewNavigate(readHandle(env, args[0]), url);
	return NULL;
}

// blocks until the window closes
static napi_value run(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	webviewRun(readHandle(env, args[0]));
	return NULL;
}

static napi_value destroy(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	webviewDestroy(readHandle(env, args[0]));
	return NULL;
}

static void addFunction(napi_env env, napi_value exports, const char *name, napi_callback callback) {
	napi_value function = NULL;
	napi_create_function(env, name, NAPI_AUTO_LENGTH, callback, NULL, &function);
	napi_set_named_property(env, exports, name, function);
}

NAPI_MODULE_INIT() {
	addFunction(env, exports, "create", create);
	addFunction(env, exports, "setTitle", setTitle);
	addFunction(env, exports, "setSize", setSize);
	addFunction(env, exports, "navigate", navigate);
	addFunction(env, exports, "run", run);
	addFunction(env, exports, "destroy", destroy);
	return exports;
}
