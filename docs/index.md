---
layout: home

hero:
  name: ObjectExplorer
  text: Stop downloading files just to look inside
  tagline: The VS Code for cloud storage. Browse, preview, query and search S3, Google Cloud Storage, Azure Blob and local folders in one window — and every byte stays on your machine.
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
      text: Documentation
      link: /what-is-objectexplorer
    - theme: alt
      text: GitHub
      link: https://github.com/knockdata/objectexplorer

features:
  - title: One window for every provider
    details: S3, GCS, Azure Blob, MinIO and your local disks in the same tree, with the same keyboard shortcuts.
    link: /storage/connect
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>'
  - title: Preview instead of download
    details: Parquet, SPSS, SAS, PDF, office files, ebooks, sprite sheets — rendered in place, by a parser running on your machine.
    link: /explore/preview
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
  - title: Query, chart and model in place
    details: A table opens as a notebook — SQL over the object, a chart of what came back, a gradient boosting model over the rows.
    link: /analyze/notebook
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>'
  - title: Delta, Iceberg and Hudi are just tables
    details: Name the folder in a query and it answers, deletes, schema evolution and merge-on-read included.
    link: /analyze/lake
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>'
  - title: Search across buckets
    details: One query over local folders and cloud prefixes at once, with include and exclude globs.
    link: /explore/search
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'
  - title: Your data never leaves your machine
    details: A local HTTP server and the OS webview in one binary. No backend sees your objects, because there is none.
    link: /privacy
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
---

## Try it right here

This is the app itself, running in the frame — the same build the desktop binary and `npx` run,
demonstrating itself. Click into it: the buckets are a public demo, and nothing you do in it leaves
your browser.

<iframe class="live-app" src="https://objectexplorer.com/app/?animate" title="ObjectExplorer running in the browser" loading="lazy" allow="midi; autoplay"></iframe>

Or [open it in its own tab](https://objectexplorer.com/app).

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
