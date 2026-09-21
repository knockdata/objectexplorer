---
title: "Know if a file is really here?"
subtitle: "A file is here, or it isn't."
episode: 18
runtime: null
video: null
poster: /screenshot/story-on-disk.png
caption: "A folder in iCloud Drive with ten files. Five show the bytes they occupy on this disk; the other five, the same size in the list, show a download icon: they are only in the cloud."
today:
  - tool: "Sync client"
    step: "folder looks full"
  - tool: "File browser"
    step: "name, size, icon"
  - tool: "Plane"
    step: "open it, nothing"
  - tool: "Mounted bucket"
    step: "same promise"
tally: "2 GB listed, 0 bytes on the disk"
published: null
description: "A synced folder showed a name and a size. On the plane, nothing was on the disk. Here or not is one bit, and the list should show it."
---

<!--
Lines:
1. A file is here, or it isn't.
2. Look at a file. Know if it's there.
3. Your disk should tell you the truth.

Cue:
- plane, file gone
- size was an opinion
- here or not = one bit
- A file is here, or it isn't.

Board:
  0:00  Know if a file is really here?                      white                    top
  0:05  cloud, arrow down, file                             amber cloud, white rest  upper middle
  0:16  trace the file's outline again, leave it hollow     pink                     over the file
  0:40  two files stacked: top filled solid, bottom hollow  neon green, white        middle
  0:52  A file is here, / or it isn't.                      neon green               lower band
Drawn: 6

Words: 129

Delivery:
- "Two gigabytes, it said." Land on "said". That's the whole joke; don't rush past it.
- Pause after "That's one bit." It's the turn, and the green marker comes out right after.
- Cut "It had a name." first, then the mounted bucket sentences.

Script:
[0:00, walk in]
You opened your laptop on a plane and the file was gone.
TODAY
[0:05, draw a cloud, an arrow down, a file]
It was in your folder yesterday. It had a name. It had a size. Two gigabytes, it said. Same icon as every other file.
[0:16, trace the file hollow, pink]
But that number was the file's opinion about itself. Nothing was on the disk. The sync client showed you a promise, not a thing. Same with a mounted bucket. It lists every object. Almost none are on the disk.
IDEAL
Start over. A file is either on this machine or it isn't. That's one bit. Your computer knows the answer exactly. It's the one thing it can't be wrong about.
[0:40, draw two files stacked, one solid green, one hollow]
So show it. Not on hover. Not in a menu. In the list, where you're already looking.
[0:52, write the line, step out, hold three seconds]
A file is here, or it isn't.
-->

I opened my laptop on a plane to work on a file I had been using the day before, and it wasn't there. The folder was there. The name was there. It said two gigabytes. The bytes were not.

## Today

The file lived in a folder my sync client keeps in step with the cloud. The day before, I had seen it in the list with its name, its size and the same icon as every other file. What I didn't know was that the sync client was in streaming mode. It had listed the file without downloading it, and the size in the list was the size of the file in the cloud, not the space it took on my disk.

Without a network, opening it failed. A mounted bucket behaves the same way: it lists every object in the bucket, with sizes, and almost none of them are on the disk until something reads them.

<StoryToday />

The sync client wasn't wrong to stream. Keeping every file of a large drive on a small disk would be worse. The file browser wasn't wrong to show the size it was given. The shared assumption was that a file shown in a list is a file on the machine, and for most of computing history that was true.

## Ideal

So I tried to think about what I needed to know. A file is either on this machine or it isn't. That is one bit, and it is the one fact about the file my own computer can answer exactly, without asking anyone.

How does it know? A file on disk takes up blocks. The operating system reports two numbers for every file: its size, which is what the file says it is, and the blocks it has allocated, which is what it actually occupies. A placeholder from a sync client reports its full size and allocates nothing. So a file with a size and zero blocks is a promise, not a thing.

There is one catch. A sparse file, which some programs write on purpose, also allocates less than its size. So the check is only safe inside a folder that a sync client owns, where "allocates nothing" means the provider is holding the file. Anywhere else, the honest answer is "I don't know".

And then show it. Not on hover, not in a properties dialog. In the list, beside the size, where I am already looking.

<StoryPoster />

That is the ON DISK column, beside SIZE, in a folder of iCloud Drive. Every file has a size; only half have bytes on this disk. The tour PDF says 95 KB in SIZE and nothing in ON DISK, which is exactly what the plane would have taught me. In the code, the synced folders are found once per run: on macOS the provider folders under Library/CloudStorage and iCloud Drive, on Windows the sync roots registered with the system. Inside them a file with a size above zero and zero allocated blocks is a placeholder. The column shows the blocks times 512 bytes when there is something on disk, and a download icon when there isn't, which fetches the file when clicked. For a bucket, the same column shows what the local cache holds.

## Where it stops

On Windows the synced folders are found, but the operating system's file information doesn't include allocated blocks the way macOS reports them, so every file there reads as unknown and the column is not shown at all. On Linux there is no sync provider to ask about yet. The one bit is only answered on a Mac.

It also answers for the moment the folder was listed. A sync client can evict a file a minute later to free space, and the list won't know until it is read again.

**A file is here, or it isn't.**
