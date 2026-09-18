// The web view the window puts on screen.
//
// A WKWebView that reads the file paths off an OS drag and writes them into the page before the
// page is told the drop happened. Everything else about it is a WKWebView: every drag method
// here calls super, so the page still gets its ordinary HTML5 drag events and drag-to-upload
// and drag-to-open keep working exactly as they did.
#ifndef DROP_MAC_H
#define DROP_MAC_H

#import <WebKit/WebKit.h>

@interface DropWebView : WKWebView
@end

#endif
