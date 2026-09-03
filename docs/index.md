---
layout: home

hero:
  name: ObjectExplorer
  text: The VS Code for cloud storage
  tagline: Browse, preview, query and search S3, Google Cloud Storage, Azure Blob and local folders in one window — and every byte stays on your machine.
  image:
    src: /shot/hero.png
    alt: ObjectExplorer listing a folder of parquet, delta, SPSS and SAS files
  actions:
    - theme: brand
      text: Open it in the browser
      link: https://objectexplorer.com/app
    - theme: alt
      text: Get started
      link: /getting-started
    - theme: alt
      text: What is it?
      link: /what-is-objectexplorer
    - theme: alt
      text: GitHub
      link: https://github.com/knockdata/objectexplorer

features:
  - title: One window for every provider
    details: S3, GCS, Azure Blob, MinIO and your local disks in the same tree, with the same keyboard shortcuts.
    link: /storage/connect
  - title: Preview instead of download
    details: Parquet, SPSS, SAS, PDF, office files, ebooks, sprite sheets — rendered in place, by a parser running on your machine.
    link: /explore/preview
  - title: Query, chart and model in place
    details: A table opens as a notebook — SQL over the object, a chart of what came back, a gradient boosting model over the rows.
    link: /analyze/notebook
  - title: Delta, Iceberg and Hudi are just tables
    details: Name the folder in a query and it answers, deletes, schema evolution and merge-on-read included.
    link: /analyze/lake
  - title: Search across buckets
    details: One query over local folders and cloud prefixes at once, with include and exclude globs.
    link: /explore/search
  - title: Your data never leaves your machine
    details: A local HTTP server and the OS webview in one binary. No backend sees your objects, because there is none.
    link: /privacy
---

## Forty seconds of it

<video class="promo-video" controls playsinline loop poster="/video/poster.jpg">
	<source src="/video/objectexplorer.mp4" type="video/mp4">
</video>

## Where to start

| | |
|---|---|
| Never seen it | [What is ObjectExplorer?](/what-is-objectexplorer) |
| Want it running | [Getting started](/getting-started) |
| Have a bucket to connect | [Connecting storage](/storage/connect) |
| Have a table to query | [The notebook](/analyze/notebook) |
| Wondering what leaves the machine | [Your data stays here](/privacy) |
