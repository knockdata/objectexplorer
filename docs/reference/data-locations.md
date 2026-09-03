# Where your data lives

Everything ObjectExplorer keeps for itself is in one folder, on every platform and in every mode —
the desktop app, `npx`, the browser front door:

```
~/.objectexplorer
```

On Windows that is `C:\Users\<you>\.objectexplorer`.

Nothing is ever written into the folders or buckets you browse.

| | What it holds |
|---|---|
| `meta.db` | what the app remembers about what you have looked at: the roots you added, the object tree, size history, column statistics, notebooks, read counts |
| `log.db` | the [Cloud Logging](/analyze/logging) tail, so it survives a restart |
| `connections.json` | credentials you typed into a dialog rather than into your own CLI |
| `app.log` | what the app did, in order — the first thing to read when something is wrong |
| `.app/` | the versions of the product the app has downloaded for itself |
| provider folders | the cached copies of objects you opened, per provider |

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
