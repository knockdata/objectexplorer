# Search

<img src="/shot/search.png" alt="Search results across local folders, grouped by file with the matching line">

Search local folders and cloud buckets in the same run: literal, whole word or regex, with include
and exclude globs, and `.gitignore` honoured when you point it at a repo.

## The controls

- **Match case**, **whole word**, **regular expression** — the three toggles in the field.
- **files to include** / **files to exclude** — globs, comma separated, like `*.json, src/`.
- **remote storage** — which buckets take part, and how:
  - **cached** searches only the objects already on this machine, so it costs nothing;
  - **full scan** downloads what it has to before searching.

## The results

Results group by file, with the matching line in context and the hit highlighted; clicking one opens
the object at that line. A file with many hits offers *more matches in this file*, so one noisy file
cannot bury the rest.

Objects too large to pull down whole are listed on their own with a **Search large file** action, so
searching a bucket never silently drags gigabytes across the wire.

Next: [hex](/explore/hex).
