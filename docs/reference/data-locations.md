# Where your data lives

Everything ObjectExplorer keeps for itself is in one folder, on every platform and in every
[deployment](/reference/deployment) — the desktop app, the command line, a server:

```
~/.objectexplorer
```

On Windows that is `C:\Users\<you>\.objectexplorer`.

Secrets are not in it. A key you typed, a sign-in's refresh token or an OIDC client secret goes to
the system keychain: the macOS keychain, the Windows Credential Manager, or the Secret Service on
Linux. The files below hold only a reference to it. On a Linux machine with no Secret Service, a
secret is a file under `keychain/` that only your user can read.

Nothing is written into the folders or buckets you browse unless you ask for it: a copy, a rename, a
file you save. A [delete](/explore/file-management) of a file on this machine goes to the system's
Trash; a delete in a cloud bucket moves the object into a `.trash` folder at the top of that root,
kept 30 days so it can be undone.

|                        | What it holds                                                                                                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `explorer.db`          | what the app remembers: the folders in the tree, settings, open tabs, each table's notebook, size history, the folders' last listings, how long each opening took, what each bucket is priced by, how often each cloud object was read |
| `storage.json`         | the cloud accounts and the [S3 compatible](/storage/s3-compatible) endpoints you connected; every secret in it is a reference to the keychain                                                                                          |
| `cache/`               | the copies of cloud objects you opened, page by page, and media converted to play — see [the cache](/explore/cache)                                                                                                                    |
| `thumbnails/`          | the small pictures the grid shows of files                                                                                                                                                                                             |
| `index/`               | the index [search](/explore/search) reads, one per root                                                                                                                                                                                |
| `replay/`              | the [recordings](/reference/session-recording) of the last window sessions                                                                                                                                                             |
| `onboarding.json`      | whether you have seen [the tour](/reference/tour), and which cards about new features                                                                                                                                                  |
| `features.db`          | what is new in each release, and which of it has been used                                                                                                                                                                             |
| `installed.json`       | the version that first used this folder                                                                                                                                                                                                |
| `style/`               | the [writing tool](/analyze/writing)'s sources and their index                                                                                                                                                                         |
| `logs/`                | the live [Cloud Logging](/analyze/logging) tails, one file per project                                                                                                                                                                 |
| `mcp.yaml`             | [the MCP rule file](/reference/mcp-rules) — roots, tools, limits and PII rules                                                                                                                                                         |
| `mcp/key`              | the key [PII rules](/agents/pii) encrypt and hash an agent's answers with; it never leaves the machine, and a share uses a key of its own                                                                                              |
| `mcp/vault.db`         | the real values behind the pseudonyms agents were sent, encrypted                                                                                                                                                                      |
| `mcp/<agent>/`         | the access log of every MCP call, one file per session — see [sessions](/agents/sessions)                                                                                                                                              |
| `venvs/`               | the [Python environments](/analyze/python) you made, one folder each, all of them made by uv                                                                                                                                           |
| `trial`, `licence`     | your plan                                                                                                                                                                                                                              |
| `update/`              | where an `npx` copy puts a newer version it downloaded                                                                                                                                                                                 |
| `web/`                 | on a server: what each signed-in browser user's app remembers, one database each                                                                                                                                                       |
| `server.json`          | on a server: its [config](/reference/deployment#the-config-file) — sign-in, roots, certificates                                                                                                                                        |
| `certs/<domain>/`      | on a server: the certificate Let's Encrypt gave it, its key, and the account that got it                                                                                                                                               |
| `audit/`               | on a server: the [audit log](/reference/deployment#the-audit-log), one file a day                                                                                                                                                      |
| `versions/`, `current` | on a server: its installed versions, and the link to the one in use — see [updating a server](/reference/deployment#updating-an-enterprise-server)                                                                                     |
| `enterprise_trial`     | on a server: when its [trial](/reference/deployment#the-trial) started                                                                                                                                                                 |

In the browser, at objectexplorer.com/app, the same things are kept in the page's own storage
instead, and the folders you pick never leave it.

## Starting from an earlier install

On its first start, the desktop app looks for files an earlier ObjectExplorer left in this folder. If
it finds some, it asks before writing anything: move them aside to `~/.objectexplorer.bk`, or use the
folder as it is. It asks once.

## Deleting it

Removing `~/.objectexplorer` resets the app to a fresh install. Nothing in your storage is touched,
and the keychain keeps its entries until you remove them there.

Next: [updating](/reference/updating).
