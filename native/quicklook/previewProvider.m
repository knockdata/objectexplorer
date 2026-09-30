// The Quick Look preview extension (com.apple.quicklook.preview, data based, macOS 12+): what the
// space bar and Finder's preview pane show for a data file — a page of its first rows, the HTML the
// preview bundle writes (previewContext.m). Quick Look renders it with no network and no script.
#import <QuickLookUI/QuickLookUI.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>
#import "previewContext.h"

@interface OEPreviewProvider : QLPreviewProvider <QLPreviewingController>
@end

@implementation OEPreviewProvider

- (void)providePreviewForFileRequest:(QLFilePreviewRequest *)request
		completionHandler:(void (^)(QLPreviewReply *reply, NSError *error))handler {
	NSData *bytes = previewRead(request.fileURL);
	NSString *html = bytes != nil ? previewHtml(request.fileURL, bytes) : nil;
	if (html != nil) {
		QLPreviewReply *reply = [[QLPreviewReply alloc] initWithDataOfContentType:UTTypeHTML contentSize:CGSizeMake(900, 640)
			dataCreationBlock:^NSData *(QLPreviewReply *replyToUpdate, NSError **error) {
				replyToUpdate.stringEncoding = NSUTF8StringEncoding;
				return [html dataUsingEncoding:NSUTF8StringEncoding];
			}];
		handler(reply, nil);
	} else {
		handler(nil, [NSError errorWithDomain:NSCocoaErrorDomain code:NSFileReadCorruptFileError userInfo:nil]);
	}
}

@end
