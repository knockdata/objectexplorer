# Databases

`db` `sqlite` `sqlite3` `db3` `s3db` `sl3` `sqlitedb` `gpkg` `mbtiles` `duckdb`, Berkeley DB, dBase
`dbf`, Access `mdb` `accdb`, Paradox `db`, Windows' ESE `edb`, LibreOffice Base `odb`, and FileMaker
`fmp12` `fp7`

A SQLite or DuckDB file is a folder of tables. Step into it from the list and every table and view
is an entry; open one and it opens as its rows, in the same grid as any other table, with a
[notebook](/analyze/notebook) a click away.

A `.db` can be either, or a Berkeley DB, so the file's first bytes decide which it is, not its name.
A SQLite file lists its tables and views directly; a DuckDB file lists its schemas first, then the
tables in each.

SQLite goes by many names, and each lists its tables the same way: an app's `.db3` or `.sqlitedb`; a
GeoPackage (`gpkg`), its geometry written out as text; map tiles (`mbtiles`). A GeoPackage and a
tileset open on their [map](/formats/maps) first, their tables next. A SQLite file with broken pages
is read as far as it goes, and one that stores its text as UTF-16 reads like any other. DuckDB files
from version 0.9 on are read.

| File                                                   | What opens                                      |
|--------------------------------------------------------|-------------------------------------------------|
| Berkeley DB                                            | its records, a row each                         |
| dBase, FoxPro, Clipper `dbf`                           | its rows, as a table — a shapefile's too        |
| Access `mdb` `accdb`                                   | its tables, listed as an SQLite file's are      |
| Paradox `db`                                           | its rows, as a table                            |
| ESE `edb`, and Windows' `SRUDB.dat`, `WebCacheV01.dat` | its tables, listed                              |
| LibreOffice Base `odb`                                 | the tables of its embedded HyperSQL or Firebird |
| FileMaker 7 and later `fmp12` `fp7`                    | its tables, listed, every value as text         |

A file of one table opens straight on it; a file of several lists them, and a double click opens one
on its **Table**, the notebook a click away. The notebook queries a table by its name after the
file's path: `SELECT * FROM 'office/orders.mdb/Customers'`.

An Access database of Access 97 (Jet 3) or later is read, and a Paradox table in its DOS code page;
an encrypted one of either is refused and says so. ESE (the Extensible Storage Engine) is the
database Windows keeps its own records in: Windows Search, the resource usage monitor, the web
cache. A Paradox table is named `.db` as an SQLite file is: its bytes tell them apart. A FileMaker
file of version 3 to 6, or one that is encrypted, says why it is not read.

The app reads all of these itself, so neither SQLite nor DuckDB needs to be installed.

Next: [documents](/formats/documents).
