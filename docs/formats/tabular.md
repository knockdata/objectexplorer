# Tabular

`csv` `tsv` `psv` `json` `jsonl` `ndjson` `parquet` `avro` `orc` `arrow` `feather` `ipc`, a table
compressed whole (`csv.gz`, `json.zst`, `tsv.bz2`, `csv.lz4` …), and HDF5 and NetCDF as `h5` `hdf5`
`he5` `nc` `nc4` `cdf`

A csv, a tsv, JSON lines, a parquet or an orc file opens as its **table**: the rows in a virtualized
grid with [column summaries](/explore/column-summary), read a page at a time however large the file.
The **notebook** beside it is a `SELECT *` over the same rows, with a chart of what came back. The
other formats open in the [notebook](/analyze/notebook) straight away.

<img src="/screenshot/notebook-sql.png" alt="A parquet file opened as a notebook, the query above its rows">

Every one of these is queryable with [SQL](/analyze/sql), by the app's own engine: nothing is
loaded into a database first, and two files of different formats join in one query.

A csv is split on commas, a `.tsv` on tabs and a `.psv` on bars, and its first line names the
columns. A table compressed whole, the way a warehouse unloads it, opens as the table it holds; the
compressed stream is one view further along.

The grid's `#` header says how many rows are shown out of how many there are. Numbers line up on
their decimal point, cut to four decimals with the whole number on hover, and a latitude, longitude,
city or country says on hover which place it is and its local time.

## JSON

A `.json` file opens laid out: a member a line, coloured, every level folding, however long its
strings. JSON with comments (`.jsonc`), trailing commas and JSON5 are laid out the same, their
comments kept. A broken JSON opens as it was written, at the place where it goes wrong, underlined,
with a line under the text giving the line, the column and why.

A file of one object a line — `.jsonl`, `.ndjson`, or one named `.json` — is a table instead.

## Parquet

Parquet files of either page version open, the DELTA and BYTE_STREAM_SPLIT encodings among them,
compressed with Snappy, gzip, Zstandard, LZ4 (Hadoop's too), Brotli or LZO. Old `INT96` timestamps
and wide decimals read as the dates and numbers they are.

A workbook (`xlsx`, `xls`) opens a sheet at a time — see [documents](/formats/documents).

## HDF5 and NetCDF

An HDF5 or NetCDF file — NetCDF-4, which is HDF5 underneath, or the classic format — opens in the
same notebook, a row for each dataset or variable it holds: its path, type, shape, element count,
storage and filters, and its first values. **Structure** mode lays out how the file is put together.
Which of the two formats it is, the first bytes decide.

## Records and trees

Files that hold records in another shape open as their table, their text a click away:

| File                                     | A row for each               |
|------------------------------------------|------------------------------|
| Weka's `arff`, `ltsv`, fixed-width `fwf` | row                          |
| a browser's HTTP Archive, `har`          | request                      |
| a calendar `ics`, contacts `vcf`         | event, contact               |
| a packet capture, `pcap` `pcapng`        | packet                       |
| a web archive, `warc` `warc.gz`          | record                       |
| an LDAP export, `ldif`                   | entry                        |
| RDF: `ttl` `nt` `nq` `trig` `jsonld`     | triple                       |
| settings: `properties`, `.env`           | key, with its value and line |

Binary object trees — BSON, CBOR, MessagePack, Universal Binary JSON, Amazon Ion, bencode and
`.torrent` — and HOCON settings open as their JSON, laid out like a JSON file's, with their
records' table next. Protocol Buffers data (`.pb`) is read by the descriptor set (`.desc`) beside
it. A TOML file opens as its text, coloured, with its keys as a table.

Next: [statistics](/formats/statistics).
