# Databases

`db` `sqlite` `sqlite3` `db3` `s3db` `sl3` `sqlitedb` `gpkg` `mbtiles` `duckdb`, Berkeley DB, dBase
`dbf`, and Access `mdb` `accdb`

A SQLite or DuckDB file is a folder of tables. Step into it from the list and every table and view
is an entry; open one and it opens as its rows, in the same grid as any other table, with a
[notebook](/analyze/notebook) a click away.

A `.db` can be either, or a Berkeley DB, so the file's first bytes decide which it is, not its name.
A SQLite file lists its tables and views directly; a DuckDB file lists its schemas first, then the
tables in each.

SQLite goes by many names, and each lists its tables the same way: a GeoPackage (`gpkg`), its
geometry written out as text; map tiles (`mbtiles`); an app's `.db3` or `.sqlitedb`. A SQLite file
with broken pages is read as far as it goes, and one that stores its text as UTF-16 reads like any
other. DuckDB files from version 0.9 on are read.

| File                         | What opens                                                       |
|------------------------------|------------------------------------------------------------------|
| Berkeley DB                  | its records, a row each                                          |
| dBase, FoxPro, Clipper `dbf` | its rows, as a table — a shapefile's too                         |
| Access `mdb` `accdb`         | how it is laid out: its pages and indexes, in **structure** mode |

The app reads all of these itself, so neither SQLite nor DuckDB needs to be installed.

Next: [documents](/formats/documents).
