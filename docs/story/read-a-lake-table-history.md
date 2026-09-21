---
title: "Read a lake table's history?"
subtitle: "Every commit, on a timeline."
episode: 11
runtime: null
video: null
poster: /screenshot/lake-metadata.png
caption: "The _delta_log folder of demo/delta/sales opened as a history: v0 WRITE adds 4 rows in one file, v1 UPDATE swaps that file for a new one, v2 DELETE removes 2 rows, each commit with its time and the files it added (+) and removed (−)."
today:
  - tool: "Cloud console"
    step: "a log folder"
  - tool: "Cloud console"
    step: "download a few"
  - tool: "Editor"
    step: "read JSON by hand"
  - tool: "Terminal"
    step: "start an engine"
  - tool: "Query console"
    step: "ask one question"
tally: "a query engine started to read a folder of JSON"
published: 2026-09-14
description: "A bad write went out at two in the morning, and the table's own history sits beside the data as a folder of numbered files."
---

<!--
Lines:
1. Every commit, on a timeline.
2. The table wrote down what it did.
3. Show the history it already keeps.

Cue:
- bad numbers, two a.m.
- a folder of numbered files
- it kept a log all along
- Every commit, on a timeline.

Board:
  0:00  Read a lake table's history?    white       top
  0:06  data folder, log folder beside  amber       upper middle
  0:20  00001 / 00002 / 00003 stack     pink        upper middle
  0:44  timeline, dots, one circled     neon green  middle
  0:52  Every commit, / on a timeline.  neon green  lower band
Drawn: 8

Words: 126

Delivery:
- "Two in the morning" sets the stakes. Say it early and don't come back to it.
- Pause after "It wrote down every change it ever made."
- Cut "in order, on purpose, so anyone could replay it" first.

Script:
[0:00, walk in]
The numbers were wrong, and the write that did it happened at two in the morning.
TODAY
[0:06, draw a data folder with a log folder beside it, amber]
You needed to know what changed.
[0:20, write 00001 / 00002 / 00003 stacked, pink]
The console showed you a folder of files named after numbers. That's the history, rendered as files on disk. So you downloaded a few and read them by hand. Then you gave up and started an engine just to ask one question.
IDEAL
Start over. That folder isn't an accident. The table wrote down every change it ever made, in order, on purpose, so anyone could replay it.
[0:44, draw a timeline with dots, one circled, neon green]
So show it as what it is. A list of changes, newest first. What each one added, what it removed. Then look at the table as it stood before the bad one.
[0:52, write the line, step out, hold three seconds]
Every commit, on a timeline.
-->

The numbers in a table were wrong in the morning, and they had been right the evening before. Something had written to it at two in the morning. I needed to know what that write did.

## Today

The table was a Delta table in a bucket: a folder of parquet files with a folder called _delta_log beside them. I knew the history lived in that folder. The console showed it to me as a list of files named with long, zero-padded numbers, a JSON file per commit, with sizes and dates.

So I downloaded the last few and opened them in an editor. Each one is a file of JSON lines: which data files the commit added, which it removed, what kind of operation it was, some counts. Reading them by hand worked for one commit and fell apart at three, because the answer I wanted, "what did the table look like before", is spread across all of them. So I started a query engine with the right extension, pointed it at the table, and asked it for the history. That was the part that took the morning.

<StoryToday />

Nobody did anything wrong. The table format did exactly what it was designed to do, and did it well. The console showed the files it had. The shared assumption was that a table's history is an internal detail that needs an engine to read, rather than a document written for people too.

## Ideal

So I looked at what that folder actually is. It is not an accident of storage. The table writes down every change it makes, in order, on purpose, so that any reader can replay it and agree on what the table contains. Commit zero, commit one, commit two. Each says what it added and what it removed. That is a history already, in the most literal sense.

If that is true, then showing it needs no engine at all. Read the commits, oldest to newest, and for each one draw what it did: the operation, when, how many rows, and the files that came and went. Iceberg keeps the same idea as a chain of snapshots, and Hudi as a timeline of instants. Different words, the same shape.

<StoryPoster />

That is a small Delta table's log, opened as its history. The first commit wrote four rows in one file. The second was an update, which in this format means the old file is replaced by a new one, and the log says so: one file added, one removed. The third deleted two rows the same way. In the code, a folder is recognised as a Delta log by its commit files alone, whose names are the version padded to twenty digits, and the same history view exists for Iceberg snapshots and for the Hudi timeline.

## Where it stops

I can see every commit. I can't yet look at the table as it stood before one of them. Reading the table always reads its latest version; the query path has no way to ask for version one instead of version two. For the two in the morning problem, that means the history tells me what happened and which files were involved, and restoring or comparing still takes an engine that can time travel.

Very long logs are also cut off: the view shows a fixed number of versions and says so, rather than reading thousands of commits to draw them.

**Every commit, on a timeline.**
