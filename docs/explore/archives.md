# Archives

<img src="/shot/archive.png" alt="A zip browsed as a folder, its entries listed like files">

Step into a `.zip`, a `.dmg`, or an office file — `.pptx` and `.xlsx` are zips too — and browse the
entries as if they were folders. Each entry previews with its own viewer, so a CSV inside a zip
inside a bucket is still just a table.

Nothing is extracted to disk: the archive's directory is read, and an entry's bytes are decompressed
when you open that entry.

Browsable: `zip` `dmg` `apkg`, and the office formats — `pptx` `potx` `ppsx` `xlsx` `xltx` `docx`
`dotx`.

Next: [copy, move, rename, delete](/explore/file-management).
