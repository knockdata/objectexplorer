const fs = require('fs');
const path = require('path');

// Toggle each removal on/off
const REMOVE_SWIFTSHADER = true;  // ~16MB — software Vulkan GPU fallback, safe to remove
const REMOVE_FFMPEG = false;       // ~2MB  — set true if no <video>/<audio> in your app

exports.default = async ({ appOutDir, packager }) => {
    const platform = packager.platform.name;
    if (platform !== 'mac') return;

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
};

function remove(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true });
        console.log(`[afterPack] removed: ${path.basename(filePath)}`);
    }
}
