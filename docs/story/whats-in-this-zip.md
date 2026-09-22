---
title: "See inside a zip without downloading?"
subtitle: "Every zip has a packing list. Show it."
episode: 21
runtime: null
video: null
poster: /screenshot/archive.png
focus: { x: 38, y: 30, width: 40 }
caption: "reference/zip/sample.zip opened like a folder: inside its sample folder, DuckHouse.pptx (2 MB), README.md (3 KB), 2.jpg (103 KB) and TickLang.key._.pdf (1 MB), 4 files, 3 MB in all."
today:
  - tool: "Cloud console"
    step: "forty timestamped zips"
  - tool: "Terminal"
    step: "download one"
  - tool: "Terminal"
    step: "list the zip"
  - tool: "Terminal"
    step: "wrong one, repeat"
tally: "twenty minutes of downloads to read packing lists"
published: null
description: "Forty zips named by timestamp and one of them is live. A zip carries its own packing list. Show it in the folder, without downloading."
---

<!--
Lines:
1. Every zip has a packing list. Show it.
2. A zip knows what's inside. Ask it.
3. Read the box. Don't unpack it.

Cue:
- forty zips, timestamps
- download, list, wrong one
- packing list under the lid
- Every zip has a packing list. Show it.

Board:
  0:00  See inside a zip without downloading?                  white       top
  0:05  three boxes, stacked, no labels                        amber       upper middle
  0:16  large ? beside the stack                               pink        upper middle, right
  0:40  one box, three short list lines beside it, LIST above  neon green  middle
  0:52  Every zip has a packing list. / Show it.               neon green  lower band
Drawn: 7

Words: 125

Delivery:
- "Terminal. Download. List the zip. Wrong one." Fast, flat, bored. It's a loop and the voice should sound stuck in it.
- "Packing list" is the phrase to protect. It's the line; say it exactly that way in the middle too.
- Cut "AWS, GCP, Azure, same three columns." first.

Script:
[0:00, walk in]
You had forty zip files, and every name was a timestamp.
TODAY
[0:05, draw three boxes stacked, amber]
Build one, build two, build three. Which one went out? The console shows a name, a size and a date. AWS, GCP, Azure, same three columns.
[0:16, draw a large ? beside the stack, pink]
So you copy a path. Terminal. Download. List the zip. Wrong one. Copy the next path. Twenty minutes. Still guessing.
IDEAL
Start over. What's a zip? A box of files with a packing list under the lid. The list is tiny. Every name, every size, every date. You've been downloading the whole box to read a note.
[0:40, draw one box with list lines beside it, LIST above them, neon green]
So read the note. Just the note. Show it right in the folder. Which one has the file you changed on Tuesday? That one.
[0:52, write the line, step out, hold three seconds]
Every zip has a packing list. Show it.
-->

A build folder had forty zip files in it, each named with a timestamp. One of them was the build that had gone out, and I needed to know which. The only thing I remembered was a file I had changed on Tuesday.

## Today

The console showed forty rows: a name, a size, a date. On AWS, Google and Azure it is the same three columns. None of them say what is inside a zip.

So I copied a path, went to the terminal, downloaded the zip, and listed its contents. Wrong one. I copied the next path and did it again. Each zip was a few hundred megabytes, so each guess was a download and a wait. Twenty minutes in, I was still guessing, and my Downloads folder was full of builds.

<StoryToday />

Nothing misbehaved. The console lists objects; a zip is an object. The command line downloaded what I asked for, and the zip tool listed it. The shared assumption was that to see what is in a box, you have to carry the whole box home first.

## Ideal

So I looked at how a zip is laid out. It is a box of files with a packing list at the end. Each file is stored one after another, and after all of them comes the central directory: one entry per file, with its name, its size, its date and where in the zip it starts. At the very end is a short record, 22 bytes when there is no comment, that says where the central directory begins and how many entries it has.

That means the packing list can be read without the box. Read the last few bytes, find the directory, read the directory. Every cloud will hand over just those bytes with a Range request. Then show the zip in the folder as what it is, a folder, with its files listed by name, size and date.

I measured one. The sample zip in the reference folder is 3,016,857 bytes. Its end record is 22 bytes and says the central directory holds 9 entries and is 829 bytes long. So the whole packing list is the last 851 bytes of the file, about three hundredths of a percent of it.

<StoryPoster />

That is that zip, opened in place like a folder, showing the four files in its sample folder with their sizes. In the code, the zip reader finds the end record by scanning back from the end, reads the central directory into a listing, and opens any file inside on its own. It also reads zip64, the extension for archives over four gigabytes or with more than 65,535 entries.

## Where it stops

The picture shows the right thing, but it gets there the expensive way. Today the zip reader works on the whole archive in memory, and when the zip is in a bucket, the app downloads all of it into its local cache before listing it or opening one file from it. For this 3 MB zip that is invisible. For forty builds of a few hundred megabytes each, it is the same forty downloads, only without the terminal.

What would make the ideal true is reading the last bytes first, with a Range request, and fetching a single entry by its offset when I open it. The format allows it. The code doesn't do it yet.

**Every zip has a packing list. Show it.**
