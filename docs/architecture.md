# How it works

ObjectExplorer is one program on your machine. It opens a window, or serves the same app to your
browser, and talks to your storage with your own credentials. There is no service of ours in the
middle.

<img src="/diagram/how-it-works.svg" alt="The window and any agent on your machine reach your storage through one program. It signs requests straight to S3, Cloud Storage, Azure and your disks, keeps what it remembers in ~/.objectexplorer, and calls out only for updates, the licence and large share links.">

## The pieces

|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **One executable**   | a single native binary, written in C with the app in JavaScript. No Electron, no Chromium, no Node. The desktop window, the command line and a server are the same file                                                                    |
| **The window**       | every view: the tree, the list, the notebook, the PDF reader, the 3D views. It is drawn on the GPU by the system's own API: Metal on macOS, Direct3D on Windows, Vulkan on Linux                                                           |
| **The readers**      | one per file format, written for this app. On macOS and Linux a reader runs in a copy of the process of its own, so a broken file or a reader that runs out of memory takes down that copy and never the window                            |
| **The command line** | `objectexplorer` in a terminal, npx or Homebrew is a server on `127.0.0.1:9421` that opens the app in your browser. Only this machine can reach it unless you say otherwise — see [deployment](/reference/deployment)                      |
| **Providers**        | one per kind of storage: S3 and S3 compatible, Cloud Storage, Azure Blob, OneLake, Google Drive, OneDrive, Dropbox, Box, local folders. Each signs its requests with the credentials you connected and sends them straight to the provider |
| **Query engines**    | SQL runs in the app's own engine, next to the file; Python cells run in environments uv made on this machine; models train in the app itself                                                                                               |
| **Media**            | pictures, sound and video are decoded by the system's own decoders; a file the system cannot play is converted once, on this machine, into the cache                                                                                       |
| **The rule gate**    | every call an [agent](/agents/) makes passes it: which roots it may reach, what is denied everywhere, what needs your approval, how much it may take                                                                                       |
| **PII rules**        | one set of rules, written once, applied to what an agent is sent and to what a [share link](/explore/share) carries — see [PII rules](/agents/pii)                                                                                         |
| **The cache**        | the parts of each cloud object you opened, so the second look costs nothing — see [the cache](/explore/cache)                                                                                                                              |

## Opening a file

<AppDemo open="folder/demo/ObjectExplorer/how-it-works.excalidraw" height="400px" image="/diagram/how-it-works.svg" alt="Opening a file: the cache or the provider, a reader, the view" />

1. You click a file. For a local file, the app reads it from your disk.
2. For a cloud object, it looks in the cache. The cache keeps the object's size and tag, and reads
   from the provider only the 64 KB pages a reader touches, so the listing of a large zip is a few
   pages, not the whole file. Each page is asked for with the tag the object was opened with; if the
   object changed in the meantime, the copy is dropped and the file opened again.
3. A reader works out what the file is, from its name and, when the name is not enough, from its
   first bytes, and reads it.
4. The view draws it. Nothing about the file's contents goes anywhere else.

A very large text file is read in windows rather than whole, so the app only ever holds what is on
screen.

In a browser, the page asks the server for the same thing, unless the file came from your own
machine through the browser: see [where a file is parsed](/reference/where-files-are-parsed).

## An agent's call

1. Claude Code, Codex or another MCP client on this machine calls `http://127.0.0.1:3417/mcp` with
   the token from Settings → MCP. It holds no cloud credential.
2. The rule gate decides: is this tool allowed, is the path in a ticked root, does a deny rule
   match, does it need your approval, is it inside the limits.
3. The call is written to the session's log **before** the answer goes back, allowed or denied.
4. The app reads the object the same way the window does, runs the query if there is one, and
   passes every row through the PII rules.
5. The answer goes back to the agent. If Observe is on, the window opens the same object.

## What is saved

Everything the app keeps is in `~/.objectexplorer` — the full list is in
[where your data lives](/reference/data-locations).

| Kept                                    | Where          | Holds your data?                                                                                                                    |
|-----------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------|
| The folders you listed                  | `explorer.db`  | names, sizes, dates, storage classes — not contents                                                                                 |
| Notebooks                               | `explorer.db`  | the code of each cell, never its results                                                                                            |
| How long each opening took              | `explorer.db`  | the path, the format, the time and the memory it took                                                                               |
| Cached copies of cloud objects          | `cache/`       | yes: the parts of objects you opened, up to the limit you set (10 GB by default), the least recently used dropped first             |
| The search index                        | `index/`       | yes, in part: the words found in each file                                                                                          |
| Every agent call                        | `mcp/<agent>/` | the tool, the path, the decision, the size of the answer — never the rows                                                           |
| Credentials                             | the keychain   | the system's own; `storage.json` holds only a reference                                                                             |
| The rules an agent is held to           | `mcp.yaml`     | your rules, including PII rules                                                                                                     |
| The key PII rules hash and encrypt with | `mcp/key`      | a secret; it never leaves the machine                                                                                               |
| Python environments                     | `venvs/`       | what you installed into them                                                                                                        |
| Window sessions                         | `replay/`      | yes: what you clicked and typed in the last sessions, kept to replay them — see [recording a session](/reference/session-recording) |

One thing is written outside that folder, into the storage you browse: **a delete in a cloud
bucket** moves the object into a `.trash` folder at the top of that root, kept for 30 days, so it
can be undone. A delete on this machine goes to the system's Trash. And of course anything you do on
purpose: a copy, a move, a rename, a file you save.

## What is not saved

- **Query results.** A notebook stores its code; the rows come back when a cell runs again.
- **What an agent was sent.** The log says what was asked and how much came back, not the rows.
- **Anything on a server of ours.** There is no upload. The only calls to objectexplorer.com are your
  licence and a share link too big to fit in its own URL; the update check goes to GitHub — the full
  list is in [your data stays here](/privacy).

## Deleting it all

Quit the app and remove `~/.objectexplorer`. The next start is a fresh install. Your storage is not
touched, except for the `.trash` folders above, which are yours to delete too.

Next: [getting started](/getting-started).
