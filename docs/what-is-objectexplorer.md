# What is ObjectExplorer?

ObjectExplorer is a desktop file explorer for object storage. It puts Amazon S3, Google Cloud
Storage, Azure Blob Storage, MinIO and the folders on your own disks in one tree, and opens what is
inside them — including the formats a cloud console will never render.

<img src="/shot/hero.png" alt="A folder of parquet, delta, SPSS and SAS files, with cloud buckets in the tree beside it">

It is one native binary: an HTTP server bound to `127.0.0.1` plus the operating system's own webview,
both inside the same executable. There is no Electron and no Chromium, and there is no server of ours
anywhere in the path between you and your bucket.

## What it does

| | |
|---|---|
| **Explores** | every provider in one tree, with copy, move, rename, delete and an undo that works across buckets — see [the tree and the list](/explore/tree) |
| **Previews** | parquet, csv, json, SPSS, SAS, pdf, docx, pptx, xlsx, images, audio, video, ebooks, archives, and hex for everything else — see [formats](/formats/) |
| **Queries** | DuckDB over the object where it lives, in a [notebook](/analyze/notebook) that opens with the query already written |
| **Reads tables** | Delta, Iceberg and Hudi folders as one table, and their metadata as the history it is — see [data lake tables](/analyze/lake) |
| **Searches** | local folders and cloud prefixes in the same run — see [search](/explore/search) |
| **Trains** | a gradient boosting model over the rows on screen, with SHAP explanations — see [models](/analyze/model) |

## What it is not

It is not a sync client: nothing is mirrored to a folder on your disk behind your back. It is not a
web service: no account, no upload, no data-processing agreement. And it is not a viewer only — the
[file management](/explore/file-management) half is there, with a trash and an undo.

Next: [why it exists](/why-objectexplorer), or [install it](/getting-started).
