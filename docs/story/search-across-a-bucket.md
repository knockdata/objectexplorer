---
title: "Search across a bucket?"
subtitle: "Type, search, every match."
episode: 2
runtime: null
video: null
poster: /screenshot/search.png
focus: { x: 22, y: 40, width: 45 }
caption: "A search for \"station\": 18 results in 13 files, found inside a README, a Python script, a JSON file and the metadata of an HDF5 file, with the demo folder listed beside the results."
today:
  - tool: "Cloud console"
    step: "prefix search, nothing"
  - tool: "Cloud console"
    step: "open each folder"
  - tool: "Terminal"
    step: "list whole bucket"
  - tool: "Terminal"
    step: "grep the names"
  - tool: "Second cloud CLI"
    step: "do it again"
tally: "2 clouds, every name listed, no file looked inside"
published: 2026-09-14
description: "The console search box matches a prefix in the folder you are standing in. Searching is the oldest thing a computer does."
---

<!--
Lines:
1. Type, search, every match.
2. Type a word. Find every file.
3. Search should look inside the files.

Cue:
- forty files, one date apart
- prefix only, this folder only
- searching is what it's for
- Type, search, every match.

Board:
  0:00  Search across a bucket?        white       top
  0:06  search box shape, empty        white       upper middle
  0:18  PREFIX / THIS FOLDER, stacked  pink        upper middle
  0:42  search box, three arrows out   neon green  middle
  0:52  Type, search, / every match.   neon green  lower band
Drawn: 7

Words: 127

Delivery:
- "Prefix" is the one piece of jargon. Say it plainly, it earns itself in the next sentence.
- Pause after "It only matches the beginning."
- Cut "Then you did it again on the other cloud." first.

Script:
[0:00, walk in]
You searched a bucket and it found nothing, twice.
TODAY
[0:06, draw an empty search box, white]
The folder had forty files. The names differed by a date. You knew one word that was in the right one.
[0:18, write PREFIX / THIS FOLDER under the box, pink]
But the console's search box only matches the beginning of a name. And only in the folder you're standing in. It never looks inside a file. So you listed the whole bucket in the terminal and grepped the names. Then you did it again on the other cloud.
IDEAL
Start over. Searching is the oldest thing a computer does. Your laptop does it across a million files, inside the documents, while you type.
[0:42, draw a search box with three arrows leaving it, neon green]
Nothing about a bucket makes that harder. Type the word. Search the names and the contents. Search every place at once.
[0:52, write the line, step out, hold three seconds]
Type, search, every match.
-->

The folder had forty files whose names differed only by a date. I knew one word that was inside the right one. I typed that word into the console's search box and it found nothing. I typed it into the other cloud's console and it found nothing there either.

## Today

The search box in the console matches the beginning of a name, in the folder I am standing in. It does not look in subfolders, and it never looks inside a file. That is not a bug. It is how the listing works underneath: every one of these clouds lists objects by prefix, a page at a time, and the search box is that prefix with a text field on it.

So I went to the terminal, listed the whole bucket, and grepped the names. That told me which files might be relevant, but the word I remembered was inside a file, not in its name. Then I did the same on the second cloud, because the files I cared about were split between the two.

<StoryToday />

Nobody did anything wrong. The console showed me what a prefix listing can show. The command line listed what I asked it to list. The shared assumption was that searching a bucket means searching the names in it, one cloud at a time.

## Ideal

What I wanted is what my laptop has done for as long as I can remember: type a word, get every file with that word in it, names and contents, from everywhere I keep files, in one list.

As far as I can tell, nothing about a bucket makes that harder in principle. Contents are just bytes, and bytes can be read. The difference is that my laptop keeps the bytes next to the search, and a bucket keeps them across a network. So the search has to read what is already near it first, and go and fetch the rest only when I ask.

There is a second part people forget. Many files in a data bucket are binary: parquet, Avro, ORC, Arrow, HDF5, netCDF. Grep sees nothing useful in them. But each of those formats writes its column names and metadata in a structured part of the file. Turn that part into text and it becomes searchable like anything else.

<StoryPoster />

That is one search box across every place I have connected. The word "station" was found in a README, in a Python script, in a JSON file, and in the metadata of an HDF5 file, which a text search would have skipped. The search walks each place in turn and reads every file line by line, shows the top three matches per file, and stops after a thousand matching files so a vague word cannot run forever.

## Where it stops

The instant search reads what is already on this machine: local folders, and cloud objects that have been opened or cached before. For the rest there is a separate, deliberate button that scans a remote bucket in full. It downloads every object up to 5 MB so it can be searched, and lists anything larger for me to search one by one, which downloads that one file. On a large bucket that scan is slow and costs egress. I don't think that can be avoided without an index built inside the cloud itself.

So the promise is honest only halfway. One box, every place, names and contents, yes. Without reading the bytes, no.

**Type, search, every match.**
