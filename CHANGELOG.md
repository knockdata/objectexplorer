# Release notes

What changed in each version, and why. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links in the
[README](./README.md) always point at the newest one.

## v0.5.9 — 2026-09-04

**Any S3 you have, not only Amazon's.** A MinIO on the laptop, a MinIO in a lab, an R2 bucket, a
Ceph gateway: give it a name and a URL and its buckets are in the side tree beside everything
else. Nothing about it is Amazon-shaped — it is the endpoint you typed and the key pair that
opens it.

### Custom S3 connections

- **A + on the Connections heading in Settings** adds one: Name, Description, URL, and a key pair
  that may be left empty. There is no Save — **Connect** asks the endpoint for its buckets, which
  is the only honest test of the URL and the key at the same time, and a connection is kept only
  once it has answered.
- **An endpoint that refuses says what it said.** The fields stay open with what was typed in
  them and the endpoint's own words sit under the button, so a corrected URL is one click away.
  Nothing is written down until it works, so a typo leaves nothing behind.
- **The key pair may live in the URL.** `http://key:secret@localhost:9000` is one field instead of
  three, which is how an S3-compatible endpoint is usually pasted. What is kept is the endpoint
  alone; the secret goes to the credential store, encrypted, and is never handed back to the app.
- **A connection that answered collapses to one line and lists its buckets**, each with the same
  tick every other service uses to put a bucket in the side tree. It gets a row of its own under
  Connections, named after itself, and Connect stays on it — reconnecting is how it is checked,
  and retyping a rotated secret is how it is repaired.
- **Forget takes it away.** The endpoint, the key pair and that connection's buckets leave
  together; nothing inside the buckets is touched, and connecting the same name again is the way
  back.
- **Every custom endpoint is one service.** A bucket's address carries the connection it is on —
  `minio-local.demo` — so two endpoints with a bucket of the same name stay two buckets, with
  their own caches and their own history.

## v0.5.7 — 2026-09-04

**A thousand projects, and a file that opens in something that can show it.** A Google account in
an organisation sees more projects than it can read, and the add dialog now lists them rather than
asking every one of them for its buckets. And a format no reader of ours names is a picture, a
sound or a wall of hex — whichever it actually is — instead of the same wall of decoded noise.

### Google Cloud projects

- **The dialog lists projects and asks one for its buckets when you open it.** Ten projects or
  fewer are opened and filled in at once, so a small account reads exactly as it did before there
  was a project layer. Past ten there is a filter box, and narrowing it to a handful loads those
  quietly — you asked to see fewer projects, not to open them.
- **A project that refuses is an answer, not a failure.** Most projects in an organisation do
  refuse. What Google said is kept with the project — a missing `storage.buckets.list` and a
  Storage API nobody enabled both read as an empty list otherwise — and shown on the row, so a
  project you expected to see says why it is not there. It stays clickable: the grant you just
  asked for may have landed.
- **What worked last time is walked first.** Each project's answer is remembered per service, so
  the buckets you actually have appear immediately and the long tail of refusals is walked behind
  them. A reopened dialog wears its locks before anything is asked again.
- **The scan says how far along it is.** Rows arrive as they are found rather than at the end, and
  the status counts — `Looking… 240 of 3000 projects` — because a minute of silence is
  indistinguishable from a dialog that has hung. A scan that fails part way keeps what it found,
  and what it learned.
- **A project with more buckets than one page holds is followed to the end.** Only the first page
  was ever read.

### Which reader a format opens in

- **One list of rules picks the reader**, top to bottom, first match wins, for the side pane and
  the grid tiles alike — and the app logs which rule fired, so what took effect is read rather
  than guessed at.
- **A format no reader names is no longer text.** It asks what the extension is: a picture opens
  as a picture — gif, bmp, tiff, avif — a sound as a player, and anything else binary as hex. A
  font, a film and a disk image used to be the same wall of decoded UTF-8. An extension nothing
  has ever heard of stays text, which is what a made-up suffix on a text file usually is.
- **A video container is not a promise of a picture.** `.3gpp` and `.mov` hold whatever was put in
  them, so the player asks the browser first: a real picture plays as video, a sound in a video
  container plays as sound, and a codec the browser has no reader for is converted with ffmpeg. A
  WhatsApp voice note — AMR-NB in `.3gpp`, which no browser decodes — comes back as playable
  audio. `.avi` and `.mpg` open as sound for the same reason: Chrome decodes neither container, so
  a blank `<video>` was all there ever was to show.

### Fixed

- **`.mov`, `.mkv`, `.webm`, `.avi` and `.mpg` rendered as text.** Anything the server holds
  missed the streaming branch entirely — the check for a local file answered `undefined` and was
  compared against `false`. `.mp4` escaped it only because it is named explicitly.
- **Audio over 30 MB from a server played nothing.** The player read the source the local branch
  sets; the server branch hands back a url.
- **A refreshed service listing asks the provider.** Refresh is now able to go past the cached
  listing rather than being handed the same answer back.

## v0.5.6 — 2026-09-03

**One site, with the app running inside it.** objectexplorer.com is the landing page, the
documentation and a live app on the same pages now, built from one place; the separate landing
build is gone.

- **The app may be framed by our own sites.** The domain itself, the same pages served from GitHub
  Pages, and localhost while they are being written — those three, and nothing else, may put the
  app in a frame, so a page can expand it in place instead of the app refusing to load. Every
  other site is still refused, which is what the header is for.
- **Video on our pages seeks, and plays on iPhone.** The static server announces `Accept-Ranges`
  and answers a range request with the slice it asked for. Safari will not play a video at all
  without that, so the tour was a still frame there.

## v0.5.4 — 2026-09-03

**A table can leave the machine now.** One share icon, one dialog, and a link that opens the rows —
or a model you just trained — in the app at objectexplorer.com/app, on a machine with none of your
storage, none of your accounts and nothing installed. What you hand over is decided column by
column before anything is sent.

### Sharing

- **The share icon is where the thing is**: in the side toolbar of anything showing rows, and in a
  cell's own toolbar, before Remove. A folder listing has none — a list of names is not something
  to hand somebody, and the object under it is.
- **Every column goes as it is until you say otherwise.** Beside each one: Mask, Hash or FPE.
  *Mask* covers a range of characters with `*` — one slider, a handle at each end, and the range
  names what is hidden, so dragging over a name covers what you drag over. *Hash* is SHA-1, so
  equal values stay equal and a hashed column still joins and still counts. *FPE* is
  format-preserving: a digit becomes a digit and a letter a letter of the same case, so a phone
  number still reads as a phone number and still validates. Its key is made when the dialog opens
  and never enters the link — `Copy key` is the only way it leaves your browser.
- **The preview is the app's own grid**, showing three rows sampled from the start, the middle and
  the end of the table — each one as it is and then as it goes, so what you are about to send is
  read rather than imagined.
- **A link lives for 1D, 1W, 1M, 3M or 1Y**, and *Read and burn* deletes it the moment somebody
  opens it. Small shares travel whole inside the link's fragment, which no server ever sees; bigger
  ones — and every burn — are stored under a name made of their expiry and their own digest, and
  swept when that expiry passes.
- **Copy URL, or Email**, which opens your own mail app with the link in it. Nothing pretends to
  know whether Teams or Slack is installed, because a page cannot.
- **A trained model shares as a model.** The payload carries LightGBM's own text format, so the
  receiver can predict with it here, or load it in Python with
  `lgb.Booster(model_str=…)` — without a single training row going with it.

### The grid

- **A column's name sits over its own values.** A column of numbers reads down its right edge, and
  its header is on that edge now; the space every header used to reserve for a sort arrow it was
  not drawing is gone.
- **A coordinate column no longer takes the grid down with it** when it holds text rather than a
  number — a masked latitude, or a csv whose latitudes read as text.

### Updating

- **Update and Restart are one button that changes as it goes**, and the app comes back on the
  version it just installed rather than the one it was started from.

### Fixed

- **The caret sits on the character it is on.** In the editor and the SQL cell above it, the drawn
  text and the text you type into are laid out by the same rules — tabs, and the characters html
  spells its own way, included.

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
