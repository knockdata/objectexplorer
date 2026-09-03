# Data lake tables

<img src="/shot/lake-table.png" alt="A Delta folder queried by its path, returning the current rows">

A Delta, Iceberg or Hudi table is a folder, and the folder itself says which of the parquet files
inside it the table is currently made of. So the path is the whole SQL surface — name the folder and
it answers:

```sql
SELECT region, sum(amount) FROM 's3://sales-eu/orders' GROUP BY region
```

There is no `delta_scan()` or `iceberg_scan()` to remember. A quoted path straight after `FROM` or
`JOIN` is sniffed — a `_delta_log` beside the files, a `metadata/` of metadata.json, a `.hoodie` —
and rewritten into the query that really reads it before DuckDB sees a character of it.

## As of now, not a pile of files

| | What it takes to be right |
|---|---|
| **Delta** | partition columns live in the log rather than in the parquet, column mapping names the physical columns by uuid, and a deletion vector marks rows inside a file that is otherwise live |
| **Iceberg** | schema evolution is resolved by field id, so a renamed column still reads and an added one reads as its default; position deletes, equality deletes and deletion vectors each become their own anti-join |
| **Hudi** | a merge-on-read slice stacks its base file under the log files written over it, and the last write of each record key wins |

A table with none of that — the common one — comes out as a single scan over a file list, which is
all it should ever have been.

Hive-partitioned exports and `YYYY/MM/DD` date prefixes read as one table the same way.

## The metadata is readable too

<img src="/shot/lake-metadata.png" alt="_delta_log opened as commit history: every version with the files it added and removed">

`_delta_log` opens as the commit history, every version with the files it added and removed
underneath it. `.hoodie` opens as the timeline, including the requested and inflight instants a
writer that died left behind. An Iceberg `metadata/` opens as the chain it really is —
metadata.json, snapshot, manifest list, manifest, and the data and delete files at the end of it.

Next: [Cloud Logging](/analyze/logging).
