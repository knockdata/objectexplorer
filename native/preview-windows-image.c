// The picture behind the Windows thumbnail and preview handlers. The stream Explorer hands over is
// copied into a temporary file with the same extension, ObjectExplorer.exe beside this DLL is run
// as `cli thumbnail <in> <out.png> <size>` — the same command the linux thumbnailer runs — and the
// PNG it writes is decoded with WIC into a bitmap Explorer can take.
#include "preview-windows.h"
#include <wincodec.h>
#include <shlwapi.h>
#include <stdio.h>

#define RENDER_TIMEOUT 20000
#define MAX_PREVIEW_BYTES (64u * 1024u * 1024u)

// the stream into `path`, refusing anything larger than a preview reads
static BOOL streamToFile(IStream *stream, const wchar_t *path) {
	HANDLE file = CreateFileW(path, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_TEMPORARY, NULL);
	BOOL ok = file != INVALID_HANDLE_VALUE;
	if (ok) {
		BYTE buffer[65536];
		ULONG read = 0;
		ULONGLONG total = 0;
		LARGE_INTEGER start = { 0 };
		IStream_Seek(stream, start, STREAM_SEEK_SET, NULL);
		while (ok && SUCCEEDED(IStream_Read(stream, buffer, sizeof buffer, &read)) && read > 0) {
			DWORD written = 0;
			total += read;
			ok = total <= MAX_PREVIEW_BYTES && WriteFile(file, buffer, read, &written, NULL) && written == read;
		}
		CloseHandle(file);
	} else {
	}
	return ok;
}

// ObjectExplorer.exe cli thumbnail "<in>" "<out>" <size>, waited for; TRUE when it exited 0
static BOOL runThumbnail(const wchar_t *input, const wchar_t *output, UINT size) {
	wchar_t exe[MAX_PATH];
	GetModuleFileNameW(previewModule, exe, MAX_PATH);
	PathRemoveFileSpecW(exe);
	PathAppendW(exe, L"ObjectExplorer.exe");
	wchar_t command[3 * MAX_PATH + 64];
	swprintf(command, sizeof command / sizeof command[0], L"\"%s\" cli thumbnail \"%s\" \"%s\" %u", exe, input, output, size);
	STARTUPINFOW startup = { sizeof startup };
	PROCESS_INFORMATION process = { 0 };
	BOOL ok = CreateProcessW(exe, command, NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, NULL, &startup, &process);
	if (ok) {
		DWORD code = 1;
		ok = WaitForSingleObject(process.hProcess, RENDER_TIMEOUT) == WAIT_OBJECT_0 && GetExitCodeProcess(process.hProcess, &code) && code == 0;
		if (ok) {
		} else {
			TerminateProcess(process.hProcess, 1);
		}
		CloseHandle(process.hThread);
		CloseHandle(process.hProcess);
	} else {
	}
	return ok;
}

// the PNG as a top-down 32bpp BGRA DIB section
static HBITMAP decodePng(const wchar_t *path) {
	HBITMAP bitmap = NULL;
	IWICImagingFactory *factory = NULL;
	IWICBitmapDecoder *decoder = NULL;
	IWICBitmapFrameDecode *frame = NULL;
	IWICFormatConverter *converter = NULL;
	if (SUCCEEDED(CoCreateInstance(&CLSID_WICImagingFactory, NULL, CLSCTX_INPROC_SERVER, &IID_IWICImagingFactory, (void **)&factory))
		&& SUCCEEDED(IWICImagingFactory_CreateDecoderFromFilename(factory, path, NULL, GENERIC_READ, WICDecodeMetadataCacheOnDemand, &decoder))
		&& SUCCEEDED(IWICBitmapDecoder_GetFrame(decoder, 0, &frame))
		&& SUCCEEDED(IWICImagingFactory_CreateFormatConverter(factory, &converter))
		&& SUCCEEDED(IWICFormatConverter_Initialize(converter, (IWICBitmapSource *)frame, &GUID_WICPixelFormat32bppBGRA, WICBitmapDitherTypeNone, NULL, 0, WICBitmapPaletteTypeCustom))) {
		UINT width = 0;
		UINT height = 0;
		IWICFormatConverter_GetSize(converter, &width, &height);
		BITMAPINFO info = { 0 };
		info.bmiHeader.biSize = sizeof info.bmiHeader;
		info.bmiHeader.biWidth = (LONG)width;
		info.bmiHeader.biHeight = -(LONG)height;
		info.bmiHeader.biPlanes = 1;
		info.bmiHeader.biBitCount = 32;
		info.bmiHeader.biCompression = BI_RGB;
		void *pixels = NULL;
		bitmap = CreateDIBSection(NULL, &info, DIB_RGB_COLORS, &pixels, NULL, 0);
		if (bitmap != NULL && FAILED(IWICFormatConverter_CopyPixels(converter, NULL, width * 4, width * height * 4, (BYTE *)pixels))) {
			DeleteObject(bitmap);
			bitmap = NULL;
		} else {
		}
	} else {
	}
	if (converter) IWICFormatConverter_Release(converter);
	if (frame) IWICBitmapFrameDecode_Release(frame);
	if (decoder) IWICBitmapDecoder_Release(decoder);
	if (factory) IWICImagingFactory_Release(factory);
	return bitmap;
}

HBITMAP previewBitmap(IStream *stream, const wchar_t *name, UINT height) {
	wchar_t folder[MAX_PATH];
	wchar_t input[MAX_PATH];
	wchar_t output[MAX_PATH];
	const wchar_t *extension = name != NULL ? PathFindExtensionW(name) : L"";
	GetTempPathW(MAX_PATH, folder);
	swprintf(input, MAX_PATH, L"%sobjectexplorer-preview-%lu%s", folder, GetCurrentThreadId(), extension);
	swprintf(output, MAX_PATH, L"%sobjectexplorer-preview-%lu.png", folder, GetCurrentThreadId());
	HBITMAP bitmap = NULL;
	if (streamToFile(stream, input) && runThumbnail(input, output, height)) {
		bitmap = decodePng(output);
	} else {
	}
	DeleteFileW(input);
	DeleteFileW(output);
	return bitmap;
}
