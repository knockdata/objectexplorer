# Archives

<AppDemo name="archive" />

Step into a `.zip`, a `.dmg`, or an office file — `.pptx` and `.xlsx` are zips too — and browse the
entries as if they were folders. Each entry previews with its own viewer, so a CSV inside a zip
inside a bucket is still just a table.

Nothing is extracted to disk: the archive's directory is read, and an entry's bytes are decompressed
when you open that entry.

| Browsable as a folder | Formats                                                                |
|-----------------------|------------------------------------------------------------------------|
| Zips                  | `zip` `jar` `war` `ear` `apk` `ipa`                                    |
| Office files          | `pptx` `potx` `ppsx` `xlsx` `xltx` `docx` `dotx`                       |
| Disk images           | `dmg`                                                                  |
| Anki decks            | `apkg`                                                                 |
| CAD files             | `sldprt` `sldasm` `slddrw` `catpart` `dwg` — see [CAD](/formats/cad)   |
| Databases             | `db` `sqlite` `sqlite3` `duckdb` — see [databases](/formats/databases) |

`tar`, `gz`, `7z`, `rar` and the other archives that are not zips cannot be browsed yet.

Next: [copy, move, rename, delete](/explore/file-management).
