---
title: "Train without copying data out?"
subtitle: "The rows stay. The answer leaves."
episode: 12
runtime: null
video: null
poster: /screenshot/notebook-python.png
focus: { x: 22, y: 50, width: 40 }
caption: "A Python cell: oe.frame runs SELECT * on the open file, then pandas groups salary by jobcat into count, mean and max, three rows answered."
today:
  - tool: "Email"
    step: "request access"
  - tool: "Review"
    step: "wait for approval"
  - tool: "Someone's notebook"
    step: "build an extract"
  - tool: "Cloud console"
    step: "download the copy"
  - tool: "Laptop"
    step: "train on it"
tally: "three weeks for a second copy with no rules"
published: 2026-09-14
description: "A request, a review, and a scrubbed extract someone built by hand. Code is small and data is big, so send the code to the data."
---

<!--
Lines:
1. The rows stay. The answer leaves.
2. Send the code to the data.
3. Copy the question, not the table.

Cue:
- request, review, three weeks
- a second copy, no rules
- code is small, data is big
- The rows stay. The answer leaves.

Board:
  0:00  Train without copying data out?      white       top
  0:06  bucket shape                         amber       upper middle
  0:20  arrow out to COPY, 3 WEEKS           pink        upper middle, right
  0:44  small code box, arrow into bucket    neon green  middle
  0:52  The rows stay. / The answer leaves.  neon green  lower band
Drawn: 7

Words: 129

Delivery:
- "Three weeks" is the number that stings. Let it land alone.
- Pause after "Code is small. Data is big."
- Cut "Run it against the bucket, on your own machine." first.

Script:
[0:00, walk in]
It took three weeks to get a copy of data you were already allowed to read.
TODAY
[0:06, draw a bucket, amber]
You asked. There was a review. Someone built you an extract by hand, with the sensitive columns taken out.
[0:20, draw an arrow out to COPY, 3 WEEKS beside it, pink]
Three weeks. And now there are two copies of the data instead of one. The second one sits on a laptop with no rules attached to it at all.
IDEAL
Start over. Why did the data move? It didn't have to. Your code is a few kilobytes. The table is a terabyte. Code is small. Data is big.
[0:44, draw a small code box with an arrow into the bucket, neon green]
So send the small thing to the big thing. Run it against the bucket, on your own machine. Only the answer comes back, and the columns that shouldn't travel never do.
[0:52, write the line, step out, hold three seconds]
The rows stay. The answer leaves.
-->

I wanted to train a model on a table I was already allowed to read. It took three weeks, and at the end there were two copies of the data instead of one.

## Today

I couldn't train where the table was, because the only thing I could do in the console was download it, and downloading production data to a laptop is exactly what the rules exist to prevent. So I asked for an extract. There was a review, which was reasonable. Then someone built the extract by hand in their own notebook, taking out the columns that were sensitive, and put it in a bucket I could download from.

Three weeks later I had my extract. I downloaded it and trained on it. And now the data existed twice: the original, with its access rules, and a copy on my laptop with no rules attached to it at all, which nobody would remember to delete.

<StoryToday />

Everyone acted sensibly. The review protected the data. The person who built the extract did careful work. The shared assumption was that to compute on data, the data has to come to where the code is.

## Ideal

So I compared the sizes. My training code was a few kilobytes. The table was many gigabytes. Moving the big thing to the small thing is the expensive direction, in time, in money, and in risk. Code is small. Data is big. Send the small thing.

And I already had read access. The review wasn't about whether I could see the data. It was about where a copy would end up. If my code runs against the table in place, through the access I already have, no new copy is made for me, no one has to build it by hand, and only the answer comes back to my screen: a few rows of averages, a trained model, a chart.

<StoryPoster />

That cell is Python, run on the open file without an export step. It asks for the rows by the object's own address, the same address a SQL cell uses, and pandas does the rest. In the code, the Python runs in a separate local process, in a virtual environment made with uv, and it reaches cloud objects through the same connectors the rest of the app uses, holding the same sign-in. There was no request, no extract, and nobody's afternoon spent building one.

## Where it stops

I have to be plain about this one, because the title promises more than the code does. When the cell reads a cloud object, the app downloads it whole, once, into a cache folder on the machine it runs on, and hands Python the path of that local copy. On a laptop, that is a copy on a laptop. It isn't in my Downloads folder and it doesn't need a request, but it is a second copy.

And the column rules that hide sensitive columns in a share, or from an agent, are not applied to what a Python cell reads. Python sees the rows as they are.

So what is built is the first half: code that runs against the table in place, through access I already had. The rows stay only if the app itself runs next to the data, on a machine inside the cloud, and I have not made that easy yet.

**The rows stay. The answer leaves.**
