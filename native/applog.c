// See applog.h.
#include <stdarg.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "applog.h"

#define PATH_SIZE 1024
#define LINE_SIZE 4096

// The same folder paths.js calls userData. USERPROFILE is read too so this file needs no
// change the day windows has something to log.
static int logPath(char *path) {
	const char *home = getenv("HOME");
	if (home == NULL) {
		home = getenv("USERPROFILE");
	} else {
	}
	if (home) {
		snprintf(path, PATH_SIZE, "%s/.objectexplorer/app.log", home);
		return 1;
	} else {
		return 0;
	}
}

void appLog(const char *format, ...) {
	char path[PATH_SIZE];
	if (logPath(path)) {
		FILE *file = fopen(path, "a");
		if (file) {
			char line[LINE_SIZE];
			va_list parts;
			va_start(parts, format);
			vsnprintf(line, LINE_SIZE, format, parts);
			va_end(parts);

			time_t now = time(NULL);
			struct tm local;
			localtime_r(&now, &local);
			char stamp[32];
			strftime(stamp, sizeof(stamp), "%Y-%m-%d %H:%M:%S", &local);

			fprintf(file, "%s INFO  %s\n", stamp, line);
			fclose(file);
		} else {
			// nowhere to write; the app is not worth stopping over a log line
		}
	} else {
		// no home folder in the environment
	}
}
