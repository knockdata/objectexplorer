# Keyboard shortcuts

`⌘` is `Ctrl` on Windows and Linux.

## Anywhere

| Key   | What it does                                                                |
|-------|-----------------------------------------------------------------------------|
| `⌘P`  | quick open — jump to a file by name                                         |
| `⇧⌘P` | the command palette — every command the app has, by name                    |
| `⌘F`  | find, in a box over whatever the active side shows; `Esc` closes it         |
| `⇧⌘F` | [search](/explore/search) inside every file of the tree                     |
| `⌘B`  | show or hide the side bar                                                   |
| `⌘\`  | split: the active tab beside the other side                                 |
| `⌘W`  | close the active tab                                                        |
| `Esc` | close Settings or the side bar drawer; stop following an agent, or a replay |

In quick open and the command palette, `↑` `↓` pick and `Enter` runs. In quick open, `Tab` moves
into the file shown under the list and the list folds to a bar; `⇧Tab` brings it back, `Esc` closes
it.

The find box narrows what the view shows — the rows of a listing, the lines of a log. In a view that
can step through its hits, such as a text file or the [PDF reader](/formats/pdf), `Enter` goes to the
next one and `⇧Enter` back.

## The command palette

`⇧⌘P` lists every command by name, and a few words of it find one. Besides the keys above, it holds:

- **Help: Report Bug with a Screenshot** — a picture of the window, a line on what went wrong if you
  like, the version and the end of the app's log, sent encrypted so only we can read it;
- **Help: Share Application Log for Debugging** — the end of the app's log, sent the same way;
- **Shell Command: Install 'oe' command in PATH** — see [the command line](/reference/command-line);
- **Toggle Theme**, **Add Folder…**, **View: Hidden Objects**, **View: Deleted Objects**,
  **File: Copy Path** and **Reveal in Finder** (Show in File Explorer on Windows).

## Two sides

The window can show two things side by side. Right-click a tab to split, or press `⌘\`; drag the
divider between them to share the width. `⌘F` and the toolbar belong to whichever side you last
clicked.

## The tabs

Once a tab has the focus (press `Tab` until it does):

| Key             | What it does                     |
|-----------------|----------------------------------|
| `←` `→`         | the tab before or after          |
| `Home` `End`    | the first tab, the last one      |
| `Enter` `Space` | show the tab that has the focus  |
| `Delete`        | close the tab that has the focus |

## In the tree

| Key                 | What it does                                               |
|---------------------|------------------------------------------------------------|
| `↑` `↓`             | walk the rows                                              |
| `PageUp` `PageDown` | a screenful at a time                                      |
| `Home` `End`        | first row, last row                                        |
| `→`                 | open the selected folder                                   |
| `←`                 | close it, or step out to its parent                        |
| `Enter`             | open what is selected                                      |
| `F2`                | rename in place; `Enter` keeps the name, `Esc` leaves it   |
| `⌘C` `⌘X` `⌘V`      | copy, cut, paste — across roots and across providers       |
| `⌘Z`                | undo the last copy, move, rename or delete                 |
| `⌘D`                | duplicate: a copy beside the file                          |
| `⌥⌘C`               | copy the file's path                                       |
| `⇧⌥⌘C`              | copy its path relative to its root                         |
| `⌘⌫`                | move the file to the Trash (`Delete` on Windows and Linux) |

## In a listing and the grid

| Key                 | What it does                                                                                             |
|---------------------|----------------------------------------------------------------------------------------------------------|
| `↑` `↓`             | walk the rows, folders included; in the grid `←` `→` too                                                 |
| `⇧↑` `⇧↓`           | extend the selection                                                                                     |
| `PageUp` `PageDown` | a screenful at a time                                                                                    |
| `Home` `End`        | first row, last row                                                                                      |
| `→`                 | enter the selected folder (in the list)                                                                  |
| `←`                 | step out to the parent folder (in the list)                                                              |
| `Enter`             | open what is selected — the same as a double click                                                       |
| `F2`                | rename                                                                                                   |
| `⌘A`                | select everything in the folder                                                                          |
| `⌘C` `⌘X` `⌘V`      | copy, cut, paste — across roots and across providers                                                     |
| `⌘Z`                | undo the last copy, move, rename or delete                                                               |
| `⌘D` `⌥⌘C` `⇧⌥⌘C`   | duplicate, copy the path, copy the relative path                                                         |
| `⌫` or `Delete`     | delete: a file on this machine to the system's Trash, a cloud object to its root's `.trash`, asked first |
| `Esc`               | clear the selection                                                                                      |

`⌘Z` works while the tree, a listing or the grid has the focus, and remembers what this session did.
See [copy, move, rename, delete](/explore/file-management).

## In a table

A table — a CSV, a Parquet file, an Excel sheet, a query's answer — moves like a spreadsheet once you
click into it:

| Key                 | What it does                                                          |
|---------------------|-----------------------------------------------------------------------|
| `←` `→` `↑` `↓`     | move the selected cell; `↑` from the first row reaches the header row |
| `Enter` `Space`     | on a column's name: sort by it                                        |
| `Home` `End`        | the first column, the last one                                        |
| `⌘Home` `⌘End`      | the first cell, the last one                                          |
| `PageUp` `PageDown` | a screenful at a time, the cell kept where it is                      |
| `Esc`               | no cell selected                                                      |

A click on a column's name sorts by it; a click on the empty space of the header clears the filters.

## Writing Markdown

| Key        | What it does                  |
|------------|-------------------------------|
| `⌘S`       | save the file                 |
| `F8` `⇧F8` | the next flag, the one before |

## In a notebook

| Key                  | What it does |
|----------------------|--------------|
| `⇧Enter` or `⌘Enter` | run the cell |

## Dragging

In the tree, a drag **moves** a file or folder into the folder it is dropped on; holding `⌥` while
dropping **copies** it instead.

## In a 3D view

Once the view has focus:

| Key             | What it does                               |
|-----------------|--------------------------------------------|
| `←` `→` `↑` `↓` | rotate                                     |
| `⇧` + arrow     | pan                                        |
| `1` `3` `7`     | look at the front, the right side, the top |
| `9`             | look from the opposite side                |
| `0`             | isometric                                  |
| `F`             | fit the object back into the view          |
| `R`             | reset                                      |

The number keys work on the row above the letters and on the numpad alike.

The mouse, and the keys of a PDF, a drawing and a texture, are covered in
[moving around a view](/reference/view-controls).

Next: [dragging things in and around](/reference/drag-drop).
