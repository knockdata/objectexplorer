# Search

<AppDemo open="folder/demo/" search="station" :off="['tour', 'auth']" image="/screenshot/search.png" alt="Search results across the demo folder, grouped by file with the matching line" />

Search local folders and cloud buckets in the same run: literal, whole word or regex, with include
and exclude globs, and `.gitignore` honoured when you point it at a repo.

It searches inside what the files hold, not only their names: a word on slide 3 of a deck inside a
zip is found, and the result says "slide 3".

## The index

Opening the search panel brings an index of every folder in the tree up to date; the count line says
how far it has got. A file is read again only when it changed, and a folder on this disk is followed
from then on, so its index keeps itself current. A query is searched a moment after you stop typing,
and the answer fills in as it is found: files not indexed yet are read for it there and then.

## The controls

- **Fuzzy Match**, **Match Case**, **Match Whole Word**, **Use Regular Expression** — the four
  toggles in the field. Fuzzy finds a word one letter off too.
- **files to include** / **files to exclude** — globs, comma separated, like `*.json, src/`.
- **Search only in Open Objects** — the book icon in the include field.
- **Use Ignore Files** — the icon in the exclude field. On, build output, `node_modules`, `.git`,
  `.venv` and what `.gitignore` files name are left out.
- **remote storage** — lists the cloud folders in the tree. A ticked one is searched in full, each
  file copied into [the cache](/explore/cache) to be read; any other only in the copies already
  there. **Scan Now** beside it reads the ticked ones now, then searches again.

To search one folder, right-click it and pick **Find in Folder…**: the panel opens with files to
include set to that folder.

## The results

A line first says what was searched. Then **Names**: the files and folders whose name holds the
query. Then **In files**: each file with its places under it — a line, a slide, a page — and the hit
marked; clicking one opens the object at that place. With more than one folder in the tree, each
folder with results gets a heading of its own that folds all its files.

The toolbar switches between the grouped tree and a flat list, and opens the same search as an
editor over the window. `⌘P` (Go to File) stays a search of names alone.

Next: [hex](/explore/hex).
