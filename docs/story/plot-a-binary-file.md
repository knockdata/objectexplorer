---
title: "Plot a binary file?"
subtitle: "Click file, choose your chart."
episode: 4
runtime: null
video: null
poster: /screenshot/notebook-chart.png
focus: { x: 32, y: 60, width: 50 }
caption: "A chart cell on the train stations table: \"count by country\" drawn as bars, NL close to 400, the Plot source that draws it above, and a strip of eight suggested charts between them."
today:
  - tool: "Email"
    step: "vendor sends a file"
  - tool: "Cloud console"
    step: "upload to a bucket"
  - tool: "Ticket queue"
    step: "ask for a chart"
  - tool: "Notebook"
    step: "someone loads, plots"
  - tool: "Chat"
    step: "a picture arrives"
tally: "one question, one week, one picture"
published: 2026-09-14
description: "A vendor drop that will never reach a warehouse, so the question becomes a ticket and the answer arrives next week."
---

<!--
Lines:
1. Click file, choose your chart.
2. A file has rows. Draw them.
3. Answer the question the day it's asked.

Cue:
- vendor drop, one question
- never reaching the warehouse
- a chart is rows, drawn
- Click file, choose your chart.

Board:
  0:00  Plot a binary file?               white       top
  0:06  file shape, VENDOR under it       amber       upper middle
  0:20  arrow to TICKET, arrow to NEXT    pink        upper middle to middle
        WEEK
  0:42  small bar chart                   neon green  middle
  0:52  Click file, / choose your chart.  neon green  lower band
Drawn: 7

Words: 127

Delivery:
- "Next week" is the punchline of the Today beat. Flat, resigned, no emphasis.
- Pause after "Nobody is going to build a pipeline for one question."
- Cut "It came in over email." first.

Script:
[0:00, walk in]
You asked a question on Monday and got the answer the following week.
TODAY
[0:06, draw a file, VENDOR under it, amber]
A vendor sent a file. It came in over email. It's sitting in a bucket now, and it will never reach the warehouse. Nobody is going to build a pipeline for one question.
[0:20, draw an arrow to TICKET, an arrow to NEXT WEEK, pink]
So you wrote a ticket. Someone downloaded it, loaded it, plotted it, and sent back a picture. Next week.
IDEAL
Start over. What's in that file? Rows and columns. What's a chart? Those rows, drawn. That's the whole operation, and your laptop can do it to a million rows without warming up.
[0:42, draw a small bar chart, neon green]
So do it where the file is. Click it, get the rows, pick a chart. The question and the answer land in the same hour.
[0:52, write the line, step out, hold three seconds]
Click file, choose your chart.
-->

A vendor sent us a file. It came in over email, as an export from their statistics package, and someone put it in a bucket. On Monday I had one question about it: how the rows split across a single category. I got the answer the following week, as a picture.

## Today

The file was never going to reach the warehouse. Nobody builds a pipeline for a one-off vendor drop, and I wouldn't either. So the file sat in a bucket, and the console could show me its name and its size and offer to download it.

I couldn't open the format on my laptop. So I wrote a ticket. Someone who could picked it up a few days later, downloaded the file, loaded it in a notebook, grouped it, plotted it, and pasted the chart back into the ticket. The chart was right. It was also a week old, and when I had a second question it went back into the queue.

<StoryToday />

Nobody was slow. The analyst did the work in less time than the ticket waited. The console did what consoles do. The assumption every step shared was that a chart is something produced by a person with the right tools, rather than something you look at.

## Ideal

So I tried to think about what a chart is. It is rows, drawn. A bar chart of counts per category is a group and a count, then one rectangle per group. There is nothing in that operation a laptop finds hard, even over a million rows.

The hard part is not the drawing. It is two other things. The first is reading the file, which means a reader for the format, so that a statistics export becomes rows and columns without its original program. The second is choosing which chart to draw, because a table with eleven columns has a lot of possible charts and most of them are useless.

The second is easier than it sounds. To show a table, something has already measured each column: which one is a date, which is a category with a handful of values, which is a measurement, and which is just an id counting up once per row. From those four answers the sensible charts follow. A measure over a date is a line. A count per category is a bar. A single measure is a histogram. Two measures are a scatter.

<StoryPoster />

That is the train stations table with its charts offered as a strip of names. In the code, the strip holds at most eight choices. A category only qualifies if it has more than one value and no more than thirty, because past that a category axis is a wall of labels. A column of consecutive whole numbers, one per row, is recognised as a row number and never offered. And every choice is printed as source I can edit, not a picture I can only look at.

## Where it stops

A format needs a reader. Statistics exports from SPSS and SAS, parquet, csv, json and spreadsheets can be queried, and Avro only when the app runs with its server rather than purely in the browser. A format outside that list is still a ticket.

And the suggestions are only suggestions. They know what a column is, not what I am asking. For the first question they are usually close. For the second I edit the source.

**Click file, choose your chart.**
