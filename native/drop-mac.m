// Reading a dragged folder's real path, which no browser will tell the page.
//
// WKWebView is itself the window's drag destination — it implements -_hitTest:dragTypes: and
// answers with itself — so a subclass of it sees every drag method before WebKit does, and this
// file is that subclass. It reads the paths off the drag pasteboard and hands them to the page,
// then calls super, which is what feeds the page the HTML5 drop it is expecting.
//
// The page reads one value:
//
//     window.nativeDragFolders = { time: 1758…, uris: ["file:///Users/rock/photos"] }
//
// and clears it itself once it has used it. Nothing is cleared from here, and the page checks
// that the folder names in it are also in the drop it was given — so a drag carried back out of
// the window can never be read into the next one.
//
// Only folders are sent. A dropped file already reaches the page as a File with its bytes; it is
// the folder that arrives as nothing a browser can open.
//
// Ordering is the whole of the timing story. The eval and the drop travel the same connection to
// the same web content process and are handled in the order they were sent, so pushing before
// [super performDragOperation:] puts the value in the page ahead of its drop handler — even when
// a drag enters and lets go inside one frame.
//
// One thing to know if this app is ever sandboxed for the Mac App Store: a dragged folder then
// grants a sandbox extension that lasts only for the session, and keeping it needs a
// security-scoped bookmark. Unsandboxed — which is what assets/entitlements.plist asks for — the
// path is simply readable and there is nothing to keep.
#import "drop-mac.h"
#include "applog.h"

// Long enough for a drag of a few dozen folders; a drag bigger than this sends what fits.
#define SCRIPT_SIZE 8192

// Everything a percent-encoded URI is allowed to be made of. -[NSURL absoluteString] escapes a
// quote, a backslash and every other character that would end the JS string literal early, so a
// URI that is only these characters is safe to write between double quotes. One that is not is
// not sent at all rather than trusted.
static BOOL safeUri(NSString *uri) {
	static NSCharacterSet *unsafe = nil;
	if (unsafe == nil) {
		NSString *allowed = @"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=%";
		unsafe = [[[NSCharacterSet characterSetWithCharactersInString:allowed] invertedSet] retain];
	}
	return [uri rangeOfCharacterFromSet:unsafe].location == NSNotFound;
}

static BOOL isFolder(NSURL *url) {
	NSNumber *directory = nil;
	[url getResourceValue:&directory forKey:NSURLIsDirectoryKey error:NULL];
	return [directory boolValue];
}

// What Finder actually puts on the pasteboard is a file reference url —
// file:///.file/id=6571367.54328272 — which names the inode and not the folder. It is a real
// url and every NSURL call works on it, which is what makes it easy to miss: it reads as a
// directory, it opens, it lists. It just cannot be sent anywhere, because nothing but this
// machine's filesystem knows what it means, and a minute later it may mean something else.
//
// -filePathURL is the conversion, and the whole of the fix. Chromium does the same thing before
// a dropped path reaches Electron's File.path.
static NSURL *realPath(NSURL *url) {
	NSURL *resolved = [url filePathURL];
	if (resolved) {
		return resolved;
	} else {
		// the volume it points at is gone; the reference url is all there is and it is no use
		return url;
	}
}

static void pushFolders(WKWebView *view, NSArray *urls, const char *when) {
	NSMutableString *list = [NSMutableString string];
	for (NSURL *reference in urls) {
		NSURL *url = realPath(reference);
		NSString *uri = [url absoluteString];
		// the line to read when a folder ends up in the wrong place: what Finder handed over, and
		// the path it resolved to, which is the path the server is asked to open
		appLog("drop: %s resolved %s -> %s", when, [[reference absoluteString] UTF8String], [[url path] UTF8String]);
		BOOL folder = isFolder(url);
		BOOL safe = safeUri(uri);
		BOOL room = [list length] + [uri length] + 3 < SCRIPT_SIZE;
		if (folder && safe && room) {
			if ([list length] > 0) {
				[list appendString:@","];
			} else {
			}
			[list appendFormat:@"\"%@\"", uri];
		} else {
			appLog("drop: %s skipped %s (folder %d, safe %d, room %d)", when, [uri UTF8String], folder, safe, room);
		}
	}
	if ([list length] > 0) {
		NSString *script = [NSString stringWithFormat:@"window.nativeDragFolders={time:Date.now(),uris:[%@]}", list];
		appLog("drop: %s pushing %s", when, [list UTF8String]);
		[view evaluateJavaScript:script completionHandler:^(id result, NSError *error) {
			if (error) {
				appLog("drop: %s the page refused the push: %s", when, [[error localizedDescription] UTF8String]);
			} else {
				appLog("drop: %s the page took it", when);
			}
		}];
	} else {
		appLog("drop: %s no folder in this drag", when);
	}
}

static void pushDraggedFolders(WKWebView *view, id<NSDraggingInfo> sender, const char *when) {
	NSDictionary *options = @{ NSPasteboardURLReadingFileURLsOnlyKey: @YES };
	NSPasteboard *board = [sender draggingPasteboard];
	NSArray *urls = [board readObjectsForClasses:@[[NSURL class]] options:options];
	appLog("drop: %s %lu url(s), pasteboard types %s", when, (unsigned long)[urls count],
		[[[board types] componentsJoinedByString:@" "] UTF8String]);
	if ([urls count] > 0) {
		pushFolders(view, urls, when);
	} else {
		appLog("drop: %s nothing that reads as a file url", when);
	}
}

@implementation DropWebView

// The drag arriving. This is the one that lands in time for the label the pointer carries, which
// is how the tree can offer "Add favorite folder" while the folder is still in the air.
- (NSDragOperation)draggingEntered:(id<NSDraggingInfo>)sender {
	pushDraggedFolders(self, sender, "entered");
	return [super draggingEntered:sender];
}

// And again at the drop, before super hands the page its drop event.
- (BOOL)performDragOperation:(id<NSDraggingInfo>)sender {
	pushDraggedFolders(self, sender, "dropped");
	return [super performDragOperation:sender];
}

@end
