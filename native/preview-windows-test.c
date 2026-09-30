// The Windows handler driven the way Explorer drives it, for CI (.github/thumbnail.sh): load the
// DLL, ask its class factory for the handler, hand it a file as a stream, ask for a thumbnail.
// Prints the bitmap's size and exits 0 when one came back.
//
//   preview-windows-test.exe <ObjectExplorerPreview.dll> <file>
#define COBJMACROS
#include <windows.h>
#include <shlwapi.h>
#include <thumbcache.h>
#include <propsys.h>
#include <stdio.h>

static const CLSID PREVIEW_CLSID = { 0x6a1d3b1e, 0x4f2a, 0x4c8b, { 0x9e, 0x5d, 0x0b, 0x7f, 0x3c, 0x2a, 0x9e, 0x41 } };
typedef HRESULT (STDAPICALLTYPE *GetClassObject)(REFCLSID, REFIID, void **);

int wmain(int argc, wchar_t **argv) {
	int code = 1;
	CoInitializeEx(NULL, COINIT_APARTMENTTHREADED);
	HMODULE dll = argc > 2 ? LoadLibraryW(argv[1]) : NULL;
	GetClassObject getClassObject = dll ? (GetClassObject)GetProcAddress(dll, "DllGetClassObject") : NULL;
	IClassFactory *factory = NULL;
	IInitializeWithStream *initialize = NULL;
	IThumbnailProvider *provider = NULL;
	IStream *stream = NULL;
	HBITMAP bitmap = NULL;
	WTS_ALPHATYPE alpha;
	if (getClassObject
		&& SUCCEEDED(getClassObject(&PREVIEW_CLSID, &IID_IClassFactory, (void **)&factory))
		&& SUCCEEDED(IClassFactory_CreateInstance(factory, NULL, &IID_IInitializeWithStream, (void **)&initialize))
		&& SUCCEEDED(SHCreateStreamOnFileEx(argv[2], STGM_READ | STGM_SHARE_DENY_NONE, 0, FALSE, NULL, &stream))
		&& SUCCEEDED(IInitializeWithStream_Initialize(initialize, stream, STGM_READ))
		&& SUCCEEDED(IInitializeWithStream_QueryInterface(initialize, &IID_IThumbnailProvider, (void **)&provider))
		&& SUCCEEDED(IThumbnailProvider_GetThumbnail(provider, 256, &bitmap, &alpha))) {
		BITMAP info;
		GetObjectW(bitmap, sizeof info, &info);
		printf("thumbnail handler: %ldx%ld bitmap\n", info.bmWidth, info.bmHeight);
		code = info.bmHeight == 256 ? 0 : 1;
		DeleteObject(bitmap);
	} else {
		printf("thumbnail handler: no bitmap (dll %p, entry %p)\n", (void *)dll, (void *)getClassObject);
	}
	if (provider) IThumbnailProvider_Release(provider);
	if (stream) IStream_Release(stream);
	if (initialize) IInitializeWithStream_Release(initialize);
	if (factory) IClassFactory_Release(factory);
	return code;
}
