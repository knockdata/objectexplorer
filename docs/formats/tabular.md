# Tabular

`csv` `tsv` `json` `jsonl` `yaml` `yml` `parquet` `avro` `orc` `arrow` `xlsx`

A tabular object opens as a [notebook](/analyze/notebook): a `SELECT *` over it, the rows in a
virtualized grid with [column summaries](/explore/column-summary), and a chart of what came back.

<img src="/shot/notebook-sql.png" alt="A parquet file opened as a notebook, the query above its rows">

| | |
|---|---|
| **Queryable with SQL** | `parquet` `csv` `tsv` `json` `jsonl` `xlsx` `avro` |
| **Grid and charts, no SQL** | `orc` `arrow` `h5` — the cell says so rather than failing |

A csv is sniffed for its delimiter and its header; a json file that holds an array of objects reads
as rows, and one that does not opens in the JSON viewer instead, virtualized so a large document
scrolls.

Next: [statistics](/formats/statistics).
