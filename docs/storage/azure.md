# Azure Blob Storage

Azure has two planes, and telling them apart is what makes the sign-in painless:

- **Management plane** (ARM) enumerates which storage accounts exist under your subscriptions. It
  needs a Microsoft sign-in.
- **Data plane** (`https://<account>.blob.core.windows.net`) lists containers and reads blobs of an
  account you name. A connection string or SAS URL is enough.

## Ways to connect

- **Sign in with Microsoft**, in **Settings → Sign-ins → Microsoft**. The sign-in happens inside the
  app — no CLI to install: your browser opens on Microsoft's page, with a link to click if it did
  not. It takes a work or school account, and the session is kept and refreshed so it stays
  signed in.
- **A connection string** from the account's *Access keys*, or **a SAS URL**. Paste it or drop it;
  it is checked by listing the account's containers before it is kept. Requests are then signed
  with the Shared Key scheme, or carry the SAS.
- **Use what this machine already has**: an app registration in `AZURE_TENANT_ID`,
  `AZURE_CLIENT_ID` and `AZURE_CLIENT_SECRET`, or the Azure CLI when `az` is signed in.

The app takes them in that order — a key or SAS for an account first, then the Microsoft sign-in,
the environment, the CLI — and **What was checked** in the pane lists each one.

## Storage accounts

**Settings → Locations → Blob Storage** lists the accounts the sign-in sees across your
subscriptions, and the ones you added by key. Open an account to list its containers, each with a
tick; the account's own tick puts them all in the tree or takes them all out.

An account that refuses the sign-in — you can see it but hold no data role on it — is read by its
account key instead, fetched through ARM, and the row says **via account key**. When a listing is
refused, a container can be added by its name.

Blob and Data Lake Gen2 are the same provider here: a Data Lake account is a storage account with a
hierarchical namespace, and the Blob endpoint reads both.

**Revoke** signs the Microsoft session out; the Azure CLI's own session stays, as `az logout` is
yours to run.

Next: [Microsoft OneLake](/storage/onelake).
