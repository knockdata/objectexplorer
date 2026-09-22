# <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/assets/logo-full.png" width="32" alt="ObjectExplorer"> ObjectExplorer

**The VS Code for cloud storage.** S3, GCS, Azure Blob, MinIO, OneLake, Dropbox, OneDrive, Box and
local disks in one window — every object previewed, queried and modelled in place, on your machine.

[<img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/video/poster.png" width="800" alt="Forty seconds of ObjectExplorer">](https://objectexplorer.com)

[objectexplorer.com](https://objectexplorer.com) · [Open it in a browser](https://objectexplorer.com/app) ·
[Documentation](https://objectexplorer.com/what-is-objectexplorer) · [Pricing](https://objectexplorer.com/pricing)

## Install

| Platform                  | Download                                                    |
|:--------------------------|:------------------------------------------------------------|
| macOS, Apple silicon      | [ObjectExplorer-mac-arm64.dmg][mac-arm64.dmg]               |
| macOS, Intel              | [ObjectExplorer-mac-x64.dmg][mac-x64.dmg]                   |
| Windows, x64 installer    | [ObjectExplorer-windows-x64.msix][windows-x64.msix]         |
| Windows, ARM64 installer  | [ObjectExplorer-windows-arm64.msix][windows-arm64.msix]     |
| Windows, x64 executable   | [ObjectExplorer-windows-x64.exe][windows-x64.exe]           |
| Windows, ARM64 executable | [ObjectExplorer-windows-arm64.exe][windows-arm64.exe]       |
| Linux, x64                | [ObjectExplorer-linux-x64.AppImage][linux-x64.AppImage]     |
| Linux, ARM64              | [ObjectExplorer-linux-arm64.AppImage][linux-arm64.AppImage] |

[mac-arm64.dmg]: https://objectexplorer.com/download/mac-arm64.dmg?channel=github
[mac-x64.dmg]: https://objectexplorer.com/download/mac-x64.dmg?channel=github
[windows-x64.msix]: https://objectexplorer.com/download/windows-x64.msix?channel=github
[windows-arm64.msix]: https://objectexplorer.com/download/windows-arm64.msix?channel=github
[windows-x64.exe]: https://objectexplorer.com/download/windows-x64.exe?channel=github
[windows-arm64.exe]: https://objectexplorer.com/download/windows-arm64.exe?channel=github
[linux-x64.AppImage]: https://objectexplorer.com/download/linux-x64.AppImage?channel=github
[linux-arm64.AppImage]: https://objectexplorer.com/download/linux-arm64.AppImage?channel=github

Every link fetches the installer from the newest release. Older versions, and the release notes for
each one, are on the [releases page](https://github.com/knockdata/objectexplorer/releases).
Per-platform notes — notarization, SmartScreen, the WebKitGTK package Linux needs — are in
[getting started](https://objectexplorer.com/getting-started).

Or run it with no install at all, if you have Node 20+:

```sh
npx @knockdata/objectexplorer
```

The Free plan is a real tool, not a trial: three cloud roots on every provider and five local
folders. Pro lifts every cap — see [pricing](https://objectexplorer.com/pricing).

## What it does

- **Preview instead of download.** More than 130 file extensions render in place — Parquet, SPSS, SAS,
  office, ebooks, images, audio, video, SQLite and DuckDB files — parsed in a worker on your machine.
  → [every format](https://objectexplorer.com/formats/)
- **One window for every provider.** Every provider in the same tree, with the same keyboard, as a list
  or as a grid of previews. A folder is a folder everywhere.
  → [connecting storage](https://objectexplorer.com/storage/connect)
- **A PDF reader with notes.** Its own renderer: select, find, bookmarks, thumbnails, and seven marks
  plus text notes of your own. → [the PDF reader](https://objectexplorer.com/formats/pdf)
- **CAD, 3D, textures and shaders.** STEP, SolidWorks, CATIA and DWG; glTF, FBX, Blender, obj and
  Unity models; DDS, KTX2, HDR and EXR textures; WGSL and GLSL shaders running live.
  → [CAD](https://objectexplorer.com/formats/cad) · [3D models](https://objectexplorer.com/formats/models)
- **The bill, and how to cut it.** Every bucket priced on one disc — full of demo data until yours
  has something on it — and Optimize for the cheaper class, the single region, the old versions and
  the abandoned uploads — each a command you run.
  → [optimize](https://objectexplorer.com/explore/optimize)
- **SQL over the object, where it lives.** DuckDB queries the object in the bucket; nothing is staged
  and no table is created first. → [SQL](https://objectexplorer.com/analyze/sql)
- **Column summaries.** A histogram, a box plot or a split bar under every column header.
  → [column summaries](https://objectexplorer.com/explore/column-summary)
- **A notebook per object.** A tabular object opens with a query and a chart already written; Table,
  Chart, Model, Python, JavaScript and Text cells. → [the notebook](https://objectexplorer.com/analyze/notebook)
- **Lake formats read as tables.** Delta, Iceberg and Hudi parsed to their own specifications, with
  deletes, schema evolution and time travel. → [data lake tables](https://objectexplorer.com/analyze/lake)
- **Search across buckets.** Local folders and cloud prefixes in the same run.
  → [search](https://objectexplorer.com/explore/search)
- **A writing assistant.** Markdown edited in place, with passages and phrases from writers you chose
  beside it, and mechanical flags — never a score. → [writing](https://objectexplorer.com/analyze/writing)
- **An access gateway for agents.** MCP for Claude Code and Codex: the agent holds no credential, PII
  is rewritten on the way out, and every call is logged. → [agents](https://objectexplorer.com/agents/)

The whole story, one afternoon at a time: [objectexplorer.com/story](https://objectexplorer.com/story/).

## Your data never leaves your machine

ObjectExplorer is an HTTP server bound to `127.0.0.1` plus the OS webview, both inside the same
executable. Every parser runs in a worker on your own machine, and objects are fetched from your
provider to your computer and nowhere else: we run no backend that sees your objects, because there
is none. → [the whole argument](https://objectexplorer.com/privacy)

Under the hood it is a single native binary: no Electron, no Chromium, just the OS webview (WebKit
on macOS and Linux, WebView2 on Windows) pointed at the HTTP server running inside the same
executable.

## Links

- [objectexplorer.com](https://objectexplorer.com) — the product page, the documentation and the stories
- [objectexplorer.com/app](https://objectexplorer.com/app) — the app itself, in a browser
- [@knockdata/objectexplorer](https://www.npmjs.com/package/@knockdata/objectexplorer) — the application bundle behind `npx` and every desktop build
- [Changelog](./CHANGELOG.md) — what changed in each version
- [Releases](https://github.com/knockdata/objectexplorer/releases) — every version, every platform

## License

Source code in this repository is MIT licensed — see [LICENSE](./LICENSE).

The application itself is not covered by it. ObjectExplorer ships as the minified bundle published on
npm as [@knockdata/objectexplorer](https://www.npmjs.com/package/@knockdata/objectexplorer), which
this repository packages into the desktop builds. That bundle is proprietary software of Knock Data
AB, under the terms in the package's `LICENSE.md`. Versions up to and including 0.7.0 were published
under MIT.

The app bundles work by other people, each under its own terms — Excalifont under the SIL Open
Font License, Seti UI's file-type icons and DuckDB under MIT, VS Code's codicons under CC BY 4.0,
SQLite in the public domain, and Google's Cloud service icons under Google's own icon terms. Every
one of them is named, with its licence text, in `LICENSES.md` inside the app: open
[objectexplorer.com/app/LICENSES.md](https://objectexplorer.com/app/LICENSES.md), or find the same
file in `app/` of the [npm package](https://www.npmjs.com/package/@knockdata/objectexplorer) and
of every release binary.

FFmpeg is the one thing the app does **not** bundle. Its WebAssembly core is GPL, so the browser
fetches it from a CDN the first time an audio file needs converting, and it reaches you from us in
no build at all.
