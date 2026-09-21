---
title: "Find one image in four thousand?"
subtitle: "The folder is a grid of pictures."
episode: 8
runtime: null
video: null
poster: /screenshot/story-image-grid.png
caption: "A folder of 240 generated images in the grid view: every card is the picture itself, with its name under it. One of them, somewhere below, is a checkerboard."
today:
  - tool: "Cloud console"
    step: "4,000 filenames"
  - tool: "Terminal"
    step: "sync whole prefix"
  - tool: "Photo viewer"
    step: "scroll, find ten"
  - tool: "Terminal"
    step: "delete the copy"
tally: "4 GB downloaded to keep ten images"
published: 2026-09-14
description: "Four thousand generated images listed as four thousand filenames, so the whole prefix came down to a laptop to be looked at."
---

<!--
Lines:
1. The folder is a grid of pictures.
2. A folder of pictures should look like pictures.
3. Show the picture, not the filename.

Cue:
- four thousand names, no pictures
- sync it all, scroll, delete
- a thumbnail is a corner
- The folder is a grid of pictures.

Board:
  0:00  Find one image in four thousand?     white       top
  0:06  list of NAME / NAME / NAME lines     white       upper middle
  0:20  4 GB down, arrow to a bin            pink        upper middle, right
  0:42  grid of nine small squares           neon green  middle
  0:52  The folder is / a grid of pictures.  neon green  lower band
Drawn: 8

Words: 130

Delivery:
- Read the filename list out loud in a flat monotone. The boredom is the point.
- Pause after "Three thousand nine hundred and ninety were wrong."
- Cut "Scroll it like any folder of photos." first.

Script:
[0:00, walk in]
A model wrote four thousand images, and the console showed you four thousand filenames.
TODAY
[0:06, draw a list of NAME / NAME / NAME lines, white]
Every name a long string of digits. No pictures. The console has never shown a picture in its life.
[0:20, draw 4 GB coming down, an arrow to a bin, pink]
So you synced the whole prefix to your laptop. Four gigabytes. Scrolled through it. Then deleted the folder. You paid egress on all four thousand, and three thousand nine hundred and ninety were wrong.
IDEAL
Start over. It's a folder of pictures. It should look like pictures. And a thumbnail isn't the whole image. It's a corner of the file, a few kilobytes, and the cloud will happily hand you just that part.
[0:42, draw a grid of nine small squares, neon green]
So show the grid. Scroll it like any folder of photos. Zoom in. Take the ones that worked.
[0:52, write the line, step out, hold three seconds]
The folder is a grid of pictures.
-->

A model wrote four thousand images into a bucket overnight. About ten of them were what I wanted. I needed to find those ten, and the console showed me four thousand filenames, each a long string of digits.

## Today

The console lists objects. For an image that means a name, a size and a date, the same as for any other file. I clicked one and got a details page with a download link. Clicking through four thousand of those was not going to happen.

So I synced the whole prefix to my laptop from the terminal. Four gigabytes. When it finished I opened the folder in a photo viewer, scrolled through it, and picked the ten that worked. Then I deleted the local copy, because I didn't want four gigabytes of rejects on my disk. Every one of those four thousand images was downloaded once, paid for once as egress, and looked at for a fraction of a second.

<StoryToday />

Nobody did anything wrong. The console showed the objects the way it shows all objects. The sync command did exactly what it says. The shared assumption was that looking at a picture in a bucket requires the whole folder to be on my disk first.

## Ideal

So what did I actually want? To see the pictures, a screenful at a time, and pick. A folder of images should look like a folder of images, the way it does on every phone.

The question is what that costs. A screen shows a few dozen cards. I scroll through the rest at the speed I can look, and most of them I never stop on. So the cost that matters is not four thousand images. It is the images on the screen, plus a few just below it so they are ready when I get there. Everything I never scroll to should never be fetched.

That is only half the saving I hoped for, and it took me a while to see why. My first idea was that a thumbnail is a small part of the file: many camera JPEGs carry a small preview near the start, which a Range request can fetch on its own. But images from a model are usually PNGs, and a PNG has no standard place for a preview. For those, the only honest options are to fetch the image, or to have something inside the cloud make a small copy first.

<StoryPoster />

That is a folder of generated images in the grid view. In the code, each card starts as an icon and swaps in the real picture only when it comes within 200 pixels of the visible area; a card I never scroll near never asks for its image. The listing itself arrives a page at a time, a thousand objects per page on S3 and Google, and the next page is requested as I reach the bottom.

## Where it stops

Each card that does load, loads the whole image, not a small version of it. There is no thumbnail step yet: no reading of an embedded preview, no resizing on a server. So for large images, the grid is cheaper than a sync only by the images I don't scroll to, and if I do scroll through all four thousand, I have downloaded all four thousand.

What it does remove is the local copy, the photo viewer, and the delete afterwards. I think the real fix for generated images is a small copy made next to the original, and that is not built.

**The folder is a grid of pictures.**
