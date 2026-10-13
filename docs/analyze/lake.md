# Data lake tables

<img src="/screenshot/lake-table.png" alt="A Delta folder queried by its path, returning the current rows">

A Delta, Iceberg or Hudi table is a folder, and the folder itself says which of the parquet files
inside it the table is currently made of. So the path is the whole SQL surface — name the folder and
it answers:

```sql
SELECT region, sum(amount) FROM 'warehouse/sales' GROUP BY region
```

There is no `delta_scan()` or `iceberg_scan()` to remember. The engine looks at a quoted folder — a
`_delta_log` beside the files, a `metadata/` of metadata.json, a `.hoodie` — and reads the files that
are the table now, not every file in the folder.

## As of now, not a pile of files

|             | What it takes to be right                                                                                                                                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Delta**   | the adds and removes are replayed in version order; partition columns live in the log rather than in the parquet, column mapping names the physical columns, and a deletion vector marks rows inside a file that is otherwise live |
| **Iceberg** | the newest metadata.json names the current snapshot, whose manifest list and manifests name the live data files; delete files are not applied yet                                                                                  |
| **Hudi**    | a merge-on-read slice stacks its base file under the log files written over it, and the last write of each record key wins                                                                                                         |

A table with none of that — the common one — comes out as a single scan over a file list, which is
all it should ever have been.

A folder laid out as `column=value` partitions reads as one table the same way, with the partition
columns taken from the folder names.

A lake table is read from a folder on this machine, or on the server you are connected to. Click
one in the tree and it opens as a notebook over its rows now, with its history as the next view.

## The metadata is readable too

<AppDemo open="folder/demo/lake/delta/sales/_delta_log/" height="360px" image="/screenshot/lake-metadata.png" alt="_delta_log opened as commit history: every version with the files it added and removed" />

<AppDemo open="folder/demo/lake/hudi/sales/.hoodie/" height="360px" image="/screenshot/lake-metadata.png" alt=".hoodie opened as the timeline of commits" />

<AppDemo open="folder/demo/lake/iceberg/sales/metadata/" height="360px" image="/screenshot/lake-metadata.png" alt="An Iceberg metadata folder opened as its chain of snapshots, manifests and files" />

`_delta_log` opens as the commit history, every version with the files it added and removed
underneath it. `.hoodie` opens as the timeline, including the requested and inflight instants a
writer that died left behind. An Iceberg `metadata/` opens as the chain it really is —
metadata.json, snapshot, manifest list, manifest, and the data and delete files at the end of it.

Next: [Cloud Logging](/analyze/logging).
