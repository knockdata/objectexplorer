// See previewContext.h. The bundle hangs objectExplorerPreview on the global object; each call
// answers through a callback, which JavaScriptCore runs while draining the promise jobs the call
// queued, before the call itself returns — so the answer is in hand the line after.
#import "previewContext.h"
#import <JavaScriptCore/JavaScriptCore.h>

static const unsigned long long maxPreviewBytes = 64ull * 1024 * 1024;

NSData *previewRead(NSURL *url) {
	NSNumber *size = nil;
	[url getResourceValue:&size forKey:NSURLFileSizeKey error:nil];
	if (size != nil && size.unsignedLongLongValue <= maxPreviewBytes) {
		return [NSData dataWithContentsOfURL:url options:NSDataReadingMappedIfSafe error:nil];
	} else {
		return nil;
	}
}

// one context per process: the bundle is parsed once, however many files Finder asks about
static JSContext *previewContext(void) {
	static JSContext *context = nil;
	static dispatch_once_t once;
	dispatch_once(&once, ^{
		// in an extension the main bundle is the .appex, and the script sits in its Resources
		NSString *scriptPath = [[NSBundle mainBundle] pathForResource:@"preview-jsc" ofType:@"js"];
		NSString *script = [NSString stringWithContentsOfFile:scriptPath encoding:NSUTF8StringEncoding error:nil];
		context = [[JSContext alloc] init];
		context.exceptionHandler = ^(JSContext *where, JSValue *exception) {
			NSLog(@"objectexplorer preview: %@", exception);
		};
		if (script != nil) {
			[context evaluateScript:script];
		} else {
			NSLog(@"objectexplorer preview: preview-jsc.js is missing from the extension");
		}
	});
	return context;
}

// the NSData stays alive as long as the typed array that looks at it
static void releaseData(void *bytes, void *data) {
	CFRelease(data);
}

static JSValue *uint8Array(JSContext *context, NSData *data) {
	JSValueRef exception = NULL;
	JSObjectRef array = JSObjectMakeTypedArrayWithBytesNoCopy(context.JSGlobalContextRef, kJSTypedArrayTypeUint8Array,
		(void *)data.bytes, data.length, releaseData, (void *)CFBridgingRetain(data), &exception);
	return [JSValue valueWithJSValueRef:array inContext:context];
}

static JSValue *callPreview(NSString *name, NSArray *arguments) {
	JSContext *context = previewContext();
	__block JSValue *answer = nil;
	id done = ^(JSValue *value) {
		answer = value;
	};
	JSValue *function = context[@"objectExplorerPreview"][name];
	[function callWithArguments:[arguments arrayByAddingObject:done]];
	return answer;
}

CGImageRef previewThumbnail(NSURL *url, NSData *bytes, size_t width, size_t height) {
	JSContext *context = previewContext();
	JSValue *image = callPreview(@"thumbnail", @[uint8Array(context, bytes), url.pathExtension.lowercaseString, @(width), @(height)]);
	if (image != nil && image.isObject) {
		JSValueRef exception = NULL;
		JSObjectRef rgba = JSValueToObject(context.JSGlobalContextRef, image[@"rgba"].JSValueRef, &exception);
		void *pixels = JSObjectGetTypedArrayBytesPtr(context.JSGlobalContextRef, rgba, &exception);
		size_t length = JSObjectGetTypedArrayByteLength(context.JSGlobalContextRef, rgba, &exception);
		if (pixels != NULL && length == width * height * 4) {
			CFDataRef copy = CFDataCreate(NULL, pixels, length);
			CGDataProviderRef provider = CGDataProviderCreateWithCFData(copy);
			CGColorSpaceRef space = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
			CGImageRef result = CGImageCreate(width, height, 8, 32, width * 4, space,
				kCGImageAlphaPremultipliedLast | kCGBitmapByteOrderDefault, provider, NULL, false, kCGRenderingIntentDefault);
			CGColorSpaceRelease(space);
			CGDataProviderRelease(provider);
			CFRelease(copy);
			return result;
		} else {
			return NULL;
		}
	} else {
		return NULL;
	}
}

NSString *previewHtml(NSURL *url, NSData *bytes) {
	JSContext *context = previewContext();
	JSValue *html = callPreview(@"html", @[uint8Array(context, bytes), url.pathExtension.lowercaseString, url.lastPathComponent]);
	if (html != nil && html.isString) {
		return html.toString;
	} else {
		return nil;
	}
}
