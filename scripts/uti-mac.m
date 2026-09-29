// Prints, for each extension given, the UTI macOS gives it: "ext identifier dynamic", one line
// each. dynamic is 1 when the system knows no type for the extension and made one up (dyn.…).
// fileTypes.mjs compiles and runs this while packing the .app.
#import <Foundation/Foundation.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

int main(int argc, const char **argv) {
	for (int i = 1; i < argc; i++) {
		UTType *type = [UTType typeWithFilenameExtension:[NSString stringWithUTF8String:argv[i]]];
		printf("%s %s %d\n", argv[i], type.identifier.UTF8String, type.dynamic);
	}
	return 0;
}
