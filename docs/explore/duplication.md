# Code duplication

Finds blocks of code repeated across files, so a copy pasted twice can be found and made one.
Nothing is changed.

Right-click a folder and pick **Find Code Duplication**, or open **Code Duplication**, the two
pages in the activity bar, and press **Find in All Folders** to search every folder the Explorer
shows.

## What it reads

CSS, JavaScript and JSX, and C. A CSS rule counts by its declarations, written in any order or
minified; code counts by its words and symbols, so a copy indented or spaced otherwise is still the
same block.

| Field                | What it does                                                                                       |
|----------------------|----------------------------------------------------------------------------------------------------|
| **files to include** | which files are read, as search matches them (`*.css, *.js, *.jsx, *.c, src/`); `*.css` at first   |
| **files to exclude** | which are left out (`node_modules, dist`); **Use Ignore Files** leaves out what `.gitignore` names |
| **remote storage**   | the cloud folders read in full; any other cloud folder only by the copies already cached           |
| **minimum lines**    | how long a block must be to count, from 1 to 50 lines; 2 at first                                  |

A field changed finds again a moment later.

## What it shows

Each block found more than once, with its count of copies, and under it each copy by file and
line. A click opens that file at the block's first line, the panel staying beside it. A block's
right-click menu offers **Ask Claude to Refactor…** and **Ask Claude to Merge…**, which hand it to
Claude Code in the agent side bar — see [Ask an agent](/agents/ask).

Next: [the notebook](/analyze/notebook).
