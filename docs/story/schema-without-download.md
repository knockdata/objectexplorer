---
title: "Read the columns without downloading?"
subtitle: "Read the label. Not the whole jar."
episode: 19
runtime: null
video: null
poster: /screenshot/story-parquet-structure.png
focus: { x: 45, y: 50, width: 50 }
caption: "nl_train_stations.parquet, 41,876 bytes, in Structure mode: the 4-byte header, one row group of 578 rows with its 11 column chunks, and the 1.2 KB footer at the end holding the schema."
today:
  - tool: "Cloud console"
    step: "copy the path"
  - tool: "Terminal"
    step: "copy 3 GB down"
  - tool: "Notebook"
    step: "load the file"
  - tool: "Notebook"
    step: "print the columns"
tally: "3 GB downloaded to read twelve names"
published: null
description: "Three gigabytes downloaded for twelve column names. A file writes its own schema in a few hundred bytes. Read those, nothing else."
---

<!--
Lines:
1. Read the label. Not the whole jar.
2. The column names fit on one page.
3. Ask the file. Don't download it.

Cue:
- three gigs, twelve names
- terminal, wait, notebook
- a tiny corner, on purpose
- Read the label. Not the whole jar.

Board:
  0:00  Read the columns without downloading?                     white                           top
  0:05  cloud, arrow down, laptop                                 amber cloud, pink arrow, white  upper middle
  0:16  3 GB beside the arrow                                     pink                            upper middle, right
  0:40  jar with a small rectangle on its front, LABEL inside it  neon green                      middle
  0:52  Read the label. / Not the whole jar.                      neon green                      lower band
Drawn: 6

Words: 128

Delivery:
- "Gigabytes" is the trip word. Say "gigs" in the middle if it snags; only the first sentence needs the full word.
- The terminal-to-notebook run should sound like a chore list: flat, quick, no emphasis until "Three tools, one line."
- Cut "Not on AWS, not on GCP, not on Azure." first.

Script:
[0:00, walk in]
You downloaded three gigabytes to read twelve column names.
TODAY
[0:05, draw a cloud, an arrow down, a laptop]
All you wanted was the header. The console can't show it. Not on AWS, not on GCP, not on Azure. There's a download button and nothing else.
[0:16, write 3 GB beside the arrow, pink]
So you copy the path. Open a terminal. Run the copy command. Wait. Open a notebook. Load it. Read one line. Three tools, one line.
IDEAL
Start over. Where do the column names live? In a tiny corner of the file. A few hundred bytes. The file already knows what's in it. It wrote that part separately, on purpose, so you'd never need the rest.
[0:40, draw a jar, LABEL on its front, neon green]
So read that corner. Just that. It's the label on the jar. You don't open the jar to read the label.
[0:52, write the line, step out, hold three seconds]
Read the label. Not the whole jar.
-->

Someone asked me whether a parquet file in a bucket had a customer id column in it. I downloaded three gigabytes to read twelve column names.

## Today

All I wanted was the header, the list of columns and their types. The console couldn't show it. On AWS, on Google and on Azure, a parquet file in the console is a name, a size and a download button.

So I copied the path, went to the terminal, and ran the cloud's copy command. I waited while three gigabytes came down. Then I opened a notebook, loaded the file, and printed its columns. Twelve names. The customer id wasn't among them. Three tools for one line of output, and a three gigabyte file on my disk that I didn't need.

<StoryToday />

None of the tools were wrong. The console doesn't read file formats. The copy command copies. The notebook loaded what I pointed it at. The shared assumption was that to learn anything about a file, you first need all of it.

## Ideal

So I looked at where the column names actually live in a parquet file. The format is laid out on purpose for this question. A file starts with the four bytes PAR1. Then come the row groups, which are the data. At the very end sits the footer: the schema, the row counts, and where each column chunk starts. After the footer come four bytes giving its length, and then PAR1 again.

That means a reader can learn the schema from the end of the file alone. Ask for the last eight bytes, read the footer length out of them, then ask for exactly that many bytes before them. Two small reads, and every cloud's storage API accepts a Range request for exactly that. The rest of the file doesn't need to move. It is the label on the jar, printed separately so nobody has to open the jar.

I measured one. The demo file of train stations is 41,876 bytes. Its last eight bytes say the footer is 1,218 bytes long. So the footer region, with its length and the closing PAR1, is 1,226 bytes, about three percent of this small file. In a file of three gigabytes with the same columns, the footer grows with the number of row groups, not with the number of rows, so the share is far smaller.

<StoryPoster />

That is that file in the structure view: the four-byte header, the single row group with a chunk per column, and the footer drawn as its own block at the end, 1.2 KB, which opens to the schema and the rest of the metadata.

## Where it stops

This is the story where the picture is ahead of the plumbing. The structure view is built, and it reads the footer the way the format intends: the last eight bytes, then the footer before them. But today it does that on a copy of the whole file. When the file is in a bucket, the app downloads it into its local cache first, then reads the end. For this 41 KB file that doesn't matter. For three gigabytes it is exactly the download this page complains about.

What is missing is the last step: asking the cloud for the tail of the object instead of the object. Until that is built, the label is readable, but the jar still gets carried home.

**Read the label. Not the whole jar.**
