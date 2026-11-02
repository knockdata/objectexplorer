# Statistics

`sav` `zsav` `por` (SPSS), `xpt` `xport` `sas7bdat` `cpt` (SAS), `dta` (Stata), R's `rds` `rdata`
`rda` `fst` `qs`, `mtw` `mtp` (Minitab), `syd` (Systat), `jmp` (JMP), `wf1` (EViews), `px`
(PC-Axis), `gdt` (gretl), and a pandas DataFrame pickled as `pkl` `pickle`

<img src="/screenshot/statistics.png" alt="An SPSS .sav file opened as a table with column summaries">

The formats no cloud console will ever open, read here as tables: the variables, their labels, and
the rows — with the same [column summaries](/explore/column-summary) and the same
[SQL](/analyze/sql) as a parquet file.

That means a `.sav` from a survey and a `.parquet` from a warehouse join in one query, without
either of them being converted first.

Each opens on its **Table**, the notebook after it. No R, SPSS, SAS, Stata, Minitab or Python has to
be installed.

| File                                                                | What is read                                      |
|---------------------------------------------------------------------|---------------------------------------------------|
| SPSS `sav`, compressed `zsav`, portable `por`                       | the cases, a value of a date format as a date     |
| SAS data set `sas7bdat`, transport `xpt` `xport`, CPORT `cpt` `ssp` | the observations                                  |
| Stata `dta`                                                         | the observations                                  |
| R: `saveRDS`'s `rds`, `save`'s `rdata` `rda`, `fst`, `qs`           | a data frame, or each object of a workspace       |
| Minitab worksheet `mtw` (up to release 13), portable `mtp`          | the columns, as the worksheet names them          |
| Systat `syd` (a `.sys` too)                                         | the variables                                     |
| JMP data table `jmp`, JMP 7 and later                               | the columns, dates and times as dates and times   |
| EViews workfile `wf1`, up to EViews 6                               | the series, each observation's date               |
| PC-Axis `px`, as statistics offices publish tables                  | a row a cell, a column a variable, then its value |
| gretl `gdt`, compressed or not                                      | the series                                        |
| a pandas DataFrame pickled `pkl` `pickle`                           | the frame's columns                               |

A missing value — Minitab's `*`, Systat's −1e36, EViews' `NA`, SAS's `.` — is empty. A pickle is
read as data: nothing it names is run. A `.pkl` that holds no DataFrame, or a `.por` of Portugol
source code, is not opened as a table.

An R file opens as its table: one object saved with `saveRDS`, or each object of a workspace saved
with `save`, compressed or not.

Next: [science and machine learning](/formats/science).
