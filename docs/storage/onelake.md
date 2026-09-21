# Microsoft OneLake

OneLake is the lake behind Microsoft Fabric. It is not a storage account, so there is no key,
connection string or SAS URL to paste: a Microsoft sign-in is the only way in.

## Ways to connect

- **Sign in with Microsoft**, in **Settings → OneLake**. The sign-in happens inside the app, in your
  browser, and it is the same one [Azure Blob Storage](/storage/azure) uses — signing in to one signs
  you in to the other.
- **An app registration**, for a machine with no person in front of it: set `AZURE_TENANT_ID`,
  `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET` before the app starts.
- **The Azure CLI.** If `az` is already signed in, its token is used.

You also need a Fabric workspace. Without one there is nothing to list: start a trial from the
account menu at [app.fabric.microsoft.com](https://app.fabric.microsoft.com).

## What lands in the tree

A **workspace** is a root. Your personal *My workspace* is not listed — OneLake does not offer it
as a workspace.

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

A table under `Tables/` is a Delta table, so it opens and queries as one — see
[data lake tables](/analyze/lake).

## What you can change

Fabric owns the top three levels: the workspace, the item, and the item's own folders such as
`Files/` and `Tables/`. OneLake refuses to write there, so the app refuses first, and says why.
Below them, copy, move, rename and delete work as they do in any bucket — see
[copy, move, rename, delete](/explore/file-management).

## In SQL

A OneLake path is written the way Fabric writes it:

```sql
SELECT * FROM 'abfss://sales@onelake.dfs.fabric.microsoft.com/sales.Lakehouse/Files/orders.parquet'
```

## Cost

Fabric bills capacity, not bytes, so a OneLake row has no cost, storage class or region. The columns
stay empty rather than showing a number that is wrong.

Next: [MinIO](/storage/minio).
