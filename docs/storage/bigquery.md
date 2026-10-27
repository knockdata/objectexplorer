# BigQuery

ObjectExplorer shows Google BigQuery in the tree as projects, datasets and tables, and reads it at
the least cost there is. BigQuery bills the bytes a query scans, not the rows it returns, while its
metadata and a table's stored rows are free to read. So browsing and opening a table cost nothing,
and a query is priced before it runs and runs only under a limit you set.

## Connecting

BigQuery uses the Google sign-in, the same one [Google Cloud Storage](/storage/gcs) uses: Application
Default Credentials, **Sign in with Google** through `gcloud`, or a service account key, in
**Settings → Accounts → Google**. The pane ticks **Google Cloud Storage** and **Google BigQuery**
apart, so either can be turned off.

**Settings → Locations → BigQuery** then lists the projects your account may use, each with a tick;
ticked is in the tree. A project you may use but that is not listed, such as
`bigquery-public-data`, is added by its id. **Queries run in** names the project a query is billed
to; left empty, it is `gcloud`'s project, else the one the credential belongs to. The same pane says
what this month's queries billed, and about how much that cost.

## In the tree

```
bq://                            the projects
bq://my-project                  its datasets
bq://my-project/sales            its tables and views
bq://my-project/sales/orders     a table
```

A table, a snapshot or a clone shows a table icon; a view, a materialized view or an external table
a view icon. Datasets are not watched for changes: **Refresh** in the right-click menu lists them
again.

## Opening a table

A table opens on a line of its facts — its type, how many rows, how much it stores, its location,
when it last changed, and what it is partitioned and clustered by — over its first 10,000 rows.
**Read 10,000 More** reads the next ones. Those rows are BigQuery's own listing of a table's stored
rows, which is free.

The rows read are kept on this machine with the time the table last changed. Opened again, the
table shows them at once, and asks BigQuery only whether it changed since; **Refresh** reads them
again.

A view, a materialized view or an external table keeps no rows of its own: only a query reads it.
It opens on its SQL, with **Query It**.

## A query

The **Query** tab starts on `SELECT * FROM project.dataset.table LIMIT 1000`. As you type, each
statement is checked by a dry run, which is free, and the line under it says what it would scan,
what it would bill and about how much that costs, at BigQuery's on-demand price of $6.25 a TiB
(a region's price may differ). BigQuery bills at least 10 MB for each table a query reads, and the
line says so when that minimum is what you pay.

A query runs only under its **Limit**, the most it may bill, 1 GiB unless you change it (about
$0.006). The limit goes with the query to BigQuery as well, so a query that would bill more never
runs: **Run** stays gray, and the line says to raise the limit or scan less.

Its answer shows the first 10,000 rows, what it billed and its job's id. The answer is kept on this
machine, by its SQL, the project it ran in, and when each table it read last changed. Asked again
while those tables are unchanged, it comes from the disk: free, with no job at all. BigQuery's own
cache, when it answers, is free too, and the line says which it was.

## Where it is kept

Everything BigQuery sent is in `~/.objectexplorer/cache/bigquery`: the rows of the tables you opened,
the answers of the queries you ran, and a line per query job with what it billed, which is what the
month's total in Settings adds up. **Clear Cache** in **Settings → Cache** removes it with the
rest of the cache, and the month's total starts again from nothing.

Next: [Azure Blob Storage](/storage/azure).
