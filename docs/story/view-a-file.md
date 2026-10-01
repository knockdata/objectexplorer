---
title: "View a file"
subtitle: "One click, rendered."
episode: 1
runtime: null
video: null
poster: /screenshot/open-a-file.png
recording: /video/view-a-file.mp4
open: folder/demo/cad/nist_ftc_11_asme1_rb.stp
# focus: { x: 64, y: 50, width: 40 }
background: "#202020"
caption: "A 7 KB STEP part in a Cloud Storage bucket, opened where it sits: a washer 63 mm across, drawn from its 6 faces as 1,798 triangles."
today:
  - tool: "Cloud console"
    step: "download"
  - tool: "Slides app"
    step: "open the deck"
  - tool: "Spreadsheet app"
    step: "open the sheet"
  - tool: "CAD program"
    step: "no licence"
  - tool: "parquet file"
    step: "not installed"
  - tool: "Chat"
    step: "ask the author"
tally: "4 files, 4 apps, 2 never opened"
published: 2026-09-14
description: "Four files, four applications, one of them not installed. A file already says what it is. Opening it should be looking at it."
---

<!--
Lines:
1. One click, rendered.
2. Click a file. See the file.
3. A file should show itself.

Cue:
- four files, four apps
- download, open, wrong app
- the bytes say what they are
- One click, rendered.

Board:
  0:00  View a file in cloud storage?  white       top
  0:06  console box, DOWNLOAD inside   amber       upper middle
  0:20  four app boxes stacked, one X  pink        middle
  0:42  one box, a picture inside it   neon green  middle
  0:52  One click, / rendered.         neon green  lower band
Drawn: 8

Words: 125

Delivery:
- Say the file extensions as words, not letters. "The stats export", not "dot s a v".
- Pause after "Four files. Four apps."
- Cut "You gave up and asked the person who made it." first.

Script:
[0:00, walk in]
You needed four applications to look at four files.
TODAY
[0:06, draw a console box with DOWNLOAD inside it, amber]
The console gave you a name, a size and a download button. That's all it has.
[0:20, draw four app boxes stacked, one crossed out, pink]
So you downloaded the deck. It opened in one app. The spreadsheet wanted another one. The stats export wanted a package nobody has installed. Four files. Four apps. You gave up and asked the person who made it.
IDEAL
Start over. How did those apps know what to do? The file told them. The first few bytes of any file name its format. It's been that way since before you were born.
[0:42, draw one box with a picture inside it, neon green]
So the thing showing you the folder can read those bytes too. A picture is a picture. Showing it is the oldest thing a screen does.
[0:52, write the line, step out, hold three seconds]
One click, rendered.
-->

There are lots of treasure in our cloud storage. But where are they exactly located? How do we find them?

## Today

Find what we want on cloud storage is like looking a gold on a beach, you know it's there but take hours to find it.

We normally go to cloud console, click here and there in a bunch tabs, download it, try to open. Hopefully the file type is what your computer already support it. While for quite some of the time, they are just special binary format, a parquet file, a SAS file, a sqlite database, a Blender model, a SolidWorks design. We then need to find and install proper tool if we have lucky to have the license. After struggling for a half hour, we finally made it.

<StoryToday />

## Ideal Solution

If we think an ideal solution without any external constraints, what could be possibly be?

We can open a cloud storage like normal tree. Click the one we want it. Then boom, it just open.

We shall not care about what format it is. That's the system's responsibility. Isn't it?

<StoryPoster />

Just one click to open anything. 
