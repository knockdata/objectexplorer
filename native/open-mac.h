// Hands the window and its view to open-mac.m, which becomes the application delegate (to hear
// "open documents") and the view's navigation delegate (to know when the page can take paths).
#ifndef OPEN_MAC_H
#define OPEN_MAC_H

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

void openMacAttach(NSWindow *window, WKWebView *view);

#endif
