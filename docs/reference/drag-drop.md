# Dragging things in and around

You can drag a row from one folder into another, and you can drag a file or a folder in from your desktop.

While you drag, the pointer carries a line of words saying what letting go would do. Read that line and you never have to guess.

## What each drop does

| What you are dragging      | Onto a folder, or inside an open one | Onto the tree, below the folders | Onto an open file |
|----------------------------|--------------------------------------|----------------------------------|-------------------|
| rows from the same storage | Move here                            | —                                | —                 |
| rows from another storage  | Copy here                            | —                                | —                 |
| a file from your desktop   | Copy here                            | Open — not saved                 | Open — not saved  |
| a folder from your desktop | Copy folder here                     | Add favorite folder 📌            | Open — not saved  |

A folder is a folder anywhere it appears: a row in the list, a tile in the grid, a folder in the tree on the left, or a step of the path along the top. So is the folder you are standing in — let go anywhere in an open folder and the thing lands in that folder, because the listing is already open and what is missing from it is the thing in your hand.

## The two rules behind the table

**Anything from your desktop is only read.** A file you drag in is copied, opened, or remembered — never moved, never changed, never deleted. The original stays exactly where it was.

**Inside one storage a drag moves; across two it copies.** Dragging between two folders of the same bucket or the same drive moves the rows, the way it does everywhere else. Dragging from one storage to another copies them, because the two sides are different places and taking the original away is not what you meant.

Hold a key to override that:

| Key            | What the drag becomes |
|----------------|-----------------------|
| Option / Alt   | a copy                |
| Command / Ctrl | a move                |

## What is remembered

Only one drop outlives the session: a folder from your desktop dropped on the tree. That folder joins the tree and is still there next time you open the app — which is what the 📌 on the label is telling you.

Drop a folder anywhere else and it opens as a listing you can read and walk through, joins the tree for now, and is gone when you reload. That is what **Open — not saved** means for a folder: nothing about it is written down, so nothing about it comes back.

## Folders in the desktop app

In a browser, a folder you drag in is remembered as permission to read it, and the browser asks you to confirm that permission every time you open the app again.

The desktop app does not have to ask. It reads where the folder actually is, the way any other program on your machine would, and keeps it the way the **Add folder** button does — so a folder you drop once is a folder you never confirm again, and everything that needs the files themselves, SQL included, can read it.

Dragging folders in is also the only way it works there at all: the window the desktop app uses cannot open a dropped folder on its own, and before this it simply ignored one.

Everything else either changes files in storage you already opened, or opens something for viewing and saves nothing.

## Holding still over a folder

Hold the pointer over a folder for a moment and it opens, with the drag still going. That is how you carry something down into a folder you had not opened before you started.

## While you drag

The thing you picked up travels with the pointer, drawn as it looks in the list. Over the tree and over the path it narrows to a single line, because there is no room for more.

Press `Esc` to call the drag off. The words go with it and nothing is moved.

## Turning the words off

The label helps the first few times and is noise long after that. Turn it off and the outline around the target and the pointer's own copy-or-move mark are still there to read.
