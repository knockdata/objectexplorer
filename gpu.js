import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

// app.getGPUInfo() cannot answer this question: calling it is what starts the Chromium GPU
// process, and on a GPU-less VM that process is exactly what crashes. The only call that can
// change rendering, app.disableHardwareAcceleration(), must run before the app is ready. So
// the machine is asked from outside Chromium, synchronously, before anything starts.

// bump this when the adapter list or the probe itself changes, so every machine re-probes
const probeVersion = 1;

// adapters a virtual machine or a remote session presents when there is no real GPU behind them
const softwareAdapter = /Basic Render|Basic Display|Microsoft Remote Display|Hyper-V|VMware SVGA|VirtualBox|Standard VGA|Citrix Indirect|QXL|virtio|llvmpipe/i;

function stateFile(dataDir) {
	return path.join(dataDir, "gpu-state.json");
}

function readState(dataDir) {
	try {
		return JSON.parse(fs.readFileSync(stateFile(dataDir), "utf8"));
	} catch (error) {
		// no file is the normal case on a first launch
		return {};
	}
}

function writeState(dataDir, state) {
	try {
		fs.writeFileSync(stateFile(dataDir), JSON.stringify(state, null, "\t"));
	} catch (error) {
		// an unwritable data folder must not stop the app from starting
	}
}

// ask the operating system what display adapters exist. never throws: a machine that cannot
// answer is assumed healthy, and markStart/markPainted below catch it if that guess was wrong.
function readAdapters() {
	if (process.platform === "win32") {
		try {
			const out = execFileSync("powershell", [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name",
			], { timeout: 5000, windowsHide: true, encoding: "utf8" });
			return { adapters: out.split(/\r?\n/).map((line) => line.trim()).filter(Boolean), failed: false };
		} catch (error) {
			return { adapters: [], failed: true };
		}
	} else {
		if (process.platform === "linux") {
			// a real render node is the cheapest true/false answer there is — no process to spawn
			const rendered = fs.existsSync("/dev/dri/renderD128");
			return { adapters: rendered ? ["/dev/dri/renderD128"] : [], failed: false };
		} else {
			// macs always have a GPU
			return { adapters: ["Apple"], failed: false };
		}
	}
}

function probe() {
	const { adapters, failed } = readAdapters();
	if (failed) {
		return { adapters, software: false, reason: "adapter probe failed, assuming hardware" };
	} else {
		// disable only when every adapter is a software one. a real workstation in an RDP or
		// Citrix session shows a mirror adapter next to its real GPU, and that must stay hardware.
		const software = adapters.length === 0 || adapters.every((name) => softwareAdapter.test(name));
		if (software) {
			return { adapters, software: true, reason: `no hardware adapter: ${adapters.join(", ") || "none found"}` };
		} else {
			return { adapters, software: false, reason: `hardware adapter: ${adapters.join(", ")}` };
		}
	}
}

// called at module load in main.js, before the app is ready. first match wins.
export default function resolveGpu({ dataDir, args, appliedSwitches, appVersion }) {
	const state = readState(dataDir);
	if (args.gpu === "on") {
		return { disabled: false, reason: "forced on by gpu=on", adapters: state.adapters || [] };
	}
	else if (args.disableGpu === "true" || appliedSwitches.some((s) => s.name === "disable-gpu")) {
		return { disabled: true, reason: "requested", adapters: state.adapters || [] };
	}
	else if (state.pendingStart) {
		// the last launch wrote a start marker and never cleared it, so it died before the window
		// painted. that is the GPU-less crash, and it stays disabled until gpu-state.json is deleted.
		const crashCount = (state.crashCount || 0) + 1;
		writeState(dataDir, { ...state, pendingStart: null, crashCount, software: true });
		return {
			disabled: true,
			reason: `previous launch never reached first paint (${crashCount} so far)`,
			adapters: state.adapters || [],
		};
	}
	else if (state.crashCount > 0) {
		return {
			disabled: true,
			reason: `a previous launch never reached first paint (${state.crashCount} so far)`,
			adapters: state.adapters || [],
		};
	}
	else if (state.probeVersion === probeVersion && state.appVersion === appVersion) {
		return { disabled: state.software === true, reason: `${state.reason} (cached)`, adapters: state.adapters || [] };
	}
	else {
		const probed = probe();
		writeState(dataDir, {
			probeVersion,
			appVersion,
			adapters: probed.adapters,
			software: probed.software,
			reason: probed.reason,
			probedAt: new Date().toISOString(),
			pendingStart: null,
			crashCount: 0,
		});
		return { disabled: probed.software, reason: probed.reason, adapters: probed.adapters };
	}
}

// written just before the window is created and cleared the moment it paints. a launch that
// dies in between leaves the marker behind, which is what resolveGpu reads next time.
export function markStart(dataDir) {
	const state = readState(dataDir);
	writeState(dataDir, { ...state, pendingStart: new Date().toISOString() });
}

export function markPainted(dataDir) {
	const state = readState(dataDir);
	if (state.pendingStart) {
		writeState(dataDir, { ...state, pendingStart: null });
	}
}
