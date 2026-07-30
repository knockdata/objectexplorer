cmake_minimum_required(VERSION 3.20)

# C for everything we write. CXX is enabled only for code we never edit: webview's own core
# (Cocoa / WebKitGTK / WebView2-COM glue, which cannot be C) and cmake-js's delay-load hook.
project(webview_napi C CXX)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

# webview::core_static builds core/src/webview.cc into a static library and PUBLIC-defines
# WEBVIEW_STATIC, which makes webview.h declare the C API as plain extern instead of inline
# C++. That is what lets webview_napi.c include it from a C compiler.
set(WEBVIEW_BUILD_STATIC_LIBRARY ON  CACHE BOOL "" FORCE)
set(WEBVIEW_BUILD_SHARED_LIBRARY OFF CACHE BOOL "" FORCE)
set(WEBVIEW_BUILD_TESTS          OFF CACHE BOOL "" FORCE)
set(WEBVIEW_BUILD_EXAMPLES       OFF CACHE BOOL "" FORCE)
set(WEBVIEW_BUILD_DOCS           OFF CACHE BOOL "" FORCE)

include(FetchContent)
FetchContent_Declare(
	webview
	GIT_REPOSITORY https://github.com/webview/webview
	GIT_TAG 0.12.0
)
FetchContent_MakeAvailable(webview)

# MSVC needs the node .lib generated from the .def cmake-js hands over
if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
	execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()

add_library(${PROJECT_NAME} SHARED webview_napi.c ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_compile_definitions(${PROJECT_NAME} PRIVATE NAPI_VERSION=9)
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})
target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_JS_LIB} webview::core_static)
