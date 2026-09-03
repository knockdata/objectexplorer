<img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/assets/icon.png" width="96" alt="ObjectExplorer">

# ObjectExplorer

**The VSCode for Cloud Storage.** Explorer, Analyze and Machine Learning all in one App. 
GCS, Azure Blob, S3 and local folders in one window — and every byte stays on your machine.

[<img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/video/poster.jpg" width="800" alt="Forty seconds of ObjectExplorer">](https://objectexplorer.com)

🎬 *[Watch the 40-second tour](https://objectexplorer.com)* — it plays on the home page, with sound.

📖 **[Documentation](https://objectexplorer.com)** · 🚀 [Try it in a browser](https://objectexplorer.com/app)

## What it solves

A cloud console can list your objects and little else. To find out what is actually inside a
Parquet file you download it, open a notebook, read it, and delete the copy — for one look at one
file. Do that across three providers and you are also juggling three consoles, three sets of
credentials, and a `Downloads` folder full of data that should never have left the bucket.

ObjectExplorer collapses that loop:

- **One window for every provider.** S3, GCS, Azure Blob, MinIO and your local disks in the same
  tree, with the same keyboard shortcuts.
- **Preview instead of download.** Formats render in place — including the ones no console will ever
  open, like Parquet, SPSS and SAS.
- **Search across buckets.** One query over local folders and cloud prefixes at the same time.
- **Query, chart and model in place.** A table opens as a notebook: SQL over the object, a chart of
  what came back, and a gradient boosting model over the rows — all on your machine.
- **Delta, Iceberg and Hudi are just tables.** Point DuckDB at the folder and it answers, deletes
  and schema changes included.
- **Move things where they belong.** Copy, move, rename and delete across buckets and disks, with
  one Undo — the explorer half of a file explorer, not only the reading half.

## Your data never leaves your machine

ObjectExplorer is an HTTP server bound to `127.0.0.1` plus the OS webview, both inside the same
executable. Every parser — Parquet, SPSS, SAS, PDF, the office formats, the image decoders — runs
in a worker on your own machine.

Objects are fetched from your cloud provider to your computer and nowhere else; we run no backend
that sees your data, because there is nothing for it to see. Credentials stay local. The only call
that is not to your own storage is a version check against the npm registry.

Which also means there is no data-processing agreement to negotiate before anyone can look at a
bucket. → [the whole argument](https://objectexplorer.com/privacy)

## Install

Access it instantly at [objectexplorer.com/app](https://objectexplorer.com/app), or download the
latest version for your machine.

| Platform | Download |
|---|---|
| macOS, Apple Silicon | [ObjectExplorer-mac-arm64.dmg](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-mac-arm64.dmg) |
| macOS, Intel | [ObjectExplorer-mac-x64.dmg](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-mac-x64.dmg) |
| Windows, x64 | [ObjectExplorer-windows-x64.msix](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-windows-x64.msix) |
| Windows, ARM | [ObjectExplorer-windows-arm64.msix](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-windows-arm64.msix) |
| Linux, x64 | [ObjectExplorer-linux-x64.AppImage](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-linux-x64.AppImage) |
| Linux, ARM | [ObjectExplorer-linux-arm64.AppImage](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-linux-arm64.AppImage) |

Or run it with no install at all, if you have Node 20+:

```sh
npx @knockdata/objectexplorer
```

Per-platform notes — notarization, SmartScreen, the WebKitGTK package Linux needs — are in
[getting started](https://objectexplorer.com/getting-started), and the answers to the usual
snags are in [troubleshooting](https://objectexplorer.com/reference/troubleshooting).

## Storage

| | Provider | Connect with |
|---|---|---|
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/s3.svg" width="18"> | Amazon S3 | an `accessKeys.csv`, a key ID and secret, or the AWS CLI you already signed in to |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/gcs.svg" width="18"> | Google Cloud Storage | your Google account |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/cloud.svg" width="18"> | Azure Blob Storage | a connection string, a SAS URL, or your Microsoft account |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/minio.svg" width="18"> | MinIO | your own endpoint, for self-hosted S3-compatible storage |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/folder.svg" width="18"> | Local folders | the native folder picker — any disk, any mounted volume |

Buckets appear once you add them, so a thousand-bucket account still opens on the five you use.
→ [connecting storage](https://objectexplorer.com/storage/connect)

## Formats

| | | |
|---|---|---|
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/parquet.svg" width="18"> | Parquet | schema, rows and [column summaries](https://objectexplorer.com/explore/column-summary) |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/table.svg" width="18"> | Data lake | `delta` `iceberg` `hudi`, Hive and date partitions — a folder read as one table |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/table.svg" width="18"> | Tabular | `csv` `tsv` `json` `jsonl` `yaml` <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/avro.svg" width="18"> `avro` <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/orc.svg" width="18"> `orc` <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/arrow.svg" width="18"> `arrow` |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/ibm.svg" width="18"> <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/sas.svg" width="18"> | Statistics | `sav` (SPSS), `xpt` and `sas7bdat` (SAS) |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/powerpoint.svg" width="18"> <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/excel.svg" width="18"> <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/word.svg" width="18"> | Office | `pptx` `xlsx` `docx` and the rest, rendered without Office |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/file.svg" width="18"> | Documents | `pdf` page by page, <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/evernote.svg" width="18"> `evernote` notes |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/book.svg" width="18"> | Ebooks | `epub` `mobi` `azw3` `fb2` `cbz` — read as a book |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/image.svg" width="18"> | Images | `png` `jpg` `webp` `svg` — with EXIF, GPS and embedded text |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/music.svg" width="18"> <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/film.svg" width="18"> | Audio and video | played in place, `mp3` `wav` `m4a` `mp4` |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/archive.svg" width="18"> | Archives | `zip` `dmg` `apkg`, browsed as folders |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/jupyter.svg" width="18"> | Notebooks | `ipynb` with its outputs |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/log.svg" width="18"> | Logs | Cloud Logging and OpenTelemetry, live or exported |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/format/hex-mode.svg" width="18"> | Everything else | hex, always available |

The whole list is on [every format](https://objectexplorer.com/formats/).

## Features

| | | |
|---|---|---|
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/cloud.svg" width="18"> | [Connect storage](https://objectexplorer.com/storage/connect) | S3, GCS, Azure Blob, MinIO, local folders — added one root at a time |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/eye.svg" width="18"> | [Preview anything](https://objectexplorer.com/explore/preview) | every format above, rendered in place by a parser on your machine |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/chart.svg" width="18"> | [Column summaries](https://objectexplorer.com/explore/column-summary) | a histogram, a box plot or a split bar under every column header |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/notebook.svg" width="18"> | [Notebook](https://objectexplorer.com/analyze/notebook) | SQL, charts, models and JavaScript over the object you clicked |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/layers.svg" width="18"> | [Data lake tables](https://objectexplorer.com/analyze/lake) | Delta, Iceberg, Hudi and partitioned exports, read as one table |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/model.svg" width="18"> | [Models](https://objectexplorer.com/analyze/model) | LightGBM in WebAssembly, with exact TreeSHAP explanations |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/search.svg" width="18"> | [Search](https://objectexplorer.com/explore/search) | local folders and cloud prefixes in the same run |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/files.svg" width="18"> | [File management](https://objectexplorer.com/explore/file-management) | copy, move, rename, delete across providers, with a trash and an undo |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/share.svg" width="18"> | [Sharing](https://objectexplorer.com/explore/share) | a link to a table, masked or hashed column by column, with an expiry |
| <img src="https://raw.githubusercontent.com/knockdata/objectexplorer/main/docs/public/icon/log.svg" width="18"> | [Cloud Logging](https://objectexplorer.com/analyze/logging) | a live tail with a timeline, a source tree and a trace waterfall |

## Links

- [objectexplorer.com](https://objectexplorer.com) — the product page and the documentation
- [objectexplorer.com/app](https://objectexplorer.com/app) — the app itself, in a browser
- [@knockdata/objectexplorer](https://www.npmjs.com/package/@knockdata/objectexplorer) — the npm package behind `npx`
- [Changelog](./CHANGELOG.md) — what changed in each version
- [Releases](https://github.com/knockdata/objectexplorer/releases) — every version, every platform

Under the hood it is a single native binary: no Electron, no Chromium, just the OS webview (WebKit
on macOS and Linux, WebView2 on Windows) pointed at the HTTP server running inside the same
executable.
