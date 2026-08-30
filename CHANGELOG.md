# Release notes

What changed in each version, and why. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links in the
[README](./README.md) always point at the newest one.

## v0.5.2 — 2026-08-30

**Everything the app can do, in one list.** Press ⇧⌘P and the whole app answers: turn a cloud on,
open the log, check for updates, run what the object under the cursor offers. The clouds themselves
moved into that list too — the license file that used to decide which providers you got is gone, and
you switch them on yourself.

### The command palette

- **⇧⌘P opens every command**, in the frame Quick Open already uses: type to narrow, arrows to move,
  Enter to run. The list is built the moment it opens, so what it offers is what is true right now.
- **The object's own commands are in there.** Reveal in Finder, Open to the Right Side, Deploy to
  Cloud Run and the per-provider Create/Delete are read straight out of the context menu rather than
  written a second time — one place to add a command, two places to reach it.
- **Preferences are commands**: show deleted objects, show hidden files, and the cloud switches below.
- **Open Dev Tools**, on all three desktop engines. macOS gets a real click-through to the WKWebView
  inspector; Windows and Linux, which already have F12 and Ctrl+Shift+I, get told the key.

### Clouds you turn on yourself

- **The license file is gone.** `~/.objectexplorer` no longer holds a hand-written file that decided
  which providers this install offered. What replaced it is two commands per cloud in the palette.
- **Two levels, per provider.** *Enable Google Cloud* is the whole provider — one sign-in reaching
  Cloud Storage, Cloud Logging and BigQuery alike. *Enable Cloud Storage only* is that one service.
  The old file could not say this: one wide token made the entire file wide, for every cloud at once.
- **What each command says is read off the level it is in**, so the palette offers you the change
  rather than the setting — Disable, or step down to storage alone.
- **Turning one on opens the place it is added.** A cloud that is on shows nothing until a bucket is
  added, so the Add Favorite dialog follows the command; if it is already up, it re-reads its
  sections in place.
- **An install upgrading from the license file keeps its side panel.** A provider nobody has touched
  starts at whatever its catalog says — except where you already have favourites under its storage
  service, which start at storage alone rather than off.

### Signing in

- **One shape for every cloud.** Each provider now hands over the same five endpoints — status,
  login, cancel, connect, revoke — so AWS, Azure and Google differ only where the clouds themselves
  differ. Adding a cloud is writing that one object.
- **Revoke, in the dialog.** The connected panel has a second button that makes the server forget
  what it saved and drops back to the sign-in choices, both paths open again. What it clears is
  stated per cloud and stays honest: AWS drops the key this app saved and finds `~/.aws` again on the
  next probe; Azure clears the Microsoft sign-in *and* every kept account key or SAS, which is the
  only way to drop a stored key; Google forgets the pasted service account and the token minted from
  it.
- **Google signs in with `gcloud auth login --update-adc`** — one browser trip that both selects the
  account and writes Application Default Credentials, instead of the ADC-only command that left
  `gcloud auth print-access-token` reporting "no active account" forever afterwards.
- **The dialog says whether the credentials file is actually there**, and where it will be written,
  read from the server's own stat rather than inferred from a failed token exchange — a missing file
  and an expired refresh token no longer look the same.
- **A refused listing does not empty the pane.** 401 and 403 now travel with the cloud they came
  from, so the right dialog opens; the folder keeps the children it last saw, marked as possibly
  stale, and the call that failed is replayed past the cache once you are back in.
- **The install card no longer shows a command that cannot run.** A Windows without `curl.exe`, or a
  Mac without Homebrew, gets the vendor's download page and a note saying so, instead of a line that
  fails when pasted.

### Updates and bug reports

- **Check for Updates**, in the App menu and the palette. It asks the registry when it opens, and
  downloads only when you say so. The desktop app unpacks the new version beside the one it is
  serving and picks it up at launch, so it says "restart ObjectExplorer" rather than pretending
  something swapped underneath you. An `npx objectexplorer` install gets the one command that
  replaces it, ready to copy — npm owns those files, not us.
- **Open Application Log** puts the tail of `app.log` in a tab, as plain text, with its path, reload
  and copy — the file a bug report attaches, unreformatted so the copy still matches the file.
- **Share Application Log** uploads the last 1000 lines and hands back a link to quote in that
  report. The upload runs in the app's own backend, the endpoint is write-only, and a shared log is
  deleted after two weeks.

## v0.5.1 — 2026-08-25

**Every table is a notebook now.** Open a Parquet, CSV or JSON object and it opens as a column of
cells: the query with its grid, a chart of what came back, and — new in this release — a gradient
boosting model over the rows. All of it runs on your machine, against the object where it lives.

### Analytics

- **Open a table, get a notebook.** Two cells are already written when the file opens — a
  `SELECT *` over the object you clicked, and a chart of what that query returned. The file is
  queried and plotted before you have typed anything.
- **SQL against the object in its bucket.** DuckDB reads the object where it lives, so a `WHERE`
  over a multi-gigabyte Parquet file touches the row groups it needs and no more. Nothing is
  staged into a temporary folder, and nothing is sent anywhere.
  Readable: `parquet` `csv` `tsv` `json` `jsonl` `xlsx` `avro`, plus SPSS `.sav` and SAS
  `.sas7bdat` `.xpt`. ORC, Arrow and HDF5 open as grids and charts; the cell says when SQL over
  them is what is missing.
- **A folder is a table too.** Delta, Iceberg and Hudi tables, Hive-partitioned exports and
  `YYYY/MM/DD` date prefixes are read as one table rather than as a pile of files.
- **Charts that write their own first draft.** The column statistics say which column is a date,
  which is a category, which is a measure and which is an id that counts up once per row. The
  strip under the code offers the charts those columns actually support, named in plain words —
  click one and its source is written into the editor and drawn. Then it is source, and yours.
- **Five kinds of cell**: Table (SQL), Chart, Model, Code (JavaScript, with a pandas-style
  dataframe already in scope) and Text (markdown).
- **Cells are piped.** Each one reads the rows produced by the nearest cell above it that produced
  any, so a query narrows the data and the chart, the model and the next query all see what came
  back. Nothing re-runs on its own — a cell runs from its run button or Shift+Enter, so what is on
  screen is always something you asked for.
- **Notebooks are kept per object.** Reopen the file next week, in another window or after a
  restart, and your cells are still there.

### Machine learning

- **A model cell trains gradient boosting in the app** — LightGBM, compiled to WebAssembly — over
  the rows the cell above produced.
- **It sets itself up from the data.** Pick the label you want predicted and the rest comes from
  the same column statistics the grid draws: whether the question is *which one* or *how much*,
  which columns are worth training on, and which are row numbers, ids or coordinates that would
  teach the model the order the file was written in and nothing else.
- **The controls hide nothing.** Leaves, learning rate and iterations are three sliders, and
  moving one prints the JavaScript underneath it. That printed source is what trains, so a hand
  edit and a slider end in the same place.
- **What the model learned**, as the features ranked by their share of the total gain.
- **Why it said that about one row.** Pick a row and a waterfall walks from what the model says on
  average to what it said about that row, feature by feature. The contributions are TreeSHAP —
  exact and additive, so the steps add up to the prediction instead of approximating it. Both
  plots show the same features in the same order, so the pair reads across: what a column is worth
  over the whole file, and what it did to this row.
- **The data never moves.** Training happens in the page, so a model over a bucket you are not
  allowed to copy out of is still just a local read.

## Earlier versions

Notes before v0.5.1 were generated from the commit log; each version's page has its own.

| Version | Date | What it brought |
|---------|------------|--------------------------------------------------------|
| v0.5.0  | 2026-08-24 | the first build carrying the notebook |
| v0.4.7  | 2026-08-18 | data lake timelines, metadata on the tree |
| v0.4.6  | 2026-08-18 | Windows smoke-test fix |
| v0.4.3  | 2026-08-11 | ebook reader, Cloud Logging |
| v0.4.1  | 2026-08-05 | webview mode no longer opens a browser tab as well |
| v0.4.0  | 2026-08-05 | npm publishing over trusted publishing (OIDC) |
| v0.3.11 | 2026-08-01 | signed `.msix` packages for Windows |
