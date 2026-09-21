---
title: "Get a column summary?"
subtitle: "One click, full stats."
episode: 3
runtime: null
video: null
poster: /screenshot/column-summary.png
caption: "The nl_train_stations table with a summary drawn above every column header: id runs from 5 to 842, the name columns each have 578 unique values, and country shows NL as its most common value, 397 rows."
today:
  - tool: "Cloud console"
    step: "copy the path"
  - tool: "Notebook"
    step: "type the imports"
  - tool: "Notebook"
    step: "read the file"
  - tool: "Notebook"
    step: "describe, count nulls"
  - tool: "Notebook"
    step: "close it"
tally: "20 minutes to learn 3 columns were usable"
published: 2026-09-14
description: "Twenty minutes of notebook ceremony to learn a file has three usable columns. The machine reads the rows anyway. It can count while it reads."
---

<!--
Lines:
1. One click, full stats.
2. Show me the columns. All of them.
3. It read the rows. It can count them.

Cue:
- imports, read, run, run
- twenty minutes, three columns
- it's already reading the rows
- One click, full stats.

Board:
  0:00  Get a column summary?           white       top
  0:08  IMPORT / READ / DESCRIBE stack  pink        upper middle
  0:24  20 MIN beside the stack         pink        upper middle, right
  0:42  column header with a bar chart  neon green  middle
  0:52  One click, / full stats.        neon green  lower band
Drawn: 7

Words: 120

Delivery:
- Run the import-read-run list fast and flat. It's ceremony; it should sound like ceremony.
- Pause before "Three usable columns."
- Cut "You'd done it four hundred times before." first.

Script:
[0:00, walk in]
You wrote twenty minutes of code to learn a file was useless.
TODAY
[0:08, write IMPORT / READ / DESCRIBE stacked, pink]
Start a notebook. Type the imports. Type the read. Run it. Describe it. Run it. Count the nulls. Run it. You'd done it four hundred times before.
[0:24, write 20 MIN beside the stack, pink]
Twenty minutes. And the answer was: three usable columns, and the dates stop in March. You closed the notebook.
IDEAL
Start over. Where do those numbers come from? The rows. Min, max, how many are empty, how many are different. Counting is what a machine is fastest at. And it has to read the rows anyway, to show them to you at all.
[0:42, draw a column header with a small bar chart under it, neon green]
So count while you read. Put it under the column name, where you're already looking.
[0:52, write the line, step out, hold three seconds]
One click, full stats.
-->

A new file landed in a bucket and someone asked me whether it was any good. I didn't want to analyse it. I wanted to know what was in each column: the range, how many were empty, whether the dates went as far as they should. I spent twenty minutes finding out that three columns were usable and the dates stopped in March.

## Today

The console could tell me the file's name and size, and nothing about what was inside. So I copied its path and started a notebook. I typed the imports I have typed hundreds of times. I typed the read, with the path, and ran it and waited. I asked for a description of every column and ran that. I counted the nulls, because the description doesn't, and ran that too. Then I scrolled through the output, sideways, because the table was wide.

The answer was short. The work to get it was not. And then I closed the notebook and didn't come back to it, because the file wasn't worth it.

<StoryToday />

Nothing went wrong in any of that. The notebook is a fine place to do analysis. The problem is that I wasn't doing analysis. I was looking. Every step assumed that learning the shape of a file means writing a program about it.

## Ideal

So where do those numbers come from? The rows. The smallest value and the largest, how many are empty, how many are different from each other, which ones come up most. None of it needs a model or a formula. It is counting.

And here is the part I think is easy to miss. To show me a table at all, something already has to read the rows and put them on the screen. If it is reading them anyway, it can count while it reads. The summary costs one more pass over values that are already in memory.

The one real decision is what kind of column it is, because a count of distinct names and a range of prices need different pictures. That can be decided from a small sample, and then every value is counted once, properly.

<StoryPoster />

That is a file of Dutch and European train stations, opened as a table. Above each column name sits its summary. In the code, the type is picked from a sample of 500 values, then every loaded value is walked once for the row count, the null count, the distinct count, the minimum, quartiles, median, maximum and average, and the six most common values for text. A column with twelve or fewer distinct values shows each one. The id column's range, 5 to 842, and the 397 rows marked NL are read straight off the header.

## Where it stops

The summary is over the rows that were loaded, not always the whole file. When a parquet file opens as a table, the view reads its first row group and shows at most 1,024 rows; a query brings back at most 10,000. For this file that is every row. For a file of fifty million rows, it is a first look, and the numbers describe that first look. A full count over every row is a query, and it takes as long as reading the file takes.

I think that is the right trade for a glance. But it is a trade, and on a big file I would want to remember that I am looking at the front of it.

**One click, full stats.**
