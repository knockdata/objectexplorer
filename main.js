import { app, BrowserWindow, Menu, shell, dialog, nativeImage, nativeTheme } from "electron";
import { spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import VersionManager from "./VersionManager.js";
import Logger from "./logger.js";

app.setName("ObjectExplorer");

const require = createRequire(import.meta.url);
const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.split("=")));
const preferredPort = args.port ? +args.port : 9421;
const here = path.dirname(fileURLToPath(import.meta.url));
// dev and staging build the product from the monorepo source next to this repo
const repoRoot = path.join(here, "../rock2");
const iconPath = path.join(here, "build/icon.png");
const appIcon = nativeImage.createFromPath(iconPath);

// the whole product — backend bundle, built frontend, sqlite wasm — is the objectexplorer
// npm package. electron-builder unpacks it out of the asar so the backend can be imported
// as a real file and load its wasm from disk, so point at the unpacked copy when packaged.
const packageDir = resolvePackageDir();

function resolvePackageDir() {
	const resolved = path.dirname(require.resolve("objectexplorer/package.json"));
	const packed = `${path.sep}app.asar${path.sep}`;
	if (resolved.includes(packed)) {
		return resolved.replace(packed, `${path.sep}app.asar.unpacked${path.sep}`);
	} else {
		return resolved;
	}
}


// Electron(Dev) 		http://localhost:9421  => vite middleware over ../rock2/explorer source
// Electron(Staging)	http://localhost:9421  => npm package, demo proxied to staging.objectexplorer.com
// Electron(prod)	    http://localhost:9421  => npm package, demo proxied to objectexplorer.com
//
// The product itself ships as the objectexplorer npm package and updates from the npm
// registry (VersionManager.js); objectexplorer.com only serves the landing page, the web
// version of the app at /app, and the demo folder that a fresh install proxies to.



// build and configure the single window, but don't load a url yet: the window is created in
// parallel with the server so it is ready to load the moment the server url resolves.
function newWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		title: "ObjectExplorer",
		icon: appIcon,
		// paint the window in the system theme colour and stay hidden until the first frame is
		// ready, so startup never flashes white before the app theme paints
		show: false,
		backgroundColor: nativeTheme.shouldUseDarkColors ? "#1f1f1f" : "#ffffff",
	});

	win.once("ready-to-show", function () {
		win.maximize();
		win.show();
	});

	if (mode === "dev" || mode === "staging") {
		win.webContents.openDevTools();
	}

	win.webContents.on("did-fail-load", function (event, errorCode, errorDescription) {
		console.log("[main] Window failed to load:", errorCode, errorDescription);
	});
	win.webContents.on("did-finish-load", function () {
		console.log("[main] Window loaded successfully");
	});
	return win;
}

// dev serves the explorer frontend live from source (vite middleware) + backend in-process;
// prod and staging both run the packaged web server in-process and differ only by which host
// the demo folder is proxied from.
const appServerUrls = {
	prod: "https://objectexplorer.com",
	staging: "https://staging.objectexplorer.com",
};
// dev and staging serve the explorer from the monorepo source (../rock2); on a machine
// without it there is nothing to build from, so fall back to the installed npm package.
const requestedMode = args.mode || "prod";
const hasMonorepo = fs.existsSync(path.join(repoRoot, "server/WebServer.js"));
let mode = requestedMode;
if (requestedMode !== "prod" && hasMonorepo === false) {
	mode = "prod";
}

app.whenReady().then(async function () {
	const userData = app.getPath("userData");
	const logger = Logger({ userData });

	// make sure any crash lands in app.log so it can be debugged after the fact
	process.on("uncaughtException", function (error) {
		logger.error("uncaughtException:", error.message, error.stack);
	});
	process.on("unhandledRejection", function (reason) {
		logger.error("unhandledRejection:", reason && reason.stack ? reason.stack : String(reason));
	});

	if (app.dock) {
		app.dock.setIcon(appIcon);
	}

	if (process.platform === "darwin") {
		Menu.setApplicationMenu(Menu.buildFromTemplate([
			{
				label: "ObjectExplorer",
				submenu: [
					{ role: "about" },
					{ type: "separator" },
					{ role: "hide" },
					{ role: "hideOthers" },
					{ role: "unhide" },
					{ type: "separator" },
					{ role: "quit" },
				],
			},
			{ role: "editMenu" },
			{ role: "viewMenu" },
			{ role: "windowMenu" },
		]));
	}

	logger.log("App ready", process.versions);
	logger.log("mode:", mode);
	logger.log("userData:", userData);
	logger.log("resourcesPath:", process.resourcesPath);
	logger.log("packageDir:", packageDir);
	logger.log("exe:", process.execPath);
	logger.log("cwd:", process.cwd());
	logger.log("argv:", JSON.stringify(process.argv));

	let versionManager;
	let bootBundleDir = null;
	let closeServer = null;
	let swapping = false;

	async function openFolder() {
		console.log('[add-folder][main] openFolder: opening native directory dialog');
		const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
		console.log('[add-folder][main] openFolder: canceled=', result.canceled, 'paths=', result.filePaths);
		if (result.canceled) {
			return null;
		} else {
			return result.filePaths[0];
		}
	}

	// start the server and build the window concurrently, then load the url once the server is
	// listening. prod/staging serve the local bundle, so nothing waits on the network.
	const appServerUrl = appServerUrls[mode] || appServerUrls.prod;
	let localServer;
	if (mode === "dev") {
		localServer = startDevAppServer();
	} else {
		if (mode === "staging") {
			startStagingServer();
		}
		try {
			// local resolve only: getBundleDir falls back to the installed npm package, so startup
			// never waits on the network. the registry check + download run in checkUpdate below.
			versionManager = await VersionManager({ userData, packageDir, logger });
			logger.log("rootDir:", versionManager.rootDir);
			bootBundleDir = versionManager.getBundleDir();

			const started = await startAppServer(bootBundleDir, appServerUrl);
			closeServer = started.close;
			versionManager.checkUpdate().catch(function (err) {
				logger.error("checkUpdate failed:", err.message);
			});
			localServer = started.url;
		} catch (err) {
			logger.error("FATAL startup error:", err.message, err.stack);
		}
	}

	const win = newWindow();
	const bootUrl = await localServer;
	win.loadURL(bootUrl);

	// a freshly downloaded newer bundle is swapped in only when the window goes to background,
	// so the user never sees the reload; the download itself already happened in checkUpdate.
	win.on("blur", async function () {
		const pending = versionManager && versionManager.getPendingBundleDir();
		if (pending && pending !== bootBundleDir && swapping === false) {
			swapping = true;
			bootBundleDir = pending;
			await closeServer();
			const swapped = await startAppServer(pending, appServerUrl);
			closeServer = swapped.close;
			win.loadURL(swapped.url);
			swapping = false;
		}
	});

	// staging fronts the release + demo host from a separate process: serve.js listens on 8443
	// and the router maps staging.objectexplorer.com:443 to it. Run under the Electron binary
	// as plain Node via ELECTRON_RUN_AS_NODE.
	function startStagingServer() {
		const serveJs = path.join(repoRoot, "server/serve.js");
		// expose a Node inspector so the staging server (a separate process) is
		// debuggable; attach VS Code to this port. override with stagingInspectPort=NNNN
		const inspectArg = `--inspect=${args.stagingInspectPort || 9230}`;
		const stagingServer = spawn(process.execPath, [inspectArg, serveJs, "mode=staging"], {
			cwd: path.join(repoRoot, "server"),
			env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
			stdio: ["ignore", "pipe", "pipe"],
		});
		stagingServer.stdout.on("data", function (chunk) {
			logger.log("[staging]", chunk.toString().trimEnd());
		});
		stagingServer.stderr.on("data", function (chunk) {
			logger.error("[staging]", chunk.toString().trimEnd());
		});
		logger.log(`Staging server spawned (${inspectArg}):`, serveJs);
		app.on("will-quit", function () {
			stagingServer.kill();
		});
	}

	async function startServer(WebServer, port, mode, options) {
		const server = await WebServer({ ...options, port, mode, publicDir: options.appDir });
		return { port: await server.start(), close: server.close };
	}

	async function startDevAppServer() {
		const { WebServer } = await import(path.join(repoRoot, "server/WebServer.js"));
		const { port } = await startServer(WebServer, preferredPort, "dev", {
			userData,
			logger,
			dir: "explorer",
			root: repoRoot,
			demoPath: path.join(repoRoot, "server/sites/demo"),
			// built maps live here; served at /maps/ for manual attach in DevTools
			mapsDir: path.join(repoRoot, "server/sites/objectexplorer.com/maps"),
			openFolder,
			appMode: "electron",
			portRetry: true,
		});
		logger.log("Dev server started (explorer vite middleware) on port", port);
		return `http://localhost:${port}`;
	}

	async function startAppServer(bundleDir /* .../node_modules/objectexplorer */,
		appServerUrl /* https://staging.objectexplorer.com */) {
		const appDir = path.join(bundleDir, "app");
		const pathWebServer = path.join(bundleDir, "server", "WebServer.mjs");
		const pathIndexHtml = path.join(appDir, "index.html");
		logger.log("bundleDir:", bundleDir);
		logger.log("appDir:", appDir);
		logger.log(`${pathWebServer} exists:`, fs.existsSync(pathWebServer));
		logger.log(`${pathIndexHtml} exists:`, fs.existsSync(pathIndexHtml));

		const WebServer = await getWebServer(pathWebServer);
		logger.log("WebServer loaded, starting on preferred port", preferredPort);

		// demo ships inside the objectexplorer bundle itself; if a bundle has no demo/ folder
		// (e.g. an older cached OTA download), the backend falls back to proxying demo
		// requests to appServerUrl.
		const demoPath = path.join(bundleDir, "demo");
		const { port, close } = await startServer(WebServer, preferredPort, "prod", {
			userData,
			logger,
			appDir,
			demoPath,
			appServerUrl,
			openFolder,
			appMode: "electron",
			portRetry: true,
			...args,
		});
		logger.log("Server started on port", port);
		return { url: `http://localhost:${port}`, close };
	}

	async function getWebServer(pathWebServer) {
		logger.log("Loading bundled WebServer from:", pathWebServer);
		const bundleModule = await import("file://" + pathWebServer);
		return bundleModule.WebServer;
	}
});

app.on("window-all-closed", function () {
	app.quit();
});
