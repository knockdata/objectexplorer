# Databases

`db` `sqlite` `sqlite3` `duckdb`

A SQLite or DuckDB file is a folder of tables. Step into it from the list and every table and view
is an entry; open one and it opens as a [notebook](/analyze/notebook) over its rows, in the same grid
as any other table.

A `.db` can be either, so the file's first bytes decide which it is, not its name. A SQLite file
lists its tables and views directly; a DuckDB file lists its schemas first, then the tables in each.

The app reads both formats itself, so neither SQLite nor DuckDB needs to be installed.

Next: [documents](/formats/documents).
