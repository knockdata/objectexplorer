---
title: "Open the same file twice?"
subtitle: "The second look is free."
episode: 16
runtime: null
video: null
poster: /screenshot/story-cache-savings.png
focus: { x: 57, y: 40, width: 50 }
caption: "Settings, Cache: what the local copies hold per provider, and below it the reads the copies answered, 191 KB here, and the egress those reads would have cost."
today:
  - tool: "Cloud console"
    step: "download, look"
  - tool: "Cloud console"
    step: "download again"
  - tool: "Cloud console"
    step: "and again"
  - tool: "Billing"
    step: "every look paid"
tally: "36 looks at one 900 MB file, 32 GB of egress"
published: 2026-09-14
description: "A file opened thirty-six times in one afternoon is paid for thirty-six times. The bytes did not change between the first look and the second."
---

<!--
Lines:
1. The second look is free.
2. You already have it. Look again.
3. Pay once. Read it all week.

Cue:
- same file, thirty-six times
- paid for every look
- the bytes didn't change
- The second look is free.

Board:
  0:00  Open the same file twice?         white       top
  0:06  cloud, file under it              amber       upper middle
  0:20  six arrows down, $ beside each    pink        upper middle
  0:44  disk box, one arrow in, loop out  neon green  middle
  0:52  The second look / is free.        neon green  lower band
Drawn: 8

Words: 122

Delivery:
- The quiet one. Lower energy than the others. It's an observation, not a complaint.
- Pause after "The bytes hadn't changed."
- Cut "Nobody files a ticket about this." first.

Script:
[0:00, walk in]
You opened the same file thirty-six times in one afternoon and paid for every one.
TODAY
[0:06, draw a cloud with a file under it, amber]
Nobody files a ticket about this. You were just working. Open it, check a column, close it, open it again.
[0:20, draw six arrows down with a dollar sign beside each, pink]
It's nine hundred megabytes. Thirty-six looks is thirty-two gigabytes off the account, for one afternoon of curiosity. The bytes hadn't changed between any of them. Multiply that by a team and a quarter.
IDEAL
Start over. It came down once already. Your disk has room. The file didn't change while you were looking at it, and it can say when it does.
[0:44, draw a disk box, one arrow in, a short loop out, neon green]
So keep it. Every browser on earth worked this out decades ago. Ask once, keep the answer, check it's still good.
[0:52, write the line, step out, hold three seconds]
The second look is free.
-->

One afternoon I opened the same file thirty-six times. It was nine hundred megabytes of data I was trying to understand. I would open it, check a column, close it, think, and open it again. Every one of those opens downloaded it again.

## Today

Nobody files a ticket about this. It is just working. Each time I went back to the file I went back to the console, clicked it, and downloaded it, because that was the path my hands knew, and because I had deleted the previous copy or couldn't remember which of the copies in Downloads was current. Thirty-six looks at nine hundred megabytes is about thirty-two gigabytes out of the cloud in one afternoon, and egress is charged on every byte. The file did not change once in that time.

<StoryToday />

The console did nothing wrong. It hands over a file when asked. The shared assumption was that every look at a file in the cloud is a new download, as if the file might have changed since a minute ago.

## Ideal

So I tried to think about what actually needed to happen. The file came down once already. My disk had room for it. The file didn't change while I was looking at it. What I needed on the second look was not the file again. It was an answer to a much smaller question: is the copy I have still the right one?

Web browsers worked this out a long time ago. They keep what they fetched, and before using it they ask the server whether it is still current, which is a request with no body. Every cloud's storage API will answer a metadata request for an object, with its size and when it last changed, without sending a byte of the object.

So keep the copy. On the next look, check it against that small answer, and download again only when it no longer matches. And because a saving that nobody can see is a saving nobody trusts, count it: every read that was served from disk is bytes that did not leave the cloud.

<StoryPoster />

That is the summary of the report that counts it; the whole report has a row per object. In the code, objects from all three clouds are cached on the local disk by default, under the app's own folder. For each object it counts reads and actual downloads, and the bytes avoided are the reads beyond the first download, times the object's size. The money column prices those bytes, plus the requests that weren't made, at each cloud's published internet egress rate, kept in the same rate tables as the storage costs.

## Where it stops

The check is weaker than a browser's. A cached copy is used when it is less than a day old and its size still matches what the cloud reports. It doesn't compare a version tag. A file rewritten with exactly the same size within that day would be served from the old copy, and a file that hasn't changed at all is downloaded again after a day anyway. I think both are rare, but the first one is the kind of rare that matters.

The saved money is also an estimate: it uses the published rate for egress to the internet, not whatever discount an account may have.

**The second look is free.**
