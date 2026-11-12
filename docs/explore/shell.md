# A shell in a pane

A terminal beside your files, started in the folder you are looking at, so a command runs where the
files are. On macOS and Linux; not yet on Windows.

Right-click a folder on this machine and pick **Open Shell in the Left Pane** or **Open Shell in the
Right Pane**. The tab runs your own shell (`$SHELL`, zsh on a Mac, started as Terminal starts it),
in that folder, with your own settings loaded first. A cloud folder has no shell.

## What it does

It is a full terminal: colours, the arrows and function keys, Option as Meta, a program that takes
the screen and the mouse (vim, htop), ⌘V to paste, a drag to select and ⌘C to copy, the wheel to
scroll back through the last 10,000 lines. The pane's size is the terminal's. The line under it
names the shell and the folder it is in now, or how it ended; closing the tab ends the shell.

A tab put away and shown again finds its shell as it was.

## One history

Every command typed in any of the app's shells goes into one history, with when it last ran and how
often. `history` prints it, and the up arrow recalls from it in every shell. It is kept on this
machine, in [the app's folder](/reference/data-locations).

## In a browser page

The page `objectexplorer` serves from a terminal has the shell too, when the page comes from this
machine's own server: the shell runs there, on the server. A page of another machine never gets one.

Next: [code duplication](/explore/duplication).
