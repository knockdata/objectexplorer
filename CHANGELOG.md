# Release notes

What changed in each version, and why. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links in the
[README](./README.md) always point at the newest one.

## v0.5.3 — 2026-09-02

**The explorer can change what it lists.** Copy, cut, paste, drag between roots, rename, delete —
across local disks and all three clouds, with one Undo that means it. And where a listing used to
only show what a provider said, it now says what a folder weighs, how often you read it, and what
holding a local copy has spared you.

### Copy, move, rename, delete

- **⌘C / ⌘X / ⌘V, and drag.** Drop a row on a folder in the same root and it moves; drop it in
  another root and it copies; ⌥ forces a copy and ⌘ forces a move. Dropping a folder on itself,
  or a row back into the folder it already sits in, is refused before you let go, so the row never
  lights up for a drop that would do nothing.
- **Delete is a move to `.trash`, never an unlink.** `<root>/.trash/<opId>/<original path>`, plus a
  manifest naming what went in — the same layout in a local folder and in a bucket, so Undo is a
  move back rather than a hope. Listings never show it. Anything older than 30 days is emptied at
  startup.
- **⌘Z takes back the last operation.** A copy is deleted, a move is moved back, and whatever an
  overwrite wrote over comes back with it. One step, not a stack: a second undo over a folder that
  has been listed and changed since is a promise nothing can keep.
- **Rename**, on F2 or the context menu, in the tree, the list and the grid. The dialog opens with
  the base name selected and the extension left alone. A name that is already taken is refused and
  said out loud — you typed that name, so being taken is an answer — while pasting into a folder
  something already sits in walks " copy", " copy 2" silently, because nobody typed those.
- **A clash in another folder asks once**, before a byte moves: Keep both, Replace, Skip, Cancel.
  Every destination is settled first, so the count the footer counts down from is the number of
  objects really going to move.
- **Between two providers the bytes stream through**, and the destination's size is read back
  before a move deletes its source. Within one provider they never touch this machine at all —
  GCS `rewriteTo`, S3 `x-amz-copy-source`, Azure `x-ms-copy-source`, `fsp.cp` on disk. A transfer
  answers with its id as soon as it has one and reports progress in the side footer, so an
  hour-long copy is not an hour-long fetch.
- **An edit says which folders it touched**, and every listing and tree node showing one of them
  reads itself again. A rename typed in the tree lands in the pane, and a delete made in the pane
  lands in the tree.

### Selecting

- **Shift for a range, ⌘ for one more, ⌘A for all** — one selection for the whole app, with a
  cursor the keyboard sits on and an anchor a shift-range stretches from.
- **Drag a band across the empty space** of a list or a grid and it picks everything it covers.
- **An action runs on what you meant.** A right click on a row inside the selection acts on the
  whole selection; on a row outside it, on that row alone. The footer says which — `2 selected ·
  2 files` — before you press Delete.
- **Copy name**, a button that appears on hovering any row or card, puts the leaf name on the real
  clipboard. The click never reaches the listing underneath, so copying a name does not select,
  open, or start a drag.

### What a folder weighs, and what it cost

- **Σ in the SIZE cell counts a folder.** Nothing is walked until you ask, and one ask counts every
  folder underneath — the walk had to visit them anyway — so clicking a root fills in the tree
  and the rows below stop offering. The answer is kept in `meta.db` and goes stale on a TTL you set
  (a minute by default); a refused walk leaves a red `–` that is itself the offer to try again.
- **On S3, GCS and Azure the number is what the prefix costs to keep**, not what it would weigh on
  a disk: the walk records the breakdown by storage class, and Glacier's 40 KiB-per-object minimum
  is priced in. Past 100000 keys the total reads as a lower bound rather than pretending.
- **Sorting by SIZE is one comparison for everything**, so a 4 GB folder sorts above a 2 GB file.
- **The ACTIVITY sparkline works on cloud rows again.** A refresh, a second page, or a listing past
  its TTL used to empty it — the provider's own items came back with no record attached. Now every
  child of every listing carries one, and a lone measurement is drawn as the arrival it is instead
  of a flat line.
- **A visit is one point, not a mountain range.** Measurements are collapsed into five-minute
  slots, so opening a folder and stepping back out no longer draws a range out of the two different
  sizes a folder has. Opening a bucket no longer counts as reading a file, either — one Azure
  container here had accrued 38430 seconds of "dwell" that way.
- **Show Cache Savings**, in the palette, is every bucket at once: reads, how many the local copy
  answered, what was pulled over the wire, what that spared you in egress and requests, and what it
  is worth at the published rates. The same figures for one object are in its info dialog. A cache
  hit is the absence of work and used to leave nothing behind; now it is a row.

### One Settings dialog

- **Everything that used to be its own modal is a pane in it** — Add a Favorite, the three cloud
  sign-ins, About, Check for Updates — picked from the list on the left. A pane never opens a
  dialog, so nothing stacks on top of anything, and a sign-in that fails while Settings is open
  moves the selection rather than opening a second window.
- **The nav says what is connected**: a spinner while a cloud is being probed, a tick once
  something answered, nothing at all when nobody is signed in. A pane you come back to shows what
  it was showing instead of probing and listing all over again, and one still waiting on a browser
  tab is called off when you leave it.

### The grid

- **Zoom**, five steps from 64 to 256 px, on the toolbar magnifiers or ⌘⇧= / ⌘⇧-, per folder.
- **Previews are documents, scaled** — a markdown, an html page or a notebook is laid out on a
  page and painted at the tile size, and a short one is scaled up until it reaches the bottom
  rather than stopping half way. A table preview carries 12 sampled rows and a text preview 20
  lines, so the bottom of a tile is never empty unless the file is.
- **Drag a card and the folder keeps that arrangement**; either sort arrow is also the tidy-up,
  dropping the custom positions and reflowing aligned. A folder nobody dragged, zoomed or sorted
  writes nothing to storage at all.

### Refresh

- **A refresh that changes nothing now shows that it happened.** The pane is emptied while the
  request is out and the answer is rendered when it lands, held to a 300 ms floor so a 30 ms reply
  still reads as a reply. The icon stops turning and the new view appears together.
- **A build with no version of its own says so** in Check for Updates, instead of claiming an
  upgrade is waiting.

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
