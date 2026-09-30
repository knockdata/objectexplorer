// The Windows thumbnail and preview handler (preview-windows.c): a COM in-process server that
// Explorer loads for a data file. The picture itself comes from preview-windows-image.c, which runs
// the app's own `cli thumbnail` — the renderer lives in the package, not in this DLL.
#ifndef PREVIEW_WINDOWS_H
#define PREVIEW_WINDOWS_H
#define COBJMACROS
#include <windows.h>
#include <objidl.h>

// the DLL's own module handle, set in DllMain: the app's exe sits in the same folder
extern HINSTANCE previewModule;

// the stream's bytes drawn as a 32-bit top-down BGRA bitmap `height` pixels tall, or NULL when
// the app cannot preview it. `name` is the file name the stream reports, for its extension.
HBITMAP previewBitmap(IStream *stream, const wchar_t *name, UINT height);

#endif
