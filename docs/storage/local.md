# Local folders

A folder on this machine is a root like any bucket: pick it with the native folder picker and it
appears in the tree, on any disk or mounted volume.

Local roots are what make the [copy and move](/explore/file-management) story complete — a prefix
dragged from S3 onto a local root streams through your machine and lands as files, and the other
direction works the same way.

## The demo root

A fresh install starts with **demo**, a small folder of sample objects — parquet, Delta, Iceberg and
Hudi tables, csv, json, an SPSS `.sav` and a SAS `.xpt` — so there is something to open before you
have connected anything. Uncheck it in Settings when you no longer want it.

## Running on a folder

`npx @knockdata/objectexplorer ~/data` opens on that folder and adds it as a root, so the next start
finds it already there.

Next: [the tree and the list](/explore/tree).
