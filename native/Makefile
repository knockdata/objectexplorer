# Builds webview_napi.node for mac and linux. scripts/addon.mjs is the caller and copies the
# result into out/ under its per-platform name.
#
# Windows does not come through here: the runners have no make, so scripts/addon.mjs drives
# cl.exe directly.
UNAME := $(shell uname -s)

# a clang architecture name, x86_64 or arm64. Only macOS cross-builds, and one Xcode targets
# both, which is how the Intel mac is built on an Apple Silicon runner.
ARCH ?= $(shell uname -m)

# one directory per arch, so switching arch cannot pick up the other one's object file
BUILD_DIR := build/$(ARCH)
TARGET := $(BUILD_DIR)/webview_napi.node

CFLAGS := -std=c11 -O2 -Wall -Inapi
HEADERS := webview.h

ifeq ($(UNAME),Darwin)
SOURCES := webview_napi.c webview-mac.m
CFLAGS += -arch $(ARCH)
# a .node resolves its napi symbols from the host process at dlopen time, so there is no node
# library to link at all; dynamic_lookup is what lets them stay undefined
LDFLAGS := -bundle -undefined dynamic_lookup -arch $(ARCH) -framework Cocoa -framework WebKit
else
SOURCES := webview_napi.c webview-linux.c
CFLAGS += -fPIC
# gtk and webkit are opened with dlopen, so libdl is the whole link line
LDFLAGS := -shared -ldl
endif

all: $(TARGET)

$(TARGET): $(SOURCES) $(HEADERS) | $(BUILD_DIR)
	cc $(CFLAGS) $(LDFLAGS) -o $@ $(SOURCES)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

clean:
	rm -rf build

.PHONY: all clean
