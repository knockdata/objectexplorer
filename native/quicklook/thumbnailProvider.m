// The Quick Look thumbnail extension (com.apple.quicklook.thumbnail): what Finder shows for a data
// file in icon view, gallery view and column view — its row count over its first rows, drawn by the
// preview bundle (previewContext.m). A file it cannot draw gets an error, and Finder falls back to
// the document icon.
#import <QuickLookThumbnailing/QuickLookThumbnailing.h>
#import "previewContext.h"

@interface OEThumbnailProvider : QLThumbnailProvider
@end

@implementation OEThumbnailProvider

- (void)provideThumbnailForFileRequest:(QLFileThumbnailRequest *)request
		completionHandler:(void (^)(QLThumbnailReply *reply, NSError *error))handler {
	NSData *bytes = previewRead(request.fileURL);
	// a page a little taller than wide, the shape of a document icon, as large as Finder asks
	CGFloat height = request.maximumSize.height;
	CGFloat width = MIN(request.maximumSize.width, round(height * 0.8));
	size_t pixelWidth = (size_t)MAX(32, round(width * request.scale));
	size_t pixelHeight = (size_t)MAX(40, round(height * request.scale));
	CGImageRef image = bytes != nil ? previewThumbnail(request.fileURL, bytes, pixelWidth, pixelHeight) : NULL;
	if (image != NULL) {
		QLThumbnailReply *reply = [QLThumbnailReply replyWithContextSize:CGSizeMake(width, height) drawingBlock:^BOOL(CGContextRef context) {
			CGContextDrawImage(context, CGRectMake(0, 0, pixelWidth, pixelHeight), image);
			CGImageRelease(image);
			return YES;
		}];
		if (@available(macOS 12.0, *)) {
			reply.extensionBadge = request.fileURL.pathExtension.uppercaseString;
		} else {
		}
		handler(reply, nil);
	} else {
		handler(nil, [NSError errorWithDomain:NSCocoaErrorDomain code:NSFileReadCorruptFileError userInfo:nil]);
	}
}

@end
