# Release notes

What changed in each version. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links on
[objectexplorer.com](https://objectexplorer.com/#download) always fetch the newest one.

## v0.9.14  —  2026-10-27
- many more formats open as what they are: older 3D models (3DS, LightWave, COLLADA, DirectX, MilkShape, Quake, Half-Life, Irrlicht, IQM, AC3D, AMF and more) drawn and their animations played; text FBX; USD shapes; DWG from R13 to 2007; SolidWorks previews; Keynote '09, iWork '09, Works, Write and Publisher text; OneNote, Access, Outlook PST, cpio, RAR 1.4, Doom WAD and winmail.dat; certificates, keys, PKCS #7/#12 and Java keystores as their fields; fonttools TTX, UFO glyphs and designspaces drawn; GRIB weather data; Berkeley DB; 15 older picture formats (FLI, SGI, BLP, Sun raster, PCX family, X BitMap and PixMap …)
- TIFF: fax, LZMA, Zstandard, WebP and old-style JPEG compression, BigTIFF, Lab colour and any bit depth; camera raws of every TIFF-based make; EPS without a preview drawn
- video and sound: Theora, ProRes, QuickTime Animation, H.264 4:4:4, MS-MPEG-4, more AAC profiles; a file whose track can't be played opens on its tracks and says why
- parquet: version 2 pages, the DELTA and BYTE_STREAM_SPLIT encodings, INT96, wide decimals, Hadoop LZ4, brotli and LZO; millisecond timestamps were 1000× off and unsigned numbers showed negative: fixed; DuckDB 0.9 files; SQLite files with broken pages or UTF-16 text read as far as they go
- files open forgivingly: a file cut short shows what it holds, and one that really can't be read says why in plain words; JSON with comments, trailing commas, JSON5, and a broken JSON shown as written with where it goes wrong underlined
- grids: the # header says rows shown / total; numbers line up on their decimal point (cut to 4 decimals, the full number on hover); a latitude, longitude, city or country says its place and its local time on hover; a sheet of 16,384 columns opens at once
- PDFs with a lost or broken page tree show their pages; a binary file nothing else draws opens on its structure; programs and libraries (.exe, .dll, .so, .wasm, .class) laid out as their structure
- one slider for the whole app, a glass lens while pressed; controls muted at rest and green on hover; the Duplicate to / Convert To ring as solid as the menu
- code: comments and multi-line strings coloured as they are, over every line
- Run a Test and Run Improvement: interactive runs keep going across a reload, reports say each failure's code and where

## v0.9.13  —  2026-10-21
- BigQuery in the tree (bq://project/dataset/table) at the least cost: browsing and opening a table read only free metadata and rows, kept on disk; every query is priced first and runs under a limit, and its answer is kept
- JPEG XL and AVIF open as pictures, with their EXIF, on the desktop and in every browser (a format the browser can't show is sent as a JPEG)
- slides: pictures and the logo kept inside the .slides.md file; timeline, big-number and card blocks; each slide's sources in its footer; notes with links; tighter bullets; Copy for LinkedIn and Medium puts the deck on the clipboard as an article (sources in small words under each slide, no stray links)
- icons in hand-drawn drawings draw as icons, and Rock falls back to other hand-drawn fonts
- the laser is one smooth hand-drawn stroke
- Run a Test (Debug Mode): every file in a folder opened as a click opens it, the verdicts shown as the view shows them; Run Test on a single file too; `oe test <folder>`
- Create Anonymized Copy for many more formats: xls, ods, arrow/feather, avro, NetCDF, sas7bdat, dta, sav, xpt, npy/npz, yaml, xml, psv, and compressed csv/json; Hebrew, Arabic, Thai and Devanagari letters changed too
- Debug Mode in the command palette gates the developer tools; Run Improvement
- grids: a click on a column name sorts and keeps the filters, a click on empty header space clears them; columns stay aligned after a narrowing drag
- a long Markdown page scrolls to its last line in the desktop app
- a storage location your plan had no room for is added once the plan changes
- the tree's context menu in groups
- source maps for debugging any copy in the browser, to the developer's password only

## v0.9.11  —  2026-10-20
- pipelines: a dbt model's columns each list the upstream columns they come from (direct, derived or aggregated); `adapter.get_columns_in_relation`, `dbt_utils.star`, `is_incremental()` and the like are answered from catalog.json or the profile's DuckDB or SQLite file, and an incremental model shows both of its renders
- Airflow DAGs are read from Airflow's own database too, when an airflow.db is reachable: a factory's DAGs, a mapped task's instances, the rendered SQL and commands, and each task's last state
- a Postgres table in a pipeline opens its columns and first 100 rows, read only; you sign in once and the credentials stay in the keychain

## v0.9.10  —  2026-10-19
- new file types: Excel 97–2003 `.xls` as a sheet with SQL per sheet; compressed tables (`.csv.gz`, `.zst`, `.bz2` …) as their table with SQL; NumPy `.npy` as its rows or its picture and `.npz` as a folder of them; safetensors and GGUF as a table of their metadata and tensors, read in place however large; Stata `.dta`; SQLite under its other names (GeoPackage with its geometry as WKT, MBTiles, `.db3` …); STL models drawn in 3D; DXF drawings drawn as a DWG is; TGA images
- corners are continuous (a squircle, no kink where the curve meets the side) in the app and in Chrome; Safari and Firefox keep round ones
- search results are grouped under their folder
- tables: wider columns with a divider you drag, row numbers, arrow keys on the header row, the number of rows in the footer
- the side bar starts 300 px wide, and in the browser it keeps the width you give it
- finding a word in a text file keeps its folded regions folded and marks the line found
- scrollbars show while the pointer is over the box or it scrolls, not because the focus is inside it

## v0.9.9  —  2026-10-19
- what you read can be selected and copied: a file's content, a message, a warning, an error, a description; buttons, labels, names in the tree and the tabs, icons and menus are not, so a click on them never starts a selection
- a table in a document or a slide gives each column room for its longest word and wraps the rest, instead of running past the page; Chinese and Japanese text wraps between its characters

## v0.9.8  —  2026-10-19
- Airflow DAGs and dbt projects open as one pipeline graph, tasks or data a toggle apart: a DAG file is read, never run; dbt models are rendered as `dbt compile` renders them; a table is matched across the tools by its database, schema and name, and a DuckDB or SQLite table opens its rows
- Check for Updates on a copy opened from the .dmg by a user who cannot write /Applications puts the new version in ~/Applications, or in a folder you choose
- notebooks opened in the browser (objectexplorer.com/app and the page `objectexplorer` serves) show their tables and errors again
- files an earlier install left in ~/.objectexplorer are moved to ~/.objectexplorer.bk without asking

## v0.9.7  —  2026-10-19
- Claude in a side bar right of the panes: Ask Claude… on a file or folder in the tree runs your own `claude` with your settings, asks before each tool it needs, and pops out into a tab of its own
- Explain in a text file's right-click menu: Claude explains the lines, with five around them, and reads nothing else
- Find Code Duplication in its own activity: CSS, JavaScript, JSX and C, with files to include and exclude, remote storage and a minimum number of lines; Refactor or Merge a copy with Claude
- References in the pane toolbar: under the caret's line, where a CSS class or id is used in HTML, JS and JSX, and where a JS, JSX or C name is used
- Search answers while you type and builds its index after; a row shows the line that matched; a folder that no longer exists is marked instead of stopping the search; fuzzy match, and several locations at once
- an animated GIF opens in a player: play, pause, step, a timeline with a preview on hover; edit it with drawings over a range of frames, trim, crop, flip and speed, and Save writes `<name>-edited.gif`
- slides: `<Popup label="…">…</Popup>` shows its text in a box on a click; presenting, a press and drag anywhere draws the laser, one trail per finger; the laser is a smooth, hand-drawn stroke
- the text view keeps a line's leading tabs, a drag selects several lines, and a copy leaves the line numbers out; a reload opens a file at the line it was at
- scrollbars show only while the pointer is over the box or the focus is in it
- Open in the Left Pane and Compare with the Left Pane (they said Side); `tour=off` on the command line or `?tour=off` in the address turns the onboarding tour off

## v0.9.6  —  2026-10-16
- Help: Report Bug with a Screenshot in the command palette: a picture of the window, an optional line on what went wrong, the version and the end of the app's log, sent encrypted so only we can read it
- Check for Updates works on a copy opened straight from the .dmg (it failed writing to /Volumes/ObjectExplorer): every update downloads into ~/.objectexplorer/update and only then replaces the app
- objectexplorer.com/app and the page `objectexplorer` serves have Share Anonymized for Debugging and Share Application Log too
- anonymizing says how far it is, "Anonymizing 37%", instead of "Anonymizing 1 of 1…"
- large Jupyter notebooks open about 20 times faster with a seventh of the memory: a 124 MB notebook in 40 ms instead of 760 ms; outputs are read as their cells scroll into view, and a broken spot costs only that value
- Microsoft Fabric notebooks no longer show the Spark StatementMeta line above a cell's printed output

## v0.9.5  —  2026-10-16
- Create Anonymized Copy in a file's menu: CSV, TSV, JSON, notebooks, SQLite, Parquet and Excel files, every value replaced by one of the same shape, so the copy keeps its size and structure and opens like the original; `oe anonymize <file>` on the command line
- Share Anonymized for Debugging sends such a copy, encrypted so only we can read it, to help us find a problem in your file; the command palette's Share Application Log for Debugging does the same for the app's log
- Developer: Open Application Log in the command palette: the app keeps its log in ~/.objectexplorer/app.log
- large notebooks scroll smoothly in the desktop app, and open at once
- Excel, CSV and every other grid scroll sideways, and the arrow keys, Home, End, Page Up and Page Down move a selected cell as in Excel
- the onboarding tour glides from step to step, forward and back, with no flicker
- objectexplorer.com/app keeps a folder you added for your next visit (Chrome, Edge)
- the demo folder stays up to date with objectexplorer.com's, and is there from the first start
- Power BI reports keep the data of their last refresh and open from it

## v0.9.4  —  2026-10-15
- Windows: AWS, and any site whose root certificate Windows has not fetched yet, connects (it failed with "not correctly signed by the trusted CA")
- signing in with Google works on a computer whose clock is off; Settings → Plan says so, with Fix system clock
- the installed app (npm, brew, the .dmg and .msix) opens with the demo folder, fetched once from objectexplorer.com
- Settings → Python installs uv with one button, and finds uv on Windows
- Sign-ins: each service is a tick, Refresh looks again for a CLI installed or a login made in a terminal; on Windows, gcloud's card links to Google's installation page; Sign in with Google stays gray until gcloud is there
- dialogs are no longer crossed by the side bar's divider
- a markdown file's front matter shows as foldable, coloured YAML; the player's controls are leaner

## v0.9.3  —  2026-10-15
- code blocks in documents scroll sideways instead of being cut off
- the macOS app runs on macOS 11 Big Sur and later
- the shader preview takes a picture of your own: click or drop one in to see the shader on it; colours are picked from a small swatch or typed as hex
- Apple Loops (.caf) and Apple Lossless audio play
- videos seek faster: playing from a point starts at the key frame before it
- in the page `objectexplorer` serves on a Mac, Add folder no longer freezes the browser; the dialog opens on the screen you are on
- a folder added that is also inside another added folder shows once, in its place, in the tree
- the AMR, VP9 and AAC decoders are rewritten from their reference sources

## v0.9.2  —  2026-10-15
- macOS downloads as a .dmg: drag ObjectExplorer to Applications
- Windows downloads as the .msix; Check for Updates installs the next one through App Installer
- JSON and YAML open laid out, coloured and foldable; one-object-per-line JSON stays a table
- C# is coloured and folds
- Find in Folder… searches inside one folder
- markdown with Slidev front matter opens as a slide deck, with themes; drawings in documents and slides take the laser directly
- the laser draws a clean trail, also in Present

## v0.9.1  —  2026-10-15
- starts on a small Linux machine with no swap (v0.9.0 stopped with "could not reserve memory")
- the Linux desktop window no longer crashes at start
- on Windows, the page `objectexplorer` serves opens files again
- objectexplorer.com/app: a zip opens as a folder, Delta, Hudi and Iceberg tables query, and every file of a folder you add opens (pictures, web pages, shaders, large CSVs)
- Blender: backups (`.blend1`) open as models, the scene Blender opens at is drawn with its collection instances, and a file with no mesh says so
- code with no spaces between tokens no longer overlaps; text sits centred in buttons on macOS
- flame graphs draw in the browser; on Windows, OBJ models find their materials and textures
- the usage disc is off until turned on in Settings → General

## v0.9.0  —  2026-10-14
- rebuilt on our own home-brewed development platform: one native binary is the desktop app, the command line and the server, with no Electron
- install with `brew install knockdata/tap/objectexplorer`, `npx @knockdata/objectexplorer`, or the desktop app for macOS, Windows and Linux
- Self hosting guide: your own domain, a certificate by http-01 or dns-01, sign-in with OIDC or SAML

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
