// Windows only. node.lib makes the addon import its napi symbols from "node.exe", but the
// process that loads it is ObjectExplorer.exe — the loader would go looking for a node.exe on
// disk and fail. Delay-loading node.exe and answering the loader with the running executable is
// what makes process.dlopen work from a renamed binary.
//
// This is the one piece cmake-js used to contribute as CMAKE_JS_SRC.
#include <windows.h>
#include <delayimp.h>
#include <string.h>

static FARPROC WINAPI loadHook(unsigned event, DelayLoadInfo *info) {
	HMODULE host = NULL;

	if (event == dliNotePreLoadLibrary && _stricmp(info->szDll, "node.exe") == 0) {
		host = GetModuleHandle(NULL);
	} else {
	}
	return (FARPROC)host;
}

const PfnDliHook __pfnDliNotifyHook2 = loadHook;
