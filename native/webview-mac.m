// The macOS window: NSWindow + WKWebView, nothing else. Cocoa and WebKit ship with the OS, so
// there is nothing to fetch and nothing to link beyond the two frameworks.
//
// Objective-C rather than objc_msgSend from C: it is the same clang and the same zero
// dependencies, and a hand-cast msgSend for every call would be twice the lines for no gain.
//
// No ARC. The window and the view live until the process exits, and webviewDestroy is called
// once, right after the run loop returns.
#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#include "webview.h"

struct Webview {
	NSWindow *window;
	WKWebView *view;
};

// [NSApp run] returns on stop: only after it processes one more event, so closing the window
// has to post one. Without this the window disappears and the thread stays in the run loop.
@interface WindowDelegate : NSObject <NSWindowDelegate>
@end

@implementation WindowDelegate
- (void)windowWillClose:(NSNotification *)notification {
	[NSApp stop:nil];
	NSEvent *wakeUp = [NSEvent otherEventWithType:NSEventTypeApplicationDefined
		location:NSMakePoint(0, 0)
		modifierFlags:0
		timestamp:0
		windowNumber:0
		context:nil
		subtype:0
		data1:0
		data2:0];
	[NSApp postEvent:wakeUp atStart:YES];
}
@end

// Without a main menu the standard key equivalents do not exist, so Cmd+C in the explorer does
// nothing at all. These items act on the first responder, which is the web view.
static void buildMenu(void) {
	NSMenu *bar = [[NSMenu alloc] init];
	[NSApp setMainMenu:bar];

	NSMenuItem *appItem = [[NSMenuItem alloc] init];
	[bar addItem:appItem];
	NSMenu *appMenu = [[NSMenu alloc] init];
	[appItem setSubmenu:appMenu];
	[appMenu addItemWithTitle:@"Quit" action:@selector(terminate:) keyEquivalent:@"q"];

	NSMenuItem *editItem = [[NSMenuItem alloc] init];
	[bar addItem:editItem];
	NSMenu *editMenu = [[NSMenu alloc] initWithTitle:@"Edit"];
	[editItem setSubmenu:editMenu];
	[editMenu addItemWithTitle:@"Undo" action:@selector(undo:) keyEquivalent:@"z"];
	[editMenu addItemWithTitle:@"Redo" action:@selector(redo:) keyEquivalent:@"Z"];
	[editMenu addItem:[NSMenuItem separatorItem]];
	[editMenu addItemWithTitle:@"Cut" action:@selector(cut:) keyEquivalent:@"x"];
	[editMenu addItemWithTitle:@"Copy" action:@selector(copy:) keyEquivalent:@"c"];
	[editMenu addItemWithTitle:@"Paste" action:@selector(paste:) keyEquivalent:@"v"];
	[editMenu addItemWithTitle:@"Select All" action:@selector(selectAll:) keyEquivalent:@"a"];
}

Webview *webviewCreate(int debug) {
	NSApplication *app = [NSApplication sharedApplication];
	// Regular is what gives the process a Dock icon and a menu bar; the default for a plain
	// binary is Prohibited, which shows no window at all
	[app setActivationPolicy:NSApplicationActivationPolicyRegular];
	buildMenu();

	NSRect frame = NSMakeRect(0, 0, 800, 600);
	NSWindowStyleMask style = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable
		| NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskResizable;
	NSWindow *window = [[NSWindow alloc] initWithContentRect:frame
		styleMask:style
		backing:NSBackingStoreBuffered
		defer:NO];
	[window setDelegate:[[WindowDelegate alloc] init]];
	[window center];

	WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
	if (debug) {
		// the documented property is macOS 13.3+; the key has worked since WKWebView shipped
		[[configuration preferences] setValue:@YES forKey:@"developerExtrasEnabled"];
	} else {
	}

	WKWebView *view = [[WKWebView alloc] initWithFrame:frame configuration:configuration];
	[view setAutoresizingMask:NSViewWidthSizable | NSViewHeightSizable];
	[window setContentView:view];

	Webview *webview = (Webview *)calloc(1, sizeof(Webview));
	webview->window = window;
	webview->view = view;
	return webview;
}

void webviewSetTitle(Webview *webview, const char *title) {
	[webview->window setTitle:[NSString stringWithUTF8String:title]];
}

// A plain macOS window has no icon in its title bar. The one image the title bar can show is
// the document icon, and that button only exists once the window has a represented URL — the
// url is never opened, it is what makes the icon appear in front of the title.
//
// The title bar only. The Dock icon stays the .app bundle's icon.icns, which has every size;
// setApplicationIconImage here would replace it with this one small png.
void webviewSetIcon(Webview *webview, const unsigned char *png, int length) {
	NSData *data = [NSData dataWithBytes:png length:length];
	NSImage *image = [[NSImage alloc] initWithData:data];
	if (image) {
		[webview->window setRepresentedURL:[NSURL URLWithString:@"objectexplorer:"]];
		[[webview->window standardWindowButton:NSWindowDocumentIconButton] setImage:image];
	} else {
	}
}

void webviewSetSize(Webview *webview, int width, int height) {
	[webview->window setContentSize:NSMakeSize(width, height)];
	[webview->window center];
}

void webviewNavigate(Webview *webview, const char *url) {
	NSURL *address = [NSURL URLWithString:[NSString stringWithUTF8String:url]];
	[webview->view loadRequest:[NSURLRequest requestWithURL:address]];
}

void webviewRun(Webview *webview) {
	[webview->window makeKeyAndOrderFront:nil];
	[NSApp activateIgnoringOtherApps:YES];
	[NSApp run];
}

void webviewDestroy(Webview *webview) {
	[webview->window setDelegate:nil];
	[webview->window close];
	free(webview);
}
