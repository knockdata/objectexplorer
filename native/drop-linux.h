// Wires the dragged-folder reader onto a WebKitGTK view, so a folder dragged in from the desktop
// reaches the page as a real path. See drop-mac.m for what the page is given and why.
//
// The libraries are handed in already open, because webview-linux.c opened them; every symbol
// this needs is looked up here and every one of them is optional. A machine missing any of them
// gets a window that works and a folder drop that does nothing, which is what it had before.
#ifndef DROP_LINUX_H
#define DROP_LINUX_H

void dropLinuxAttach(void *view, void *gtkLibrary, void *gobjectLibrary, void *webkitLibrary);

#endif
