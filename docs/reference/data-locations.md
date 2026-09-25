# Where your data lives

Everything ObjectExplorer keeps for itself is in one folder, on every platform and in every
[deployment](/reference/deployment) — the desktop app, `npx`, an enterprise server:

```
~/.objectexplorer
```

On Windows that is `C:\Users\<you>\.objectexplorer`.

Nothing is written into the folders or buckets you browse unless you ask for it: a copy, a rename, a
file you save, and the `.trash` folder a [delete](/explore/file-management) moves things into. The one
exception is [search](/explore/search): searching a local folder leaves an index, `.index.bin`, in
that folder, so the next search reads only what changed.

|                         | What it holds                                                                                                                                                                                                |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `meta.db`               | what the app remembers about what you have looked at: the roots you added, the object tree, size history, column statistics, notebooks, read counts — and the [writing tool](/analyze/writing)'s style index |
| `log.db`                | the [Cloud Logging](/analyze/logging) tail, so it survives a restart                                                                                                                                         |
| `search.db`             | the index [search](/explore/search) reads                                                                                                                                                                    |
| `connections.json`      | the credentials the app holds: a key you typed or dropped into a dialog, a Microsoft sign-in, what your AWS CLI exported. Every secret in it is encrypted with a key tied to this machine                    |
| `folders.json`          | your [S3 compatible](/storage/s3-compatible) endpoints                                                                                                                                                       |
| `mcp.yaml`              | [the MCP rule file](/reference/mcp-rules) — roots, tools, limits and PII rules                                                                                                                               |
| `mcp/key`               | the key [PII rules](/agents/pii) encrypt and hash an agent's answers with; it never leaves the machine, and a share uses a key of its own                                                                    |
| `mcp/<agent>/`          | the access log of every MCP call, one file per session — see [sessions](/agents/sessions)                                                                                                                    |
| `venvs/`                | the [Python environments](/analyze/python) you made, one folder each, all of them made by uv                                                                                                                 |
| `spark-conf/`           | the Spark settings written for each environment that has pyspark                                                                                                                                             |
| `duckdb/`               | the parquet a local file is converted to when SQL or Spark cannot read its own format                                                                                                                        |
| `gcs/` `s3/` `azure/` … | the cached copies of cloud objects you opened, one folder per provider — see [the cache](/explore/cache)                                                                                                     |
| `trial` `licence`       | your plan                                                                                                                                                                                                    |
| `app.log`               | what the app did, in order — the first thing to read when something is wrong                                                                                                                                 |
| `.app/`                 | the versions of the product the desktop app has downloaded for itself                                                                                                                                        |
| `.bin/`                 | the native parts of the desktop app, unpacked once per version                                                                                                                                               |
| `update/`               | where an `npx` install puts a newer version it downloaded                                                                                                                                                    |
| `versions/` `current`   | an [enterprise server](/reference/deployment#updating-an-enterprise-server)'s installed versions, and the link to the one in use                                                                             |
| `enterpriseTrial`       | when an enterprise server's [trial](/reference/deployment#the-trial) started                                                                                                                                 |
| `server.json`           | the deployment and settings the server was last started with, which the admin commands read                                                                                                                  |
| `acme/<domain>/`        | the certificate an [enterprise server](/reference/deployment#certificates) got from Let's Encrypt, its key, and the Let's Encrypt account that got it                                                        |

The notes you draw on a [PDF](/formats/pdf), and the layout you drag a [grid](/explore/tree#the-grid)
into, are kept in the browser's own storage instead.

## meta.db

The object tree is stored as ids and names, never as paths, which is why renaming a folder carries
its whole history with it — every size snapshot and column measurement stays attached to the thing
you have been watching.

There is no migration path between schema versions: when the shape changes, the database is deleted
and built again from what your providers say. The one thing that cannot be observed a second time is
the list of roots you added, so a schema change asks you to add them again.

## Deleting it

Removing `~/.objectexplorer` resets the app to a fresh install. Nothing in your storage is touched.

Next: [updating](/reference/updating).
