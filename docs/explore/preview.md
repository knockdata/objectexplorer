# Previewing an object

Open an object and it renders in place, with the viewer its format deserves — no download dialog, no
temporary file to clean up, no second application.

<img src="/screenshot/document.png" alt="A PDF rendered in the content pane">

Every reader runs on your machine, reading the bytes the provider streamed back into
[the cache](/explore/cache). On macOS and Linux a reader runs apart from the window, so a file that
crashes or hangs its reader fails its own tab, which says why, and nothing else.

## What decides the viewer

The bytes, and then the extension. A file with no extension, or a wrong one, is sniffed: the first
bytes decide, which is how a `.hoodie` folder is read as a Hudi timeline, a `.db` as SQLite or
DuckDB, and a `.hdr` as a texture rather than a text header. A zip is told apart by what it holds:
a Power BI report, a Word, Excel or PowerPoint file or an epub opens as that, and any other zip as a
folder. A PNG, JPEG, GIF, WebP or PDF with no extension opens as itself too.

## The toolbar

On the right of the breadcrumb: **Search** finds text in the view, then one icon for each way the
same object can be shown, then download, **Refresh** and the **…** menu.

|               |                                                                                            |
|---------------|--------------------------------------------------------------------------------------------|
| **View**      | the format's own viewer — a grid, a page, a picture, a model                               |
| **Table**     | the rows, where a format has them                                                          |
| **T**         | the text                                                                                   |
| **0x**        | the bytes — see [hex](/explore/hex)                                                        |
| **Structure** | the file's internal shape, where a format has one                                          |
| **Download**  | the file as it is, or ▾ for another format — see [download and convert](/explore/download) |
| **Refresh**   | reads it again                                                                             |
| **…**         | **Information** says what reads it; **Toggle Theme** switches this pane light or dark      |

The copy icon after the breadcrumb copies the file's path.

The status line under the view gives the size and the date.

A tabular object opens as its rows, in a grid with a [summary](/explore/column-summary) under each
column header; the icon beside **Table** opens the same rows as a [notebook](/analyze/notebook),
with a query above them. The share icon is at the right of the grid's header — see
[sharing a table](/explore/share). Whichever you pick last is how that file opens next time.

With no object open at all, the pane says what the app is for, with **Add a Folder…**, **Open the
Demo** and the files you opened last. **Settings → Appearance** can show
[where the storage went](/explore/usage) there instead.

Next: [column summaries](/explore/column-summary).
