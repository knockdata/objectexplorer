# Microsoft OneLake

OneLake is the lake behind Microsoft Fabric. It is not a storage account, so there is no key,
connection string or SAS URL to paste: a Microsoft token is the only way in.

## Ways to connect

- **Sign in with Microsoft**, in **Settings → Sign-ins → Microsoft**. The sign-in happens inside the
  app, in your browser, and it is the same one [Azure Blob Storage](/storage/azure) uses — one
  sign-in serves both. Each has its own switch there, so either can be turned off.
- **An app registration**, for a machine with no person in front of it: set `AZURE_TENANT_ID`,
  `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET` before the app starts.
- **The Azure CLI.** If `az` is already signed in, its token is used.

You also need a Fabric workspace. Without one there is nothing to list: start a trial from the
account menu at [app.fabric.microsoft.com](https://app.fabric.microsoft.com).

## What lands in the tree

**Settings → Locations → OneLake** lists your workspaces. Open one to see its items — lakehouses,
warehouses and the rest — each with a tick; ticked is in the tree. The workspace's own tick takes
all its items at once.

Inside a workspace, every Fabric item is a folder named with its kind, and a lakehouse holds its
files and its tables:

```
sales.Lakehouse/
  Files/
  Tables/
    dbo/
      orders/
        _delta_log/
        part-00000-….snappy.parquet
```

Each file opens as it would from any bucket.

Next: [S3 compatible providers](/storage/s3-compatible).
