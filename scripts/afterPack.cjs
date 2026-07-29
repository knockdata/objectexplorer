const fs = require('fs');
const path = require('path');

// Toggle each removal on/off
//
// REMOVE_SWIFTSHADER must stay false. These files are not an optional extra — they are
// Chromium's renderer of last resort. With no usable GPU driver Chromium rasterises through
// SwANGLE (ANGLE on top of SwiftShader's Vulkan), which needs vk_swiftshader.dll and
// vulkan-1.dll. Delete them and any machine without a working GPU has no rasteriser at all:
// the renderer process crashes on first paint and the window stays white. That is exactly
// what 0.2.4 did on both Windows VMs, which have no GPU. Developer Macs never noticed
// because a real GPU never takes the fallback path. ~16MB is the price of running in a VM.
const REMOVE_SWIFTSHADER = false; // ~16MB — software GPU fallback, REQUIRED on GPU-less machines
const REMOVE_FFMPEG = false;       // ~2MB  — set true if no <video>/<audio> in your app

// Every byte kept here is a byte the Windows installer has to compress, extract, code sign and
// let Defender scan, so the same removals run on win32 as on mac.
exports.default = async ({ appOutDir, packager }) => {
    const platform = packager.platform.name;

    if (platform === 'mac') {
        const frameworkLibs = path.join(
            appOutDir,
            `${packager.appInfo.productName}.app`,
            'Contents/Frameworks/Electron Framework.framework/Libraries'
        );

        if (REMOVE_SWIFTSHADER) {
            remove(path.join(frameworkLibs, 'libvk_swiftshader.dylib'));
            remove(path.join(frameworkLibs, 'vk_swiftshader_icd.json'));
        }

        if (REMOVE_FFMPEG) {
            remove(path.join(frameworkLibs, 'libffmpeg.dylib'));
        }
    } else if (platform === 'windows') {
        if (REMOVE_SWIFTSHADER) {
            remove(path.join(appOutDir, 'vk_swiftshader.dll'));
            remove(path.join(appOutDir, 'vk_swiftshader_icd.json'));
            remove(path.join(appOutDir, 'vulkan-1.dll'));
        }

        if (REMOVE_FFMPEG) {
            remove(path.join(appOutDir, 'ffmpeg.dll'));
        }
    }

    writeManifest(appOutDir, packager);
};

function remove(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true });
        console.log(`[afterPack] removed: ${path.basename(filePath)}`);
    }
}

// Record what actually shipped, so the app can tell at startup whether anything was removed
// from the install directory afterwards — Defender has done exactly that to this app before
// (see RELEASE.md). Paths are relative to the directory holding resources/, which the app
// finds at runtime as path.dirname(process.resourcesPath) on every platform. Written last,
// after the removals above, so it describes the real contents.
function writeManifest(appOutDir, packager) {
    const platform = packager.platform.name;
    const root = platform === 'mac'
        ? path.join(appOutDir, `${packager.appInfo.productName}.app`, 'Contents')
        : appOutDir;
    const resourcesDir = path.join(root, platform === 'mac' ? 'Resources' : 'resources');

    const files = [];
    collect(root, root, files);
    const manifest = {
        productName: packager.appInfo.productName,
        version: packager.appInfo.version,
        platform,
        arch: process.env.npm_config_arch || 'unknown',
        files,
    };
    fs.mkdirSync(resourcesDir, { recursive: true });
    fs.writeFileSync(path.join(resourcesDir, 'package-files.json'), JSON.stringify(manifest, null, 1));
    console.log(`[afterPack] manifest: ${files.length} files recorded for ${root}`);
}

function collect(dir, root, files) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collect(full, root, files);
        } else {
            if (entry.isFile()) {
                files.push({
                    path: path.relative(root, full).split(path.sep).join('/'),
                    size: fs.statSync(full).size,
                });
            }
        }
    }
}
