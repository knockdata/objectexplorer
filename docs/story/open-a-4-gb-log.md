---
title: "Open a 4 GB log?"
subtitle: "Line nine million, as fast as line one."
episode: 13
runtime: null
video: null
poster: /screenshot/story-big-file.png
focus: { x: 36, y: 50, width: 45 }
caption: "A 2 GB csv from a local folder in the text view, scrolled to its last lines. The page holds a few thousand lines; the rest stays on disk."
today:
  - tool: "Cloud console"
    step: "find the log"
  - tool: "Browser"
    step: "download 4 GB"
  - tool: "Editor"
    step: "open it, hang"
  - tool: "Terminal"
    step: "stream it to a pager"
  - tool: "Pager"
    step: "wait to reach the end"
tally: "4 GB moved to read 50 lines"
published: 2026-09-14
description: "Four gigabytes downloaded, then an editor that hangs, to read fifty lines near the end. A screen holds fifty lines at a time."
---

<!--
Lines:
1. Line nine million, as fast as line one.
2. A screen holds fifty lines. Send fifty.
3. Open the end of the file first.

Cue:
- four gigs, fifty lines
- download, hang, give up
- a screen holds fifty lines
- Line nine million, as fast as line one.

Board:
  0:00  Open a 4 GB log?                           white       top
  0:06  file shape, 4 GB inside                    amber       upper middle
  0:20  arrow down, HANG under it                  pink        upper middle
  0:42  same file, small window box near end       neon green  middle
  0:52  Line nine million, / as fast as line one.  neon green  lower band
Drawn: 7

Words: 125

Delivery:
- "Four gigs" in the middle, "four gigabytes" in the first sentence only.
- Pause after "Fifty lines. That's what a screen holds."
- Cut "The editor thought about it and died." first.

Script:
[0:00, walk in]
You downloaded four gigabytes of log to read the last page of it.
TODAY
[0:06, draw a file with 4 GB inside it, amber]
Something broke at midnight. The log is one file, and it's enormous. The console has a download button and nothing else.
[0:20, draw an arrow down with HANG under it, pink]
So you pulled it down. Then the editor thought about it and died. So you piped the cloud's copy command into a pager and waited while four gigabytes went past to get near the end.
IDEAL
Start over. What were you going to read? Fifty lines. That's what a screen holds.
[0:42, draw the same file with a small window near its end, neon green]
And a file is just a range of bytes. Every cloud will hand you a slice of one. So take the slice you're looking at, and take the next one when you scroll.
[0:52, write the line, step out, hold three seconds]
Line nine million, as fast as line one.
-->

Something broke at midnight, and the only witness was a log file of four gigabytes sitting in a bucket. I wanted the last fifty lines. I ended up moving all four gigabytes to get them, twice.

## Today

The console showed me the file's name, its size and a download button. That is all a console can do with a file. So I downloaded it, which took long enough to make coffee. Then I opened it in my editor, and the editor tried to read the whole thing into memory and stopped answering.

The second attempt was smarter, or felt smarter. I piped the cloud's copy command into a pager and paged to the end. The pager was fine. But to reach the end it had to read everything before it, so the four gigabytes crossed the network again, this time while I watched.

<StoryToday />

None of those tools did anything wrong. Each did exactly what it was built to do. The problem is the shape of the walk: every step assumed the whole file had to be here before any of it could be looked at.

## Ideal

So I tried to start from what I actually wanted. Not the file. Fifty lines. A screen holds about fifty lines of log, and I can only read one screen at a time.

Then the question is whether I can get fifty lines without getting the rest. I think the answer has been yes for a long time. S3, Cloud Storage and Azure Blob all accept an HTTP Range request, which asks for bytes 3,900,000,000 to 3,900,065,535 of an object and gets exactly those. A file in a bucket is not a sealed box. It is a long row of bytes, and you are allowed to point at any part of it.

What makes it feel impossible is line numbers. Line nine million is not at a byte offset you can compute, because lines have different lengths. But you can find it cheaply if you read the file once, forward, a few megabytes at a time, and write down where every hundredth line starts. That list of checkpoints is small. After it exists, any line is one seek to the nearest checkpoint and one short read.

This is how I want it to look, and for a file on my own disk it is how it looks now:

<StoryPoster />

That file is 2 GB. The view asks for the lines on screen in blocks of two thousand and keeps eight blocks at most, so the page never holds more than a small window of the file. Scrolling to the end asks for different bytes. It does not ask for more of them.

## Where it stops

I have to be honest about the bucket, because it is the case the story starts with. The view asks for ranges, and every cloud's API would answer them. But between the two sits a local cache, on by default, and today it fetches the whole object into the cache before it answers the first range. So a 4 GB log in a bucket still crosses the network once, in full. It crosses only once, and the editor never has to hold it, but it is not yet the fifty lines I asked for. Passing a range straight through when the object is not cached yet is the next step, and I haven't built it.

The other cost is the one pass. To know line numbers, the file has to be read once from the front. The view draws from the first chunk while the pass runs, and hex needs no pass at all, because a byte offset is already an address. But if you jump straight to line nine million, you wait for the checkpoints to reach it.

**Line nine million, as fast as line one.**
