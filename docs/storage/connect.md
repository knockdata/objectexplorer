# Connecting storage

<img src="/screenshot/settings.png" alt="Settings: the Accounts and Locations groups on the left, and the Google account with its two services ticked, Cloud Storage and BigQuery">

Open **Settings** from the activity bar. Two groups on the left do the work:

- **Accounts**: who the app signs in as — Google, Amazon Web Services, Microsoft, and each S3
  compatible endpoint you added. An account that is signed in carries a check. The **+** beside the
  group adds an S3 compatible endpoint.
- **Locations**: what can go in the tree — local folders, and the buckets, containers, projects and
  workspaces of each service that is on.

The **+** in the side bar's header, **Add a location**, is the short way: **Local Folder…** opens the
folder picker at once, and each cloud opens Settings on its Locations pane.

| Provider                                                                       | Connect with                                                                                               |
|--------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| <img src="/format/s3.svg" width="18"> [Amazon S3](/storage/s3)                 | whatever your AWS setup already has, an SSO or MFA sign-in in the app, or a pasted key or `accessKeys.csv` |
| <img src="/format/gcs.svg" width="18"> [Google Cloud Storage](/storage/gcs)    | Application Default Credentials, a Google sign-in through `gcloud`, or a service account key               |
| <img src="/format/cloud.svg" width="18"> [BigQuery](/storage/bigquery)         | the same Google sign-in Cloud Storage uses                                                                 |
| <img src="/format/cloud.svg" width="18"> [Azure Blob Storage](/storage/azure)  | a Microsoft sign-in in the app, a connection string or SAS URL, or the Azure CLI                           |
| <img src="/format/cloud.svg" width="18"> [Microsoft OneLake](/storage/onelake) | a Microsoft sign-in — the same one Azure Blob uses                                                         |
| <img src="/format/s3.svg" width="18"> [S3 compatible](/storage/s3-compatible)  | your own endpoint: R2, B2, Wasabi, MinIO and every other storage that speaks the S3 API                    |
| <img src="/format/folder.svg" width="18"> [Local folders](/storage/local)      | the folder picker — any disk, any mounted volume                                                           |
| <img src="/format/folder.svg" width="18"> [Google Drive](/storage/gdrive)      | the Drive API, signed in with OAuth on a server                                                            |
| <img src="/format/folder.svg" width="18"> [Dropbox](/storage/dropbox)          | the Dropbox API, signed in with OAuth on a server                                                          |
| <img src="/format/folder.svg" width="18"> [OneDrive](/storage/onedrive)        | Microsoft Graph, signed in with OAuth on a server; SharePoint libraries too                                |
| <img src="/format/folder.svg" width="18"> [Box](/storage/box)                  | the Box API, signed in with OAuth on a server                                                              |

Each account lists the services it opens, each with a tick: Google opens **Google Cloud Storage**
and **Google BigQuery**, Amazon Web Services opens **Amazon S3**, Microsoft opens **Azure Blob
Storage** and **Microsoft OneLake**. A service you untick leaves Locations and the app. **Refresh**
at the top of an account's pane looks again for a command line tool you installed or a sign-in you
made in a terminal since. Started with `cloud=off`, the app offers no cloud at all: the disk only.

## Roots, not accounts

What lands in the tree is a **root**: one bucket, one container, one folder. Under Locations each
bucket has a tick, and ticked is in the tree. You add the ones you work in, so a thousand-bucket
account still opens on the five you actually use. When an account may read a bucket but not list
it, type the bucket's name instead.

A local folder can be unchecked to take it out of the tree without forgetting it, and checked again
later.

The Free plan adds up to three cloud roots per provider and five local folders. Pro lifts both
caps; see [pricing](/pricing). A folder or bucket the plan had no room for waits, and is added by
itself once the plan changes, a trial or a licence, while the window stays open.

## A location that cannot be reached

A folder that is no longer there — moved, renamed, deleted, or on a disk that is not connected —
stays in the tree with an orange folder crossed out, and says so on hover. Opening it offers
**Retry**, **Locate…** to point at where it went, and **Remove from Explorer**, which takes it out of
the tree and leaves the folder itself alone. A cloud file that cannot be read says why, with
**Sign In** when the provider refused the sign-in.

## From the command line

`oe` does what the panes do, without a window:

```
oe signin aws                       an access key, read from the input or --file
oe signin google --browser          Sign in with Google, through gcloud
oe signin microsoft --browser       Sign in with Microsoft
oe signin s3 minio --endpoint http://localhost:9000
oe folder add s3://reports          a bucket or folder added to the tree
```

A key is never taken from the command line itself: type or paste it, or name a file. An open window
picks the change up.

## Who can add a connection

Signing in, adding a key and adding a root happen only on the machine the app runs on, or with `oe`.
When the app serves other people — a server they reach in their browser, or a desktop started with
`connect=<server address>` — their pages have no Accounts, and a remote signed-in user sees only the
roots the owner turned on in **Settings → Admin → Other machines**. A request counts as local only
when it comes from this machine and did not pass through a proxy; an ssh tunnel counts as local.
The keys stay on the server: a connected window reads the buckets without ever seeing them.

## Where the credentials go

What you add is saved in `storage.json` in the app's folder, and every secret in it — a key, a
token, a service account — goes to the system keychain (the macOS keychain, the Windows Credential
Manager, the Linux Secret Service), the file keeping only a reference. What your cloud's own tools
already hold stays where they keep it: an AWS SSO sign-in in `~/.aws`, a Google sign-in in
`gcloud`'s folder. See [where your data lives](/reference/data-locations).

Next: [Amazon S3](/storage/s3).
