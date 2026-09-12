# Release notes

What changed in each version. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links in the
[README](./README.md) always point at the newest one.

## v0.6.6 — 2026-09-12

- Every font, icon set and engine this app ships with now has its licence written down, in one `LICENSES.md` that travels with the app — in the npm package, inside the desktop binary, and served at `/LICENSES.md` by any of them
- The hand-drawn font in a drawing is Excalifont, under the SIL Open Font License, which asks that its text go wherever the font goes; that text is in `licenses/OFL-1.1.txt` now instead of nowhere
- The same file names the rest of what came from other people: Seti UI's file-type icons and DuckDB, both MIT; VS Code's codicons, CC BY 4.0; SQLite, which is in the public domain and asks for nothing
- Google's Cloud service icons are named there too, as what they are — Google's own marks, shown so a bucket looks like a bucket, and not ours to hand on under an open licence
- FFmpeg, the WebAssembly build that converts audio, is GPL-2.0-or-later, and its full text ships beside it: the one thing here that asks for more than a credit

## v0.6.5 — 2026-09-10

- A Google Drive, OneDrive or iCloud folder in streaming mode is a tree of placeholders — the row says 20 MB and not a byte of it is here — and the app tells the difference now
- ON DISK, a column beside SIZE, is what an object takes up on this machine rather than what it is
- It appears only where the bytes might not be here: a synced folder, and a bucket, whose objects are cached rather than stored — an ordinary local folder is neither, and the column stays away
- An object that is not here shows a download icon in that cell, and clicking it fetches that one file without opening it, the gesture Finder puts in the same place
- A folder never gets the icon: what is under it is the SIZE cell's question
- Opening an object the provider is still holding asks first, above 5 MB — under that it is simply fetched, because a prompt in front of a document is only a door to open twice
- The panel names the provider holding it and says how big it is, and a spinner runs until the bytes land
- iCloud hands a file over whole, in one step, so there is no percentage to report and the spinner is the entire answer; a provider that materialises progressively shows its bytes climbing instead
- Scanning a streaming folder no longer downloads it — reading a file's first 64 bytes to sniff what it is was enough to make the provider fetch the whole object, so that read is refused before it starts
- A mount takes the name Finder gives it: "iCloud Drive" and "Google Drive", not `com~apple~CloudDocs` or `GoogleDrive-someone@gmail.com`
- A folder inside a mount keeps its own name — that one you chose
- What each object has on disk is remembered, so a listing drawn from the database reads the same as one drawn from a fresh scan
- A file dragged in from the desktop no longer reports that it no longer exists on disk: it arrives carrying its own bytes, which is better proof than a lookup in the registry of folders you have opened
- A large PDF opens again — its decoded page images are bigger than the file they came from and were being copied to the window rather than handed to it, which a 20 MB document had no memory for
- A PDF over 5 MB is not read apart at all now: the pages on screen are drawn by the browser from the same bytes, and the parse only ever fed the extra modes
- The database this all lives in gains three columns and is built again from scratch, so the folders and cloud favourites you added are added back once

## v0.6.3 — 2026-09-10

- Spark in a python cell: install `pyspark`, and a session reads your objects by name with nothing to configure
- The name is the same URI a SQL cell is written with, in backticks — `:` and `/` are not characters an unquoted SQL name may hold
- The sign-in the app already has is reused, the object is cached once, and a format Spark has no reader for — `.sav`, `.sas7bdat`, `.xpt`, `.xlsx` — is converted to parquet first
- There is no cloud connector to set up, no key to hand Spark and no `spark.hadoop.*` line to write
- A name that is not one of ours is left alone, so your own tables, views and direct file reads behave exactly as they did
- Settings → Python grows two sliders once pyspark is in an environment: the cores a session may use, and the memory its driver may take
- Each slider runs the length of the machine and stops where the machine keeps something back — memory at three quarters, with the end of the track shaded
- A JVM's heap is fixed when it starts, which is before any `.config()` in your builder is read, so this is the one place the size can be set
- Every environment keeps its own `spark-defaults.conf`, and a terminal joins by pointing `SPARK_CONF_DIR` at it
- Stopping a kernel stops its Spark session; a JVM that has stopped answering is killed about eight seconds later
- Every JVM this app starts is named after its environment, so one found in `ps` is identifiable — and it is what the app checks before killing one
- A session whose JVM died is replaced on the next cell instead of handed back dead forever
- It needs a JDK 17 or 21, found wherever your package manager put it, including Homebrew's `openjdk`
- The ⓘ icon beside Run opens everything else about a python cell: which kernel and venv it ran on, what is in that namespace, and anything it printed
- The icon is struck through while the panel is shut, the way a crossed-out eye reads — there is something in there and you are not seeing it
- A cell whose last line is not a value — an assignment, an import, a bare `print` — draws nothing at all
- The venv picker is gone from the cell: a cell runs in whichever environment its kernel was started on
- A second kernel comes from `new kernel…` in the toolbar, which asks which environment only when there is more than one
- Settings → Python asks for a name and a version instead of listing every interpreter to read, and pyspark joins the one-click badges
- An agent's tools are this app's own routes now: `getObject` is what the window calls and what an agent calls, and `readObject` is gone
- The gate is the only thing that decides — behind it there is no second implementation of the app to keep in sync with the first
- A refusal says which step said no, on the line — `getObject: over size limit` — with the rule from the file on hover
- Hash, mask and FPE live in one place, so a share and an agent's answer are rewritten by the same code
- The share dialog's preview is the server's own answer, which is what the receiver will read; the browser holds no cipher at all
- Sanitization is a field of a request rather than a property of who is asking, so a program on this machine calling the local API is not an agent and is not held to `mcp.yaml`

## v0.6.2 — 2026-09-08

- An agent reaches every object now, not only the ones duckdb can read: a `.docx`, an `.excalidraw` and a `.png` all answer
- Every object is one of four things, sniffed from the object itself — tabular, textual, structure or raw
- `readObject` reads any of them: rows for a table, words for a document, the tree for a drawing, bytes for the rest
- `offset` and `limit` walk whichever of those it is — rows, lines or bytes — so a 2 GB file is read a window at a time
- `searchText` finds a pattern in one object, or in every textual object in one folder
- A `.docx` is read by the same parser the app's own viewer uses, so an agent gets the words rather than a zip
- `describeObject` and `listObjects` say what each object is, and a table is the only thing asked for columns
- What is sanitized follows what the object is: a table gets the column rules, a document gets the text rules, a tree and a blob get neither
- A tree is handed over untouched on purpose — a rewritten value in an `.excalidraw` is a file that no longer opens
- `maxObjectBytes` is checked against the file before it is opened, not against the answer after
- The MCP overlay: a green dot in the corner that lights when an agent calls, and opens the panel when clicked
- The panel groups the last three sessions oldest to newest, with the one being worked on expanded
- The activity strip is one hill per session, as tall as that session was busy
- Following opens the first object of a burst at once, and only the ones behind it wait

## v0.6.1 — 2026-09-07

- A notebook cell that runs Python, against a venv this app made and a kernel it keeps running
- The Python sees the same objects the rest of the app sees: `oe.path(uri)` downloads a cloud object and hands back a local path
- `oe.query(sql)` and `oe.frame(sql)` run through the same duckdb the SQL cells use, so a URI means one thing everywhere
- `oe.current` and `oe.uri()` name the object the cell was run from
- The last value is the answer — a DataFrame draws a grid, a matplotlib figure draws a PNG, and there is no `print` to write
- Rows from a python cell feed the cells below it, so a chart cell plots them with nothing written to a file in between
- One kernel is shared across notebooks by default; a second is started by naming one, and the cell says which it is on
- A kernel belongs to one venv — asking for it on another restarts it, and the cell says so out loud
- Which venv and kernel a notebook uses is remembered per object
- The toolbar lists what is in the kernel: name, type and a one-line summary
- Settings → Python finds every interpreter on this machine, and says so plainly when there is none
- Venvs are made by `uv` under `~/.objectexplorer/venvs`, and packages are installed from the pane
- Markdown has a filter box: type, and only the lines that match stay, with the hit marked

## v0.6.0 — 2026-09-06

- ObjectExplorer answers agents too: an MCP server for Claude Code, Codex and any client that speaks Streamable HTTP
- The agent never holds a credential and never talks to a provider — it asks the app, and the app decides
- Five tools: `listRoots`, `listObjects`, `describeObject`, `columnSummary` and `query`, ticked one by one
- Settings → MCP: the door, the endpoint, the token, and Copy Connection for a client the app cannot write to
- Install writes the entry into Claude Code's `~/.claude.json` or Codex's `~/.codex/config.toml`, so no token is typed anywhere
- Nothing is reachable until it is written down: `~/.objectexplorer/mcp.yaml`, and no file means the door is shut
- Allow roots is one tick per root, reachable in full; Deny rules is one list that holds in every root
- Approve rules stop a call and ask a person in the window — no answer within the timeout is a no
- Test a rule answers with the verdict and the content in the form it would go to the agent, reading nothing
- Settings → PII: hash, mask, FPE or drop, by column name for tabular data and by what a value says for free text
- FPE is the default — same length, same alphabet, a different value, so a query still joins and still counts
- Every rewritten column is marked `encrypted`, so an agent never quotes a made-up id back as a real one
- The share dialog opens on the PII rules, so a column decided once is decided everywhere
- Data access limits: rows and bytes per call, per session and per day, calls per minute, objects per listing
- Every call is written and flushed before the answer leaves — the rule that decided it, the rows, the bytes
- Observe opens what the agent opens, in the window, as it happens; Escape stops following
- The activity strip draws each agent's calls in its own colour, refusals on the same line
- Settings → MCP sessions lists every session, and a row opens it as a tab: the agent's own transcript beside what it reached
- Replay opens again, in order, everything an agent opened, with a step panel in the corner
- Log history keeps calls for 1D, 7D, 1M, 3M or 1Y

## v0.5.10 — 2026-09-05

- Microsoft Fabric OneLake is a connection of its own, with its workspaces in the side tree
- Keynote `.key` files open as slides; a `.key` holding a private key opens as text instead
- Text and hex read a file in windows, so a 2 GB csv opens at any line
- The line-number gutter widens to the numbers on screen instead of overlapping the text
- Query a spreadsheet with SQL — a sheet is read into a table duckdb can run against
- Settings → Cache shows what the cache holds and what the disk has, with a capacity you drag
- The cache evicts least-recently-used copies once it passes that capacity
- Clear Cache, and a per-provider breakdown of what is held
- Fixed: a plain text file was coloured as SQL — `user`, `by` and `case` drawn as keywords
- Fixed: a PNG sat hard left instead of centred like every other picture
- Fixed: a folder of parquet was queried as `*.ds_store` when a `.DS_Store` sat beside the data

## v0.5.9 — 2026-09-04

- Add any S3-compatible endpoint — MinIO, R2, Ceph — from a + on the Connections heading
- Connect tests the URL and the key pair by listing the endpoint's buckets
- A connection that fails keeps what you typed and shows what the endpoint said
- Key pair may be pasted inside the URL: `http://key:secret@localhost:9000`
- Tick a bucket on a connected endpoint to put it in the side tree
- Forget removes an endpoint, its key pair and its buckets

## v0.5.7 — 2026-09-04

- The Google Cloud dialog lists projects, with a filter box past ten
- A project that refuses says what Google said, and stays clickable
- Projects that worked last time are scanned first, and rows arrive as they are found
- All pages of a project's buckets are read, not only the first
- One rule list picks which reader a file opens in, for the pane and the grid tiles
- Unknown binary formats open as picture, audio or hex instead of decoded text
- Video containers are probed: a sound in a `.3gpp` plays as sound, unsupported codecs go through ffmpeg
- Fixed: `.mov`, `.mkv`, `.webm`, `.avi` and `.mpg` rendered as text
- Fixed: audio over 30 MB from a server played nothing
- Fixed: refresh on a service listing returned the cached answer

## v0.5.6 — 2026-09-03

- The app may be framed by objectexplorer.com, its GitHub Pages copy and localhost
- Video on the site seeks, and plays on iPhone

## v0.5.4 — 2026-09-03

- Share a table or a trained model as a link that opens in the app at objectexplorer.com/app
- Mask, Hash or FPE per column, chosen before anything is sent
- Preview shows three sampled rows as they are and as they go
- Link expiry of 1D, 1W, 1M, 3M or 1Y, plus Read and burn
- Copy URL, or Email
- A shared model carries LightGBM's text format, loadable in Python
- Column headers sit over their own values; the unused sort-arrow space is gone
- Fixed: a text coordinate column no longer breaks the grid

## v0.5.3 — 2026-09-02

- Copy, cut, paste, drag, rename and delete across local disks and all three clouds
- Drop in the same root moves, another root copies; ⌥ forces copy, ⌘ forces move
- Delete moves to `.trash`, emptied after 30 days
- ⌘Z takes back the last operation
- Rename on F2, with the extension left alone
- A name clash asks once — Keep both, Replace, Skip, Cancel — before a byte moves
- Copies within one provider run server-side and never touch this machine
- Shift for a range, ⌘ for one more, ⌘A for all; drag a band over empty space
- Copy name button on any row or card
- Σ in the SIZE cell counts a folder, cached in `meta.db` with a TTL you set
- Cloud folder sizes are priced by storage class, Glacier minimums included
- Sorting by SIZE compares folders and files together
- Show Cache Savings lists reads, cache hits, bytes pulled and what they cost
- Settings is one dialog: favourites, cloud sign-ins, About and Check for Updates as panes
- Grid zoom in five steps, per folder, on ⌘⇧= / ⌘⇧-
- Grid previews are laid-out documents; drag cards to keep an arrangement
- Fixed: the ACTIVITY sparkline emptied on cloud rows after a refresh
- Fixed: a visit drew a range instead of one point
- Fixed: a refresh that changed nothing looked like nothing happened
- Fixed: a build with no version claimed an upgrade was waiting

## v0.5.2 — 2026-08-30

- ⇧⌘P opens every command in the app, including the object's own context menu
- Preferences are commands: show deleted objects, show hidden files, cloud switches
- Open Dev Tools on all three desktop engines
- The license file is gone; each cloud is turned on from the palette
- Two levels per cloud: the whole provider, or storage alone
- One shape for every cloud sign-in: status, login, cancel, connect, revoke
- Revoke, in the dialog, states per cloud what it clears
- Google signs in with `gcloud auth login --update-adc`
- The dialog says whether the credentials file is there, and where it is written
- Check for Updates in the App menu and the palette
- Open Application Log puts the tail of `app.log` in a tab
- Share Application Log uploads the last 1000 lines and hands back a link
- Fixed: a refused listing emptied the pane instead of keeping stale children
- Fixed: the install card showed a command that could not run

## v0.5.1 — 2026-08-25

- A table opens as a notebook, with a `SELECT *` and a chart already written
- DuckDB queries the object where it lives: parquet, csv, tsv, json, jsonl, xlsx, avro, sav, sas7bdat, xpt
- ORC, Arrow and HDF5 open as grids and charts
- Delta, Iceberg, Hudi, Hive partitions and date prefixes read as one table
- Suggested charts come from the column statistics, and write their own source
- Five cell kinds: Table, Chart, Model, Code and Text
- Cells are piped from the nearest cell above that produced rows
- Notebooks are kept per object
- A model cell trains LightGBM in WebAssembly over those rows
- Label, task and feature columns are set up from the column statistics
- Leaves, learning rate and iterations are sliders that print their JavaScript
- Feature importance by gain, and a TreeSHAP waterfall for one row

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
