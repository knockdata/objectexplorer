# Tabular

`csv` `tsv` `json` `jsonl` `ndjson` `yaml` `yml` `parquet` `avro` `orc` `arrow` `feather` `ipc` `xlsx`,
and HDF5 and NetCDF as `h5` `hdf5` `he5` `nc` `nc4` `cdf`

A tabular object opens as a [notebook](/analyze/notebook): a `SELECT *` over it, the rows in a
virtualized grid with [column summaries](/explore/column-summary), and a chart of what came back.

<img src="/screenshot/notebook-sql.png" alt="A parquet file opened as a notebook, the query above its rows">

|                             |                                                                          |
|-----------------------------|--------------------------------------------------------------------------|
| **Queryable with SQL**      | `parquet` `csv` `tsv` `json` `jsonl` `xlsx` `avro`                       |
| **Grid and charts, no SQL** | `orc` `arrow` `feather` `h5` `nc` — the cell says so rather than failing |

A csv is sniffed for its delimiter and its header; a json file that holds an array of objects reads
as rows, and one that does not opens in the JSON viewer instead, virtualized so a large document
scrolls.

## HDF5 and NetCDF

An HDF5 or NetCDF file — NetCDF-4, which is HDF5 underneath, or the classic format — opens as the
list of datasets it holds, in the same notebook grid: each one's path, type, shape, element count,
storage and filters, and a preview of its values. **Structure** mode holds the decoded values. Which of the two
formats it is, the first bytes decide.

## In Finder, Explorer and the file manager

With the desktop app installed, a data file shows what is in it before it is opened: the row and
column count over its first rows, drawn as the file's thumbnail, and a page of those rows in the
system's own preview.

|             | Thumbnail                            | Preview                                          |
|-------------|--------------------------------------|--------------------------------------------------|
| **macOS**   | Finder icon, gallery and column view | the space bar, Finder's preview pane (macOS 12+) |
| **Windows** | Explorer's medium and large icons    | the preview pane, Alt+P                          |
| **Linux**   | Nautilus, Nemo, Caja, Thunar         | —                                                |

`parquet` `arrow` `feather` `ipc` `avro` `orc` and the statistics files `sas7bdat` `xpt` `sav` are
drawn; csv on linux too. A file larger than 64 MB keeps its icon, and so does every other type —
each one with its own mark on the page rather than a small app badge. The same drawing is one
command away: `oe thumbnail <file> <out.png> [size]`.

Next: [statistics](/formats/statistics).
