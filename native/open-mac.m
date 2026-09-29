// Files the OS asked the app to open, on macOS. open.h says what the page is given.
//
// A document opened from Finder is not an argument: Launch Services starts the app, or finds the
// one already running, and sends it an "open documents" Apple Event. The application delegate is
// what hears it, so the delegate has to be in place before [NSApp run] — webviewCreate attaches it.
//
// Everything that touches the view runs on the main thread. A call from the server worker is
// queued onto it with dispatch_async, which the run loop drains like any other event.
//
// No ARC, as in webview-mac.m: the delegate and the waiting list live until the process exits.
#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import "open-mac.h"
#include "open.h"
#include "applog.h"

static NSWindow *openWindow;
static WKWebView *openView;
static BOOL pageLoaded;
static NSMutableArray *waitingPaths;

static void pushPaths(NSString *paths) {
	NSString *script = [NSString stringWithFormat:
		@"(window.nativeOpenFiles=window.nativeOpenFiles||[]).push(...%@);window.dispatchEvent(new Event('native-open'))", paths];
	appLog("open: pushing %s", [paths UTF8String]);
	[openView evaluateJavaScript:script completionHandler:^(id result, NSError *error) {
		(void)result;
		if (error) {
			appLog("open: the page refused the push: %s", [[error localizedDescription] UTF8String]);
		} else {
		}
	}];
}

// main thread only
static void deliverPaths(NSString *paths) {
	if (openView && pageLoaded) {
		pushPaths(paths);
	} else {
		appLog("open: page not loaded yet, holding %s", [paths UTF8String]);
		[waitingPaths addObject:paths];
	}
	if (openWindow) {
		[openWindow makeKeyAndOrderFront:nil];
		[NSApp activateIgnoringOtherApps:YES];
	} else {
	}
}

@interface OpenDelegate : NSObject <NSApplicationDelegate, WKNavigationDelegate>
@end

@implementation OpenDelegate

- (void)application:(NSApplication *)application openURLs:(NSArray<NSURL *> *)urls {
	(void)application;
	NSMutableArray *paths = [NSMutableArray array];
	for (NSURL *url in urls) {
		if ([url isFileURL]) {
			[paths addObject:[url path]];
		} else {
		}
	}
	NSData *json = [NSJSONSerialization dataWithJSONObject:paths options:0 error:nil];
	NSString *text = [[[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding] autorelease];
	deliverPaths(text);
}

// The load event has fired by now, so the page's modules have run and its listener is there. A
// reload lands here too, with nothing waiting.
- (void)webView:(WKWebView *)view didFinishNavigation:(WKNavigation *)navigation {
	(void)view;
	(void)navigation;
	pageLoaded = YES;
	for (NSString *paths in waitingPaths) {
		pushPaths(paths);
	}
	[waitingPaths removeAllObjects];
}

@end

static OpenDelegate *openDelegate;

void openMacAttach(NSWindow *window, WKWebView *view) {
	openWindow = window;
	openView = view;
	waitingPaths = [[NSMutableArray alloc] init];
	openDelegate = [[OpenDelegate alloc] init];
	[NSApp setDelegate:openDelegate];
	[view setNavigationDelegate:openDelegate];
}

void webviewOpenFiles(const char *paths) {
	NSString *text = [[NSString alloc] initWithUTF8String:paths];
	dispatch_async(dispatch_get_main_queue(), ^{
		deliverPaths(text);
		[text release];
	});
}

void webviewAllowForeground(void) {
}
