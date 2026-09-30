// The preview bundle (rock2/preview, shipped in the npm package as server/preview-jsc.js) run in a
// JavaScriptCore context, for the two Quick Look extensions beside this file.
#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

// the file's bytes, or nil when it is larger than a preview reads (parquet and ORC keep their
// footer at the end, so a preview holds the whole file)
NSData *previewRead(NSURL *url);

// the thumbnail as an image `width` x `height` pixels, or NULL when the file is not one it draws
CGImageRef previewThumbnail(NSURL *url, NSData *bytes, size_t width, size_t height);

// the Quick Look page as HTML, or nil
NSString *previewHtml(NSURL *url, NSData *bytes);
