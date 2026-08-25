# Release notes

What changed in each version, and why. Every build is on the
[releases page](https://github.com/knockdata/objectexplorer/releases); the download links in the
[README](./README.md) always point at the newest one.

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
