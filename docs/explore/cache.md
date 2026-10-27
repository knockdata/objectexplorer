# The cache

A cloud object you open is copied once and kept on this machine. The next time anything reads
it — a preview, a query, an agent — the copy answers, and the provider is not asked for the
bytes again.

Most files are copied whole. A zip over 64 MB is not: only its directory and the entries you open
are copied, in 64 KB pages, so stepping into a large archive does not download all of it.

The copies live in one folder, `~/.objectexplorer/cache/remote` — see
[where your data lives](/reference/data-locations). Nothing is ever written into the bucket.

## How much it may take

**Settings → Cache** draws one bar: what the copies use against the limit they are held to, and
how many files they are. Type a new limit in whole gigabytes. It starts at 10 GB.

The limit is kept. Past it, the copies used least recently go first.

**Clear Cache** deletes every copy; each is copied again the next time it is read. Your roots, the
object tree and everything else the app remembers stay.

## What it saved

<img src="/screenshot/story-cache-savings.png" alt="The cache and savings report: one row per bucket, with reads, bytes pulled, bytes avoided and what that saved">

Under the bar, in the same pane, one row per bucket and a total:

| Column         | What it says                                                     |
|----------------|------------------------------------------------------------------|
| **Objects**    | how many objects of this bucket have been read                   |
| **Reads**      | how many times they were opened                                  |
| **From cloud** | how many of those reads copied bytes from the provider           |
| **Pulled**     | the bytes those copies moved                                     |
| **On disk**    | the bytes held here now                                          |
| **Avoided**    | the bytes the copies answered instead of the cloud               |
| **Saved**      | the avoided bytes, priced at the provider's first tier of egress |

**Saved** is an estimate of the right order, not a bill. The first read of anything is counted as a
download, so an object read once has saved nothing, and one nobody has read is not on the list. A
drive with no egress fee has no price, and reads `—`.

A copy spares the bytes every time, and the request only sometimes: every opening still asks the
provider for the object's own facts once the five minutes they are kept for are over. Point at a
row to see how many requests it spared.

The same savings are on each pole's card on [the usage disc](/explore/usage).

## The slowest openings

Then the twenty slowest of the last thousand files opened, each with how long it took to read and
to draw, how much memory it added and holds, and whether it opened at all. When a file feels slow,
this is where to look first.

Last in the pane, three rows you can open explain when copies are removed, how **What it saved** is
counted, and what **Slowest openings** measures.

Next: [previewing an object](/explore/preview).
