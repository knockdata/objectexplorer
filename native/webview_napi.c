// N-API binding for webview (https://github.com/webview/webview), written in plain C.
// Only two headers, no node-addon-api, no bindings package: the SEA loads this file with
// process.dlopen, so nothing may go looking for a build folder at runtime.
//
// Seven calls, nothing more. The explorer UI talks to the Node backend over HTTP on
// localhost, so webview's JS bridge (bind / eval / init / dispatch / unbind) is never used
// and is not wrapped. reference/webview-nodejs wraps all of it with SWIG in 2603 lines.
//
// webview_run blocks the calling thread until the window closes. That is the whole reason
// the HTTP server lives in a worker thread — see src/main.js.
#include <node_api.h>
#include <webview.h>
#include <stdio.h>

// window titles and localhost urls; nothing here is ever close to this long
#define TEXT_SIZE 2048

static webview_t readHandle(napi_env env, napi_value value) {
	void *handle = NULL;
	napi_get_value_external(env, value, &handle);
	return (webview_t)handle;
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

// every webview call but create returns webview_error_t, 0 meaning ok
static napi_value checkError(napi_env env, webview_error_t error, const char *call) {
	if (error == WEBVIEW_ERROR_OK) {
	} else {
		char message[TEXT_SIZE];
		snprintf(message, sizeof(message), "%s failed with error %d", call, (int)error);
		napi_throw_error(env, NULL, message);
	}
	return NULL;
}

static napi_value create(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	bool debug = false;
	napi_get_value_bool(env, args[0], &debug);

	napi_value result = NULL;
	webview_t handle = webview_create(debug ? 1 : 0, NULL);
	if (handle) {
		napi_create_external(env, handle, NULL, NULL, &result);
	} else {
		// no error code available here: create is the one call that returns the handle itself
		napi_throw_error(env, NULL, "webview_create failed, the platform webview is unavailable");
	}
	return result;
}

static napi_value setTitle(napi_env env, napi_callback_info info) {
	size_t count = 2;
	napi_value args[2];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	char title[TEXT_SIZE];
	readText(env, args[1], title);
	return checkError(env, webview_set_title(readHandle(env, args[0]), title), "webview_set_title");
}

static napi_value setSize(napi_env env, napi_callback_info info) {
	size_t count = 3;
	napi_value args[3];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	int width = readNumber(env, args[1]);
	int height = readNumber(env, args[2]);
	webview_error_t error = webview_set_size(readHandle(env, args[0]), width, height, WEBVIEW_HINT_NONE);
	return checkError(env, error, "webview_set_size");
}

static napi_value navigate(napi_env env, napi_callback_info info) {
	size_t count = 2;
	napi_value args[2];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	char url[TEXT_SIZE];
	readText(env, args[1], url);
	return checkError(env, webview_navigate(readHandle(env, args[0]), url), "webview_navigate");
}

// blocks until the window closes
static napi_value run(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	return checkError(env, webview_run(readHandle(env, args[0])), "webview_run");
}

static napi_value terminate(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	return checkError(env, webview_terminate(readHandle(env, args[0])), "webview_terminate");
}

static napi_value destroy(napi_env env, napi_callback_info info) {
	size_t count = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &count, args, NULL, NULL);

	return checkError(env, webview_destroy(readHandle(env, args[0])), "webview_destroy");
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
	addFunction(env, exports, "terminate", terminate);
	addFunction(env, exports, "destroy", destroy);
	return exports;
}
