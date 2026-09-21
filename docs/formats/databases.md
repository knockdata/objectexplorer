# Databases

`db` `sqlite` `sqlite3` `duckdb`

A SQLite or DuckDB file is a folder of tables. Step into it from the list and every table and view
is an entry; open one and its rows arrive a page at a time, in the same grid as any other table, rather than the
whole database being read first.

A `.db` can be either, so the engine is decided by the file's first bytes rather than its name. A
SQLite file lists its tables and views directly; a DuckDB file lists its schemas first, then the
tables in each.

Both engines are built into the app, so nothing needs to be installed.

Next: [documents](/formats/documents).
