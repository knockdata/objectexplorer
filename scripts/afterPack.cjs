const fs = require('fs');
const path = require('path');

// Toggle each removal on/off
const REMOVE_SWIFTSHADER = true;  // ~16MB — software Vulkan GPU fallback, safe to remove
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
};

function remove(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true });
        console.log(`[afterPack] removed: ${path.basename(filePath)}`);
    }
}
