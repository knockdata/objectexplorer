# Where the storage went

<img src="/screenshot/usage.png" alt="The usage disc: a pole for every bucket and folder, grouped into an arc per provider, with the selected bucket's numbers in a card beside it">

Open ObjectExplorer with nothing selected and this is what fills the window: every root you have
added, drawn as one disc. A pole per bucket and per folder, as tall as what it holds costs, grouped
into an arc per provider — orange for AWS, blue for Google Cloud, green for Azure, grey for this
machine.

It answers the question a console will not: **not what is in one bucket, but where the money goes
across all of them, what has gone cold, what is already on this laptop, what nobody has opened in a
year, and what you are paying to keep twice.**

Nothing is asked of any provider to draw it. The disc is made from what this window has already
listed, so it opens instantly, works with the network off, and costs nothing to look at.

## Reading one pole

<img src="/diagram/usage-pole.svg" alt="One pole, labelled: the base and its reading ring, the pole itself, balls on sticks inside and outside the one-year ring, a halo round a ball that has been opened, and the cap with its pale middle">

Read a pole from the floor up.

| Part | What it says | What to look for |
|---|---|---|
| **Height** | monthly cost, size, object count, or what keeping it here has saved — one scale for the whole disc | the tallest pole is where the money goes |
| **Colour** | which provider it belongs to, in both groupings | |
| **Cap** | wider means more objects | a wide cap on a short pole is a million small files |
| **Pale middle of the cap** | how much of it is already on this machine | mostly dark means you are paying to keep bytes you never pulled |
| **Narrow top** | one object is most of the pole | fix that object and the pole collapses |
| **Ring** | the one-year line: as far from the pole as an object a year old stands | balls outside it have not changed in a year |
| **Ball** | one of six named objects — the three biggest changed inside the year, and the three biggest that have not | a big ball far outside the ring, on a tall pole, is an archive candidate |
| **Halo round a ball** | how often that one object has been opened | a big cold ball with no halo is paid for and unread |
| **Small balls** | the tail, placed by the ages the app actually measured — not individual objects | mostly outside the ring means the whole tail is cold |
| **Ring around the base** | how much reading this pole has had: all the way round is the busiest pole on the disc, pale for opens in this window and amber for an agent's calls | a bare dark ring is a bucket nobody looks at |
| **Chord across the floor** | the same bytes held by two poles; thicker is more of them | follow it: one of the two copies is usually not needed |
| **Stub** | a root that was added and never opened: a short post in its provider's colour, with no cap, no balls and no ring | click it, then open it once in the tree |

Nothing on the disc says how often anything was **written**. That is not recorded anywhere — see
[where the usage numbers come from](/reference/usage-data).

## If you see…

| If you see… | Read it as… | Next action |
|---|---|---|
| A tall pole | high value in the measure you picked | switch between Cost and Size to see what drives it |
| A tall pole with balls outside the ring | a lot of old data at today's price | click the pole and read its cold share |
| A needle-thin top | one object dominates | click the big ball to name it |
| A wide cap | many objects | compare the object count with the size |
| A long base ring | something reads it constantly | check whether it is pale (a person) or amber (an agent) |
| A bare base ring | paid for, never opened | |
| A ball with a wide halo | one object everything keeps coming back to | worth a local copy, or a cheaper class if it is cold |
| A chord | the same bytes in two places | read the row under **Held twice** for the size and the saving |
| A post with no cap | nothing listed there yet | open it once in the tree |

## Two ways to group it

<img src="/diagram/usage-disc.svg" alt="The same disc under both groupings: on the left a sector per provider, on the right a sector per kind of thing, where one bucket stands in several sectors and the colour still says whose it is">

**Group by** decides what a sector is.

**Provider** is the default: one pole per root, in the arc of the cloud it belongs to. It answers
"where is my money, per account".

**Category** splits each root by what it holds — media, documents, datasets, archives, code, other —
so one bucket stands as several poles, one per kind of thing, each still wearing its provider's
colour. It answers "what kind of thing am I paying for", and it is what makes the disc worth reading
when only two or three roots have been added: three roots is three poles under Provider and a dozen
under Category.

The kind is read from the file extension and from nothing else. A folder called `logs/` full of
screenshots is a folder of screenshots, and gzipped logs count as archives.

<img src="/screenshot/usage-category.png" alt="The disc grouped by category: sectors for media, documents, datasets, archives, code and other, with one bucket standing in several of them">

## Walking into it

The disc is the same size whether it holds three poles or forty. What changes is how close together
they stand, and each group keeps its own arc. Past forty-eight poles the smallest are gathered into
one pole per group labelled with how many it stands for.

There are three steps in, and `Escape` walks back out of each:

1. **Click a provider** in the list and the disc redraws with only that provider's roots. The
   breadcrumb reads `All storage › AWS`. Nothing is fetched — the window already has every root.
2. **Click a pole**, then **Look inside**, and the disc redraws for that root alone: one pole per
   folder inside it, with the same encodings all the way down.
3. **Keep going** and each folder opens into the folders inside it.

<img src="/screenshot/usage-inside.png" alt="The disc after clicking into a bucket: a pole for each folder inside it, with the breadcrumb showing the way back out">

## The column beside it

Everything on the disc is in the list beside it, as rows. Hovering a row lights its pole; clicking
one opens the same card. The disc is the part you point at, and the list is the part you read — if
you would rather not turn a 3D chart at all, the list alone does the whole job.

**Held twice** lists every pair of poles holding the same bytes, with how much and what removing one
copy would save a month. Each row says how the match was made: *same content* means the provider's
own tag for the bytes matched, *same name and size* means exactly that and nothing more. Nothing
under a megabyte is looked at, so the figure is a floor rather than a total.

**What this says** is five findings, worked out from the numbers rather than written by anyone: the
priciest root, the one holding cold data at warm prices, the one where a single object is most of
it, the one that is paid for and never opened, and the biggest thing held twice. Click a finding to
light the root it is about.

## Four things the height can be

| Measure | What it compares |
|---|---|
| **Cost / month** | size × storage class × the bucket's region, with each class's per-object minimum |
| **Size** | the bytes themselves |
| **Objects** | how many, which is what a listing costs rather than what storage costs |
| **Saved** | what keeping these bytes here is worth: the egress the local copies spared, plus what no cloud is charging rent on, less the egress already paid to pull the copies down |

**Saved** is three numbers and the card shows all three. For a bucket, the first and third apply: the
bytes are billed where they are, so a local copy saves the download and nothing else. For a folder on
this disk the second applies — nobody is charging rent on it — and the card names the rate it was
valued at, because a folder on your own disk has no published price and one had to be borrowed.

**Square root** is the default scale, because storage is heavy-tailed: one backup bucket on a linear
scale flattens every other pole into the floor. Switch to **Linear** when the comparison you want is
of the two or three biggest.

A folder on this disk has no published rate, so it has no cost — it reads `—` rather than `$0`,
which would say something untrue.

## A worked example

The picture above is a demo machine holding 9.3 TB across eight measured roots and three that have
never been opened. Reading it in order:

1. **The heights, in Cost.** `oe-prod` is the tallest at **$35.94 a month**, of a **$96.05** total.
2. **Switch to Size.** `oe-prod` is 2.5 TB and `oe-lake` is 1.3 TB — but in Cost they are $35.94 and
   **$26.88**. `oe-lake` costs three quarters as much on half the bytes, because every byte of it is
   in Standard while 1.2 TB of `oe-prod` is in Glacier.
3. **Check the balls against the ring.** 77% of `oe-lake` has not changed in over a year, and it is
   still held at **$18.63 per TB**. That is a lifecycle rule waiting to be written.
4. **Look for a narrow top.** The Azure pole is a needle: `prod_2026_full.dump` is **67%** of the
   whole bucket, 780 GB of 1.2 TB.
5. **Follow the chord from it.** That same 780 GB dump is also sitting in `Downloads` on this
   machine — matched by name and size — and deleting the copy in the bucket is **$15.52 a month**.
6. **Look for a dark base ring.** `oe-archive` has no arc at all — nobody and no agent has opened
   anything in it since this window started counting — and it costs **$15.35 a month**.
7. **Switch Group by to Category.** `oe-prod`'s $35.94 splits into $24.38 of media, $9.35 of
   archives and $1.70 of datasets, so the lifecycle rule to write is about video, not about logs.
8. **Click to check.** Every card ends with the sum behind its headline, so the impression the
   picture gave can be held against the arithmetic before anyone acts on it.

That is six decisions from one screen, none of which a bucket listing would have offered.

## Moving around it

The disc moves like every other three-dimensional view: drag to turn, `⇧`-drag to pan, wheel to zoom,
double-click to start over. The full list is on [moving around a view](/reference/view-controls).

Click a pole, a ball or the hub in the middle to pin its numbers; click empty space or press `Escape`
to let go.

## Where it opens

It fills the window whenever nothing else is open. **Settings → General** turns that off, and
`⇧⌘P` → **View: Storage Usage** opens it as a tab whenever you want it.

A fresh install has nothing to draw: the disc opens empty and says so. Add a connection, open it
once, and a pole appears the next time it is drawn.

Every number on it is explained in
[where the usage numbers come from](/reference/usage-data).

Next: [previewing an object](/explore/preview).
