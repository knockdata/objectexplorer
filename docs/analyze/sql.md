# SQL

The engine is DuckDB, compiled into the app, reading the object where it lives.

```sql
SELECT region, count(*), sum(amount)
FROM 's3://sales-eu/orders/2026-08-24.parquet'
GROUP BY region
ORDER BY 2 DESC
```

A quoted path straight after `FROM` or `JOIN` is what names the data. It can be:

- an object in a bucket — `s3://`, `gs://`, `az://`, or a path in one of your roots;
- a folder that is a [Delta, Iceberg or Hudi table](/analyze/lake);
- a Hive-partitioned export, or a `YYYY/MM/DD` prefix;
- a local file.

## Nothing is staged

DuckDB reads the bucket directly, through the same signed requests the explorer uses, so a `WHERE`
over a multi-gigabyte Parquet file touches the row groups it needs and no more. There is no temporary
copy in a scratch folder and no upload anywhere.

## What is queryable

`parquet` `csv` `tsv` `json` `jsonl` `xlsx` `avro`, plus SPSS `.sav` and SAS `.sas7bdat` `.xpt`.

ORC, Arrow and HDF5 open as grids and charts too; only SQL over them is missing, and the cell says
so.

## Running

**Shift+Enter**, or the run button in the cell's toolbar. The cell's label says what came back — the
row count — and the grid under it is virtualized, so a million rows scroll rather than load.

Next: [charts](/analyze/charts).
