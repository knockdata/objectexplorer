---
layout: home

hero:
  text: Stop downloading files just to look inside
  tagline: The VS Code for cloud storage — for you and for your agent. Explore, Analyze, Machine Learning all in one app, GCS, Azure Blob, S3, Local folder - and every byte stays on your machine.
  actions:
    - theme: brand
      text: Open it in the browser
      link: https://objectexplorer.com/app
      target: _self
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
  - title: Python, on the object where it lives
    details: A venv this app made, a kernel that keeps its variables, and `oe` in scope — so a cloud URI is a real path and a query is a DataFrame.
    link: /analyze/python
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>'
  - title: Delta, Iceberg and Hudi are just tables
    details: Name the folder in a query and it answers, deletes, schema evolution and merge-on-read included.
    link: /analyze/lake
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>'
  - title: Search across buckets
    details: One query over local folders and cloud prefixes at once, with include and exclude globs.
    link: /explore/search
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'
  - title: Your agent reads through the same door
    details: MCP for Claude Code and Codex — only the roots you ticked, PII rewritten on the way out, every call logged, watched live and replayable.
    link: /agents/
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>'
  - title: Your data never leaves your machine
    details: A local HTTP server and the OS webview in one binary. No backend sees your objects, because there is none.
    link: /privacy
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
---

<LiveApp />

## Not just a viewer

Found the object. Now do something with it — yourself, or with your agent.

### Python, where the data is

A **Python cell** in the same notebook as the SQL and the chart. Real pandas, in a real virtual
environment, in a kernel that keeps your variables between cells.

```python
frame = oe.frame(f"SELECT * FROM '{oe.uri()}'")
frame.groupby("region")["amount"].sum()
```

`oe` is in scope in every cell: a cloud URI is a real local path, a query is a DataFrame, and
nothing in the cell talks to a provider directly. Environments are made for you with `uv`, the
common packages are one click away, and there is no Jupyter server and no `.ipynb` to keep in sync.

→ [How the Python cell works](/analyze/python)

### Your agent, through the same door

Claude Code, Codex or any MCP client on your machine asks this app the questions the window asks —
and gets answers your rules decided.

```
Endpoint   http://127.0.0.1:7788/api/mcp
Token      7f2a1c4e9b8d3a6f5e0c2b7d4a9f1e83
```

One button installs that into the client's own config, so nobody types a token. The agent never
gets a credential and never talks to a provider. It reaches only the roots you ticked — `.env`,
`*.pem` and anything secret-shaped is denied everywhere — [PII is rewritten on the way
out](/agents/pii), and every call is logged, watched live in the window and
[replayable](/agents/sessions) afterwards.

→ [ObjectExplorer for agents](/agents/)

## Where to start

- **Never seen it** — [What is ObjectExplorer?](/what-is-objectexplorer)
- **Want it running** — [Getting started](/getting-started)
- **Have a bucket to connect** — [Connecting storage](/storage/connect)
- **Have a table to query** — [The notebook](/analyze/notebook)
- **Wanting pandas on it** — [Python](/analyze/python)
- **Wondering what leaves the machine** — [Your data stays here](/privacy)
- **Pointing an agent at a bucket** — [ObjectExplorer for agents](/agents/)