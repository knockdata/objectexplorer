// Hands the window and its view to open-linux.c. The libraries come in already open, because
// webview-linux.c opened them.
#ifndef OPEN_LINUX_H
#define OPEN_LINUX_H

void openLinuxAttach(void *window, void *view, void *gtkLibrary, void *gobjectLibrary, void *webkitLibrary);

#endif
