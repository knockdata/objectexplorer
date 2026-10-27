# Statistics

`sav` (SPSS), `xpt` and `sas7bdat` (SAS), `dta` (Stata), and R's `rds` `rdata` `rda`

<img src="/screenshot/statistics.png" alt="An SPSS .sav file opened as a table with column summaries">

The formats no cloud console will ever open, read here as tables: the variables, their labels, and
the rows — with the same [column summaries](/explore/column-summary) and the same
[SQL](/analyze/sql) as a parquet file.

That means a `.sav` from a survey and a `.parquet` from a warehouse join in one query, without
either of them being converted first.

An R file opens as its table: one object saved with `saveRDS`, or each object of a workspace saved
with `save`, compressed or not. No R, SPSS, SAS or Stata has to be installed.

Next: [science and machine learning](/formats/science).
