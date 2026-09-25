# What is ObjectExplorer?

ObjectExplorer is an explorer for cloud storage and local folders — for you, and for the agent working
beside you. It puts Amazon S3 and any [S3 compatible provider](/storage/s3-compatible), Google Cloud
Storage, Azure Blob Storage, Microsoft OneLake, the folders Dropbox, OneDrive, iCloud, Google Drive and
Box keep on your disk, and every other folder you have, in one tree — and opens what is inside them,
including the formats a cloud console will never render.

<img src="/screenshot/hero.png" alt="A folder of parquet, delta, SPSS and SAS files, with cloud buckets in the tree beside it">

The desktop app is able to install to Mac/Windows/Linux: It will have local HTTP server bound to `127.0.0.1` plus the operating system's own webview,
both inside the same executable. 
There is no Electron and no Chromium, and there is no server of ours anywhere in the path between you and your bucket.
Everything stay at the machine you run. 

It can also deploy on a server in enterprise setup. Refer to [deployment](/reference/deployment) for more detail

## How it fits together

<AppDemo name="fitsTogether" />

You and an agent ask the same local server, and only that server talks to your storage, with your
own credentials. What it remembers — names and sizes, column statistics, notebook code, cached
copies of cloud objects you opened, a log of every agent call — stays in `~/.objectexplorer` on
this machine. Query results and the rows an agent was sent are not kept at all. The whole picture,
including the two files it can write into your own folders, is in [how it works](/architecture).

## What it does

|                     |                                                                                                                                                                                                                  |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Explores**        | every provider in one tree, as a list or a grid of previews, with copy, move, rename, delete and an undo that works across buckets — see [the tree and the list](/explore/tree)                                  |
| **Previews**        | parquet, csv, json, SPSS, SAS, office files, images, audio, video, ebooks, databases, archives, and hex for everything else — see [formats](/formats/)                                                           |
| **Reads PDFs**      | in its own reader: select, find, bookmarks, thumbnails, and seven kinds of mark plus text notes of your own — see [the PDF reader](/formats/pdf)                                                                 |
| **Draws 3D**        | STEP, SolidWorks and CATIA parts, DWG drawings, glTF, FBX, Blender, obj and Unity models, GPU textures and live shaders — see [CAD](/formats/cad) and [3D models](/formats/models)                               |
| **Shows the bill**  | every bucket and folder on one disc: what each costs a month, what has gone cold, what is already on this machine, what nobody opens and what is being kept twice — see [where the storage went](/explore/usage) |
| **Cuts the bill**   | cheaper storage classes, one region, old versions and abandoned uploads, each priced, each a command you run — see [optimize](/explore/optimize)                                                                 |
| **Queries**         | DuckDB over the object where it lives, in a [notebook](/analyze/notebook) that opens with the query already written                                                                                              |
| **Reads tables**    | Delta, Iceberg and Hudi folders as one table, and their metadata as the history it is — see [data lake tables](/analyze/lake)                                                                                    |
| **Searches**        | local folders and cloud prefixes in the same run — see [search](/explore/search)                                                                                                                                 |
| **Trains**          | a gradient boosting model over the rows on screen, with SHAP explanations — see [models](/analyze/model)                                                                                                         |
| **Helps you write** | Markdown edited in place, with passages and phrases from writers you chose beside it, and never a score — see [writing](/analyze/writing)                                                                        |
| **Answers agents**  | the same questions over MCP, decided by rules you wrote, PII rewritten on the way out and every call logged — see [for agents](/agents/)                                                                         |

It has two ways in. One is the window. The other is [MCP](/agents/): Claude Code, Codex or any MCP
client on this machine asks the app instead of asking your storage — so it never holds a credential,
reaches only the roots you ticked, and leaves a record of every call it made.

## What it is not

It is not a sync client: nothing is mirrored to a folder on your disk behind your back. It is not a
web service: no account, no upload, no data-processing agreement. And it is not a viewer only — the
[file management](/explore/file-management) half is there, with a trash and an undo.

Next: [why it exists](/why-objectexplorer), [how it works](/architecture), or [install it](/getting-started).
