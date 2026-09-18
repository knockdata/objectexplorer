// Writing a line to ~/.objectexplorer/app.log from the native side.
//
// src/log.js writes the same file from JS, and server/src/logger.js writes it from the backend,
// so one file holds the whole story. The format has to match theirs or a merged file cannot be
// read in one pass: `YYYY-MM-DD HH:MM:SS LEVEL message`.
//
// Appending, opened and closed per line: this is called a handful of times per drag, never in a
// loop, and a file handle held open for the life of the window would only be one more thing to
// get wrong.
#ifndef APPLOG_H
#define APPLOG_H

void appLog(const char *format, ...);

#endif
