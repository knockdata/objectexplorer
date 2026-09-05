# Release notes

What changed in each version. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links in the
[README](./README.md) always point at the newest one.

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
