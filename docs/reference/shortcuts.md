# Keyboard shortcuts

`⌘` is `Ctrl` on Windows and Linux.

## Anywhere

| Key   | What it does                                                                          |
|-------|---------------------------------------------------------------------------------------|
| `⌘P`  | quick open — jump to an object by name                                                |
| `⇧⌘P` | the command palette — every command the app has, by name                              |
| `⌘F`  | find, in a box over whatever the active side shows; `Esc` closes it                   |
| `⌘S`  | save what is on screen — a Markdown file you are [writing](/analyze/writing), for one |

In quick open and the command palette, `↑` `↓` pick and `Enter` runs.

The find box narrows what the view shows — the rows of a listing, the lines of a log. In a view that
can step through its hits, such as the [PDF reader](/formats/pdf), `Enter` goes to the next one and
`⇧Enter` back.

## Two sides

The window can show two things side by side. Right-click an object and choose **Open to the Left
Side** or **Open to the Right Side**; drag the divider between them to share the width. `⌘F` and
the toolbar belong to whichever side you last clicked.

## In a listing

| Key                 | What it does                                         |
|---------------------|------------------------------------------------------|
| `↑` `↓`             | walk the rows, folders included                      |
| `⇧↑` `⇧↓`           | extend the selection                                 |
| `PageUp` `PageDown` | a screenful at a time                                |
| `Home` `End`        | first row, last row                                  |
| `→`                 | enter the selected folder                            |
| `←`                 | step out to the parent folder                        |
| `Enter`             | open what is selected — the same as a double click   |
| `⌘A`                | select everything in the folder                      |
| `⌘C` `⌘X` `⌘V`      | copy, cut, paste — across roots and across providers |
| `⌘Z`                | undo the last copy, move, rename or delete           |
| `F2`                | rename                                               |
| `⌫` or `Delete`     | delete into the root's `.trash`                      |
| `Esc`               | clear the selection                                  |

## In the grid

| Key         | What it does            |
|-------------|-------------------------|
| `⇧⌘+` `⇧⌘−` | larger or smaller tiles |
| `F2`        | rename                  |
| `⌘Z`        | undo                    |
| `Esc`       | clear the selection     |

## Writing Markdown

| Key        | What it does                  |
|------------|-------------------------------|
| `⌘S`       | save the file                 |
| `F8` `⇧F8` | the next flag, the one before |

## In a notebook

| Key                             | What it does    |
|---------------------------------|-----------------|
| `⇧Enter`                        | run the cell    |
| `⇧Enter` in the prediction code | predict one row |

## Dragging

Within a root, a drag **moves**. Across roots, it **copies**. Holding `⌥` or `⌘` while dropping says
which one explicitly.

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

The mouse, and the keys of a PDF, a drawing and a texture, are covered in
[moving around a view](/reference/view-controls).

Next: [dragging things in and around](/reference/drag-drop).
