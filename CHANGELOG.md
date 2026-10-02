# Release notes

What changed in each version. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links on
[objectexplorer.com](https://objectexplorer.com/#download) always fetch the newest one.

## v0.8.4  —  2026-10-02
- cloud bill for every service: disc Services sector, forecast, budgets, commitments, chargeback
- BigQuery tables open as a local sample, SQL cells run in BigQuery
- draw.io diagrams open as a drawing
- Google Docs/Sheets/Slides stubs open from Drive
- Power BI reports open with visuals, data and model
- file type sniffed from content, not only extension
- Pro lifetime €300

## v0.8.3  —  2026-09-30
- instant mode can New File and Folder
- using icon for supported file types
- preview in os

## v0.8.2  —  2026-09-30
- New File / New Folder in the tree context menu (`.md`, `.excalidraw`)
- objectexplorer.com/app can write to a folder opened from your disk
- OS thumbnails and previews for parquet, arrow, avro, orc, SAS, SPSS
- own icon per file type in Finder, Explorer and linux file managers
- `oe thumbnail` command
- APFS `.dmg` opens as a folder
- markdown block editor, with excalidraw drawings inline
- drawings saved shorter
- demo folder sorted by kind, with READMEs and new samples

## v0.8.1  —  2026-09-29
- Open With ObjectExplorer in Finder, Explorer and linux file managers
- Google sign-in on objectexplorer.com/app
- Open App goes to objectexplorer.com/app from every page
- architecture diagram in the demo folder

## v0.8.0  —  2026-09-28
- own hand-drawn font, Rock, replacing Excalifont
- URL options set how the window starts (`<part>=off`, `view=`, `treePath=`, `component.<name>=`)
- usage disc can open with insights drawn
- demo folder has a sample of each kind of file

## v0.7.7  —  2026-09-25
- enterprise mode: licence or 14-day trial, OIDC/SAML sign-in, admins, audit log, `oe check/upgrade/rollback`
- automatic HTTPS certificates via one CNAME (dns-01)
- account icon with sign-up and Download app dialog
- install the `oe` shell command from the palette
- one `deployment=` run setting

## v0.7.6  —  2026-09-23
- onboarding: welcome box, spotlight tours, **?** menu
- usage disc opens as a tab
- app runs in place on the landing page

## v0.7.5  —  2026-09-22
- truncate application log, with syntax highlight
- WebGL fallback when WebGPU is not available
- no close-tab after OAuth redirect in the desktop app

## v0.7.4  —  2026-09-22
- Free plan: three cloud roots per provider
- Google project list shows five first, with Show all
- buckets listed only when a project is opened
- clear "No permission to list buckets" and "No permission to read" messages
- usage disc opens on demo data, with a Demo switch
- objectexplorer.com/app hides Settings panes it cannot serve
- folder drag-in works in the desktop app, is remembered, and is readable by SQL
- fixed: app stopped when its log file disappeared
- fixed: rebuilt app at the same version kept running old code

## v0.7.0  —  2026-09-12
- MIT licence, and `LICENSES.md` for every bundled font, icon set and engine
- FFmpeg core fetched on demand instead of bundled (desktop binary 32 MB smaller)
- synthesized drum kit replaces sampled one; demo song removed

## v0.6.5 — 2026-09-10
- streaming Google Drive / OneDrive / iCloud placeholders detected
- ON DISK column, with per-file download
- ask before opening a large file not yet downloaded
- scanning no longer downloads streaming files
- mounts named as Finder names them
- fixed: large PDFs open again
- database rebuilt from scratch

## v0.6.3 — 2026-09-10
- Spark in python cells, reading objects by URI with no config
- Settings → Python: Spark cores and memory sliders
- python cell info panel: kernel, venv, namespace, output
- new kernel from the toolbar
- agent tools reuse the app's own routes; refusals name the step

## v0.6.2 — 2026-09-08
- agents read any object: tabular, textual, structure or raw
- `readObject` windows with offset/limit; `searchText`
- sanitization follows the object kind
- MCP overlay dot and session panel

## v0.6.1 — 2026-09-07
- Python notebook cells on an app-managed venv and kernel
- `oe.path`, `oe.query`, `oe.frame`, `oe.current`
- DataFrames and matplotlib figures render as results
- Settings → Python: venvs via `uv`, package install
- markdown filter box

## v0.6.0 — 2026-09-06
- MCP server for Claude Code, Codex and Streamable HTTP clients
- tools: listRoots, listObjects, describeObject, columnSummary, query
- access rules in `~/.objectexplorer/mcp.yaml`: allow, deny, approve
- PII rules: hash, mask, FPE or drop
- data access limits and audit log
- observe, replay and session history for agent activity

## v0.5.10 — 2026-09-05
- Microsoft Fabric OneLake connection
- Keynote `.key` opens as slides
- windowed text/hex reading for 2 GB files
- SQL over spreadsheets
- Settings → Cache with capacity and LRU eviction
- fixed: plain text coloured as SQL; PNG not centred; `.DS_Store` broke folder queries

## v0.5.9 — 2026-09-04
- S3-compatible endpoints (MinIO, R2, Ceph)

## v0.5.7 — 2026-09-04
- Google Cloud project list with filter and error messages
- all pages of buckets listed
- one rule list picks the viewer for a file
- video containers probed; ffmpeg for unsupported codecs
- fixed: video rendered as text; large audio silent; refresh returned cache

## v0.5.6 — 2026-09-03
- app can be framed by objectexplorer.com
- site video seeks and plays on iPhone

## v0.5.4 — 2026-09-03
- share a table or model as a link, with per-column Mask/Hash/FPE
- link expiry and read-and-burn
- fixed: text coordinate column broke the grid

## v0.5.3 — 2026-09-02
- copy, cut, paste, drag, rename, delete across local and cloud
- trash with 30-day expiry, ⌘Z undo
- multi-select
- folder size Σ, priced by storage class
- Cache Savings report
- Settings as one dialog
- grid zoom and arrangeable cards

## v0.5.2 — 2026-08-30
- command palette ⇧⌘P
- unified cloud sign-in dialog with revoke
- Check for Updates
- open and share application log

## v0.5.1 — 2026-08-25
- tables open as notebooks: Table, Chart, Model, Code, Text cells
- DuckDB over parquet, csv, json, xlsx, avro, SAS, SPSS and more
- Delta, Iceberg, Hudi and Hive partitions read as one table
- LightGBM model cell with feature importance and SHAP

## Earlier versions

| Version | Date       | What it brought                                        |
|---------|------------|--------------------------------------------------------|
| v0.5.0  | 2026-08-24 | the first build carrying the notebook                  |
| v0.4.7  | 2026-08-18 | data lake timelines, metadata on the tree              |
| v0.4.6  | 2026-08-18 | Windows smoke-test fix                                 |
| v0.4.3  | 2026-08-11 | ebook reader, Cloud Logging                            |
| v0.4.1  | 2026-08-05 | webview mode no longer opens a browser tab as well     |
| v0.4.0  | 2026-08-05 | npm publishing over trusted publishing (OIDC)          |
| v0.3.11 | 2026-08-01 | signed `.msix` packages for Windows                    |
