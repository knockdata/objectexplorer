# Copy, move, rename, delete

The other half of a file explorer. `⌘C` `⌘X` `⌘V`, `F2` to rename, `⌫` to delete, and drag between
any two places in the tree — within a root it moves, across roots it copies, and `⌥` or `⌘` says so
explicitly.

## Across providers

It works across providers, and that is the part a console cannot do: a prefix dragged from S3 to
Azure streams through your machine and lands as objects, and the destination's size is read back
before a move deletes anything.

Within one provider the bytes never touch your machine at all — GCS `rewriteTo`, S3
`x-amz-copy-source`, Azure `x-ms-copy-source`, a plain copy on disk. A transfer reports its progress
in the footer, so an hour-long copy is not an hour-long wait on a spinner.

## Nothing is ever unlinked

A delete moves the object into a `.trash` folder at the top of its own root — the same layout in a
bucket and in a local folder — so `⌘Z` is a move back rather than a hope, and it puts back whatever
an overwrite wrote over too. The trash is emptied after 30 days.

## Conflicts

Pasting onto a name that exists asks, once, and the answer applies to the rest of the batch:
replace, keep both, or skip.

Next: [sharing a table](/explore/share).
