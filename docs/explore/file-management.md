# Copy, move, rename, delete

The other half of a file explorer. `⌘C` `⌘X` `⌘V`, `⌫` to delete and `⌘Z` to undo, in the tree,
the list and the grid; `F2` renames in the tree. Drag a file onto a folder of the tree to move it
there, and hold `⌥` to copy it instead.

## The right-click menu

A file's or a folder's menu is in groups, each under a line, and shows only what applies to it:

| Group             | Items                                                                                                                           |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Ask               | **Ask…** an assistant about it — Claude, ChatGPT, Gemini or one on this machine, as you set up in Settings                      |
| Open              | **Open in the Left Pane**, **Open in the Right Pane**, **Compare with the Left Pane** or the Right                              |
| New               | **New File…**, **New Folder…**, in a folder on this machine                                                                     |
| Find              | **Find in Folder…** — see [search](/explore/search) — and **Find Code Duplication**                                             |
| Edit              | **Cut**, **Copy**, **Paste**, **Undo**                                                                                          |
| Convert           | **Duplicate** (`⌘D`), **Convert To…** — see [download and convert](/explore/download) — and **Copy To…**                        |
| Path              | **Copy Path**, **Copy Relative Path**, **Reveal in Finder** (Show in File Explorer on Windows, Open Containing Folder on Linux) |
| Share             | **Create Anonymized Copy**, **Share Anonymized for Debugging** — see [anonymized copies](/explore/anonymize)                    |
| View              | **Collapse All**, **Expand All**, **Refresh**                                                                                   |
| Rename and remove | **Rename…** (`F2`), **Move to Trash** (Delete on Windows and in the cloud), **Remove Folder from Explorer**                     |

The keys beside an item work without opening the menu, while the tree, the list or the grid has the
focus.

## Across providers

It works across providers, and that is the part a console cannot do: a file cut from S3 and pasted
into an Azure container streams through your machine part by part and lands as an object, and a
local folder pasted into a bucket goes up file by file.

Within one provider the bytes never touch your machine at all — GCS `rewriteTo`, S3
`x-amz-copy-source`, Azure `x-ms-copy-source`, a plain copy on disk. A transfer reports its progress
at the foot of the sidebar, file by file and byte by byte, with **cancel** beside it, and a copy that
was cut short continues where it stopped when it is copied again.

## Delete, and undo

A delete on this disk goes to the system's Trash. A delete in the cloud asks first, then moves the
object into a `.trash` folder at the top of its own root, one folder per delete, so it is a move and
not a loss. That trash is emptied of anything older than 30 days on the next delete in that root.

`⌘Z` takes back the last copy, move, rename, paste or delete — the file comes back out of the Trash
or the `.trash`, and whatever a paste replaced comes back too. It works while the tree, the list or
the grid has the focus, and only for this session: after a restart, what was deleted is still in
the Trash or the `.trash`, to be fetched by hand.

## Conflicts

Pasting onto a name that exists asks, once, and the answer applies to the rest of the batch:
**Keep both** (the new one is named "name copy", then "name copy 2"), **Replace** (what was there
goes to the Trash first) or **Skip**. A file pasted into its own folder is a duplicate, named the
same way.

Next: [sharing a table](/explore/share).
