# Local folders

A folder on this machine is a root like any bucket: pick it with the native folder picker and it
appears in the tree, on any disk or mounted volume.

Local roots are what make the [copy and move](/explore/file-management) story complete — a prefix
dragged from S3 onto a local root streams through your machine and lands as files, and the other
direction works the same way.

## Streaming folders

Google Drive, OneDrive, Dropbox, Box and iCloud Drive can each keep a folder on your disk in which a
file is only a placeholder until something opens it. Add such a folder as a root and the app knows
which of its files are really here.

| System  | What is recognised as a streaming folder                                                 |
|---------|------------------------------------------------------------------------------------------|
| macOS   | every folder in `~/Library/CloudStorage`, and iCloud Drive                               |
| Windows | every folder a sync app registered with Windows — OneDrive, and the others that register |
| Linux   | none: the sync clients there keep whole copies, so every file is already on disk         |

Inside one, the list grows an **On disk** column: the bytes a file really takes on this machine, or a
cloud icon when the provider is holding it. Click the icon and that one file downloads, with a
spinner while it does.

Opening a placeholder makes the provider download the whole file, however little of it a view needs.
So a placeholder of 5 MB or more is not opened silently: the pane says which provider is holding it
and how big it is, with a **Download** button. A smaller one simply opens.

The same column shows on a cloud root, where it says how much of each object is already
[cached](/explore/cache) on this machine. An ordinary local folder does not show it — every byte is
already here.

See [Dropbox](/storage/dropbox), [OneDrive](/storage/onedrive) and [Box](/storage/box).

## The demo root

A fresh install starts with **demo**, a small folder of sample objects — parquet, Delta, Iceberg and
Hudi tables, csv, json, an SPSS `.sav` and a SAS `.xpt` — so there is something to open before you
have connected anything. Uncheck it in Settings when you no longer want it.

## Running on a folder

`npx @knockdata/objectexplorer ~/data` opens on that folder and adds it as a root, so the next start
finds it already there.

Next: [Dropbox](/storage/dropbox).
