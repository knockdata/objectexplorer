// The two Quick Look extensions inside the .app, so Finder shows what is in a data file:
//
//   ObjectExplorerThumbnail.appex   com.apple.quicklook.thumbnail   icon, gallery and column view
//   ObjectExplorerPreview.appex     com.apple.quicklook.preview     the space bar, the preview pane (macOS 12+)
//
// Each is native/quicklook/<provider>.m + previewContext.m, compiled here with clang the way the
// addon is (no Xcode project), with the preview bundle from the npm package (server/preview-jsc.js,
// built from rock2/preview) in its Resources. An extension must be sandboxed to be registered at
// all, and signed before the app that holds it, with its own entitlements — so pack.mjs signs these
// first and the app after, never with --deep. Finder only uses them from a Developer ID build.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { targetArch } from "./target.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const sourceDir = path.join(root, "native", "quicklook")
export const previewScriptFile = path.join(root, "out", "preview-jsc.js")
const appId = "com.knockdata.objectexplorer"

const extensions = [
	{
		name: "ObjectExplorerThumbnail",
		source: "thumbnailProvider.m",
		frameworks: ["QuickLookThumbnailing"],
		minimum: "11.0",
		point: "com.apple.quicklook.thumbnail",
		principal: "OEThumbnailProvider",
		attributes: `				<key>QLThumbnailMinimumDimension</key>
				<integer>0</integer>`,
	},
	{
		name: "ObjectExplorerPreview",
		source: "previewProvider.m",
		frameworks: ["QuickLookUI", "UniformTypeIdentifiers"],
		minimum: "12.0",
		point: "com.apple.quicklook.preview",
		principal: "OEPreviewProvider",
		attributes: `				<key>QLIsDataBasedPreview</key>
				<true/>
				<key>QLSupportsSearchableItems</key>
				<false/>`,
	},
]

// contentTypes: the exact UTIs a data file of ours has (fileTypes.mjs macPreviewContentTypes);
// Quick Look matches them exactly, a parent type never
export function buildQuickLook(options) {
	const { appPath, contentTypes, version, identity } = options
	if (fs.existsSync(previewScriptFile) && contentTypes.length > 0) {
		for (const extension of extensions) {
			const appex = path.join(appPath, "Contents", "PlugIns", `${extension.name}.appex`)
			const contents = path.join(appex, "Contents")
			fs.mkdirSync(path.join(contents, "MacOS"), { recursive: true })
			fs.mkdirSync(path.join(contents, "Resources"), { recursive: true })
			compile(extension, path.join(contents, "MacOS", extension.name))
			fs.copyFileSync(previewScriptFile, path.join(contents, "Resources", "preview-jsc.js"))
			fs.writeFileSync(path.join(contents, "Info.plist"), infoPlist(extension, contentTypes, version))
			execFileSync("codesign", ["--force", "--timestamp", "--options", "runtime",
				"--entitlements", path.join(sourceDir, "entitlements.plist"), "--sign", identity, appex], { stdio: "inherit" })
			console.log("quick look:", extension.name)
		}
	} else {
		console.log("quick look: no preview bundle in this package, the app ships without previews")
	}
}

function compile(extension, output) {
	const clangArch = targetArch === "x64" ? "x86_64" : targetArch
	const frameworks = ["Foundation", "JavaScriptCore", "CoreGraphics", ...extension.frameworks].flatMap(name => ["-framework", name])
	execFileSync("/usr/bin/clang", ["-fobjc-arc", "-fapplication-extension", "-O2", "-arch", clangArch,
		`-mmacosx-version-min=${extension.minimum}`, "-e", "_NSExtensionMain",
		path.join(sourceDir, "previewContext.m"), path.join(sourceDir, extension.source), ...frameworks, "-o", output], { stdio: "inherit" })
}

function infoPlist(extension, contentTypes, version) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>ObjectExplorer</string>
	<key>CFBundleExecutable</key>
	<string>${extension.name}</string>
	<key>CFBundleIdentifier</key>
	<string>${appId}.${extension.name.replace("ObjectExplorer", "").toLowerCase()}</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>${extension.name}</string>
	<key>CFBundlePackageType</key>
	<string>XPC!</string>
	<key>CFBundleShortVersionString</key>
	<string>${version}</string>
	<key>CFBundleVersion</key>
	<string>${version}</string>
	<key>LSMinimumSystemVersion</key>
	<string>${extension.minimum}</string>
	<key>NSExtension</key>
	<dict>
		<key>NSExtensionAttributes</key>
		<dict>
			<key>QLSupportedContentTypes</key>
			<array>
${contentTypes.map(identifier => `				<string>${identifier}</string>`).join("\n")}
			</array>
${extension.attributes}
		</dict>
		<key>NSExtensionPointIdentifier</key>
		<string>${extension.point}</string>
		<key>NSExtensionPrincipalClass</key>
		<string>${extension.principal}</string>
	</dict>
</dict>
</plist>
`
}
