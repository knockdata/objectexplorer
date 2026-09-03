# Azure Blob Storage

Azure has two planes, and telling them apart is what makes the sign-in painless:

- **Management plane** (ARM) enumerates which storage accounts exist under a subscription. It needs
  an Entra ID identity in an org tenant with RBAC.
- **Data plane** (`https://<account>.blob.core.windows.net`) lists containers and reads blobs of an
  account you name. It needs no tenant, no RBAC and no app registration.

An object explorer does not need the management plane. Name the account and ObjectExplorer goes
straight to the data plane — which is why the "account does not exist in tenant" errors that follow
a personal Microsoft account never appear on the default path.

## Ways to connect

- **A connection string** from the account's *Access keys*. It carries the account key, and requests
  are signed with the Shared Key scheme.
- **A SAS URL.** Paste it and the signature travels with each request.
- **Sign in with Microsoft**, if your account is in an org tenant and you want the account list.

Blob and Data Lake Gen2 are the same provider here: a Data Lake account is a storage account with a
hierarchical namespace, and the Blob endpoint reads both.

Next: [MinIO](/storage/minio).
