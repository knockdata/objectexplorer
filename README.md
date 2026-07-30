# one

ObjectExplorer as a single native binary. No Electron, no Chromium — the OS webview
(WebKit on mac/linux, WebView2 on Windows) pointed at the objectexplorer HTTP server running
inside the same executable.

Solo use. Nothing here is published; there is no API to keep stable.

## Why

The Electron build kept losing on Windows VMs: Defender quarantined `ObjectExplorer.exe` out
of a folder full of loose `.pak`/`.dll` files, and a GPU-less VM crashed the renderer on first
paint. One signed file with no GPU process removes both failure modes.

## How it fits together

```
main thread                            worker thread
-----------                            -------------
unpack the app bundle
start the worker            ──────>    start the objectexplorer HTTP server
wait for the port           <──────    postMessage({ port })
open the native window
run()  — blocks until close            keeps serving, checks npm for updates
```

`webview_run` blocks its thread and webview has no step API, so the HTTP server has to live
somewhere else. It gets a worker thread. There is no JS bridge between the two — the UI talks
to the backend over `http://127.0.0.1:<port>` exactly as it would in a browser, which is why
the native binding needs only seven calls.

## Build

```
npm install
npm run build          # addon -> bundle -> sea -> pack
```

| step | what it does |
|--------|-----------------------------------------------------------------|
| addon  | `cmake-js` builds `native/webview_napi.c` into `out/*.node`      |
| bundle | downloads the latest `@knockdata/objectexplorer` tarball         |
| sea    | esbuild -> node SEA blob -> postject into the official node binary |
| pack   | mac `.app` + `.dmg`, win `.exe` with icon, linux `.tar.gz`       |

`npm run smoke` opens a window over a throwaway server for 8 seconds and writes every request
to `out/smoke.log` — it is there to prove the worker keeps serving while the main thread is
blocked.

Prerequisites: CMake and a C/C++ toolchain. Linux also needs `libwebkit2gtk-4.1-dev` to build
and `libwebkit2gtk-4.1-0` to run.

## Release

```
git tag v0.3.0 && git push origin v0.3.0
```

`.github/workflows/release.yml` builds mac (arm64, x64), Windows (x64, arm64) and Linux
(x64, arm64), smoke tests each binary with `.github/smoke.sh`, and attaches everything to a
GitHub Release.

Signing needs repository secrets, and every job builds without them — a fork gets an ad-hoc
signed `.app` and a bare `.exe`. **An unsigned `.exe` is quarantined by Defender and blocked by
SmartScreen; on a Windows VM that looks like a double-click that does nothing at all.** The
Windows job warns when it uploads one.

| secret | what it signs |
|------------------------------------------------------------|-------------------------------------|
| `BUILD_CERTIFICATE_BASE64`, `P12_PASSWORD`, `KEYCHAIN_PASSWORD` | the mac `.app` with Developer ID |
| `APP_STORE_CONNECT_KEY_ID`, `_ISSUER_ID`, `_PRIVATE_KEY`   | notarizes and staples the `.dmg`    |
| `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | the `.exe` with Azure Trusted Signing |

## Runtime layout

Everything lives in `~/.objectexplorer`, shared with `npx objectexplorer`:

| path | what |
|--------------------------------|--------------------------------------------|
| `one.log`                      | this binary's log                          |
| `.app/objectexplorer-<version>/` | unpacked app bundles, newest one wins    |
| `.bin/webview_napi-*.node`     | the native addon, extracted from the binary |
| `webview2-args.txt`            | Windows only, overrides `--disable-gpu`     |
| `folders.json`                 | the backend's folders, shared with the CLI  |

## When the window will not open

```
ObjectExplorer mode=browser
```

Skips the native window and opens the default browser instead. The same fallback happens
automatically when the window cannot be created — a Windows VM with no WebView2 runtime, a
Linux box with no webkitgtk — with the reason in `one.log`.

```
ObjectExplorer mode=server
```

Neither a window nor a browser: it just serves, and prints the url to `one.log`. This is what
the release workflow runs to prove the binary starts.

An empty `one.log` after a launch attempt means the process never reached any JavaScript, which
on Windows means the loader or Defender stopped it before it started.

`reference/webview-nodejs/` is the upstream binding this replaced. It is kept to read, never
built and never imported.
