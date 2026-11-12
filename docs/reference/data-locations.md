# Where your data lives

Everything ObjectExplorer keeps for itself is in one folder, on every platform and in every
[shape](/self-hosting/) — the desktop app, the command line, a server:

```
~/.objectexplorer
```

On Windows that is `C:\Users\<you>\.objectexplorer`.

A server started with `data=<folder>` keeps all of it in that folder instead — see
[the data folder](/self-hosting/#the-data-folder).

Secrets are not in it. A key you typed, a sign-in's refresh token or an OIDC client secret goes to
the system keychain: the macOS keychain, the Windows Credential Manager, or the Secret Service on
Linux. The files below hold only a reference to it. On a Linux machine with no Secret Service, a
secret is a file under `account/keychain/` that only your user can read.

Nothing is written into the folders or buckets you browse unless you ask for it: a copy, a rename, a
file you save. A [delete](/explore/file-management) of a file on this machine goes to the system's
Trash; a delete in a cloud bucket moves the object into a `.trash` folder at the top of that root,
kept 30 days so it can be undone.

The folder has five parts, and the cache beside them: what you chose, who you are, what the app
remembers, what happened, and what you made or received.

| Where                              | What it holds                                                                                                                                                                                                                          |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `settings/locations.json`          | the cloud accounts, the [S3 compatible](/storage/s3-compatible) endpoints, the [FTP and SFTP](/storage/ftp) accounts and the local folders you added; every secret in it is a reference to the keychain                                |
| `settings/mcp.yaml`                | [the MCP rule file](/reference/mcp-rules) — roots, tools, limits and PII rules                                                                                                                                                         |
| `settings/onboarding.json`         | whether you have seen [the tour](/reference/tour), and which cards about new features                                                                                                                                                  |
| `settings/installed.json`          | the version that first used this folder                                                                                                                                                                                                |
| `settings/ask_providers.yaml`      | the list of programs **Ask…** can hand a file to, a newer copy fetched from objectexplorer.com than the one the app came with                                                                                                          |
| `settings/no_update_report`        | there when you turned the daily update report off — see [updating](/reference/updating)                                                                                                                                                |
| `settings/server.json`             | on a server: its [config](/self-hosting/#the-config-file) — sign-in, roots, certificates                                                                                                                                               |
| `account/trial`, `account/licence` | your plan                                                                                                                                                                                                                              |
| `account/known_hosts`              | the SFTP host keys and the FTPS certificates you trusted — see [FTP, FTPS and SFTP](/storage/ftp#is-the-server-the-one-you-meant)                                                                                                      |
| `account/mcp_key`                  | the key [PII rules](/agents/pii) encrypt and hash an agent's answers with; it never leaves the machine, and a share uses a key of its own                                                                                              |
| `account/certs/<domain>/`          | on a server: the certificate Let's Encrypt gave it, its key, and the account that got it                                                                                                                                               |
| `account/enterprise_trial`         | on a server: when its [trial](/self-hosting/#the-trial) started                                                                                                                                                                        |
| `data/explorer.db`                 | what the app remembers: the folders in the tree, settings, open tabs, each table's notebook, size history, the folders' last listings, how long each opening took, what each bucket is priced by, how often each cloud object was read |
| `data/features.db`                 | what is new in each release, and which of it has been used                                                                                                                                                                             |
| `data/style/`                      | the [writing tool](/analyze/writing)'s sources and their index                                                                                                                                                                         |
| `data/venvs/`                      | the [Python environments](/analyze/python) you made, one folder each, all of them made by uv                                                                                                                                           |
| `data/kernels/`                    | the [Node.js and Java](/analyze/kernels) projects notebook cells take their packages from                                                                                                                                              |
| `data/shell/`                      | the history every [shell](/explore/shell) of the app shares                                                                                                                                                                            |
| `data/mcp/vault.db`                | the real values behind the pseudonyms agents were sent, encrypted                                                                                                                                                                      |
| `data/web/`                        | on a server: what each signed-in browser user's app remembers, one database each                                                                                                                                                       |
| `log/app.log`                      | the app's log, every message it printed; `app.log.1` is the one before, once it passed 8 MB                                                                                                                                            |
| `log/replay/`                      | the [recordings](/reference/session-recording) of the last window sessions                                                                                                                                                             |
| `log/mcp/<agent>/`                 | the access log of every MCP call, one file per session — see [sessions](/agents/sessions)                                                                                                                                              |
| `log/live/`                        | the live [Cloud Logging](/analyze/logging) tails, one file per project                                                                                                                                                                 |
| `log/audit/`                       | on a server: the [audit log](/self-hosting/#the-audit-log), one file a day                                                                                                                                                             |
| `work/demo/`                       | the sample files the installed app shows in its tree, fetched from objectexplorer.com                                                                                                                                                  |
| `work/update/`                     | where [Check for Updates](/reference/updating) downloads a newer version before it replaces this one                                                                                                                                   |
| `cache/`                           | the copies of cloud objects you opened, page by page, one folder per provider, media converted to play, and BigQuery's table rows and kept answers — see [the cache](/explore/cache)                                                   |
| `cache/thumbnails/`                | the small pictures the grid shows of files                                                                                                                                                                                             |
| `cache/index/`                     | the index [search](/explore/search) reads, one per root                                                                                                                                                                                |
| `update/`                          | where an `npx` copy installs a newer version                                                                                                                                                                                           |
| `versions/`, `current`             | on a server: its installed versions, and the link to the one in use — see [updating a server](/self-hosting/#updating-an-enterprise-server)                                                                                            |

The cache can be moved: **Settings → Cache** picks another folder for it.

An earlier version kept all of these at the folder's top. The first start of a version from
2026-11-05 on moves each into its part, once; only where a file is changes, never what is in it.

In the browser, at objectexplorer.com/app, the same things are kept in the page's own storage
instead, and the folders you pick never leave it.

## Starting from an earlier install

On its first start, the desktop app looks for files an earlier ObjectExplorer left in this folder.
If it finds some, it moves them aside to `~/.objectexplorer.bk` and starts with an empty folder. It
does this once: nothing in `~/.objectexplorer.bk` is read again or deleted, so whatever you want from
it is still there.

## Deleting it

Removing `~/.objectexplorer` resets the app to a fresh install. Nothing in your storage is touched,
and the keychain keeps its entries until you remove them there.

Next: [updating](/reference/updating).
