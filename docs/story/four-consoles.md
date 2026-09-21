---
title: "Find a file across four clouds?"
subtitle: "A folder is a folder. Learn it once."
episode: 17
runtime: null
video: null
poster: /screenshot/tree-providers.png
caption: "One tree: a local demo folder open at the top, and below it two Google Cloud Storage buckets, an S3 bucket and an Azure storage account, each opening the same way."
today:
  - tool: "AWS console"
    step: "search the buckets"
  - tool: "Azure portal"
    step: "search the containers"
  - tool: "Google console"
    step: "search the buckets"
  - tool: "File server"
    step: "search the share"
  - tool: "Terminal"
    step: "three CLIs, three logins"
tally: "4 tabs, 3 command lines, 7 logins, one file"
published: null
description: "Bucket, container, share. Three names for one thing, and folders that are not folders. It should be one picture, one click."
---

<!--
Lines:
1. A folder is a folder. Learn it once.
2. Four clouds. One way to open a folder.
3. Same file. Same click. Any cloud.

Cue:
- four tabs, one file
- bucket, container, share
- a place that holds files
- A folder is a folder. Learn it once.

Board:
  0:00  Find a file across four clouds?                 white       top
  0:05  BUCKET / CONTAINER / SHARE, one word per line   amber       upper middle
  0:18  bracket down the left of the stack, SAME THING  pink        upper middle, left
  0:40  folder shape, FOLDER under it                   neon green  middle
  0:52  A folder is a folder. / Learn it once.          neon green  lower band
Drawn: 7

Words: 127

Delivery:
- "Container" is the word that gets swallowed. Slow down on it; the three names need equal weight.
- Pause after "Same thing." Let the stack sit on the glass before "Three names."
- Cut "Four consoles, three command lines, seven logins." first.

Script:
[0:00, walk in]
You opened four tabs to find one file.
TODAY
[0:05, draw BUCKET / CONTAINER / SHARE, stacked, amber]
On AWS it's in a bucket. On Azure it's in a container. On the file server it's in a share. Same thing. Three names.
[0:18, pink bracket down the stack, SAME THING beside it]
And none of them agree on what a folder is. Two of them fake it with a slash in the name. Rename one, and it copies every file underneath, one by one. Four consoles, three command lines, seven logins.
IDEAL
Start over. What is this thing? It's a place that holds files. You've known that since you were six. There's a picture for it. It opens when you click it.
[0:40, draw a folder, FOLDER under it, neon green]
So that's what it should be. Everywhere. Same picture. Same click. You learn it once, and you're done.
[0:52, write the line, step out, hold three seconds]
A folder is a folder. Learn it once.
-->

I was looking for one file and didn't know where it had been put. It could have been in any of the places our team keeps files. I opened four tabs.

## Today

On AWS it would be in a bucket. On Azure it would be in a container, inside a storage account. On Google it would be in a bucket again, with a different console and different buttons. On the file server it would be in a share. Each console has its own layout, its own search box, and its own idea of where you start.

None of them agree on what a folder is, either. In object storage there are no folders underneath. There are keys with slashes in them, and the console draws folders by grouping keys on the slash. Most of the time that looks exactly like a folder. Then you rename one, and it copies every file underneath it, one by one, and deletes the originals. I knew that. I still opened four consoles and three command lines, and logged in seven times across them.

<StoryToday />

Each console is well made for its own cloud. The problem is that I don't work in one cloud. The shared assumption was that each storage service is its own world, with its own vocabulary, so a person who uses four of them learns four worlds.

## Ideal

So I asked what all of these things are. A bucket, a container, a share. As far as I can tell, to the person looking for a file, they are one thing: a place that holds files, some of them in folders. That picture is older than any of these services, and every person who has used a computer already knows how it works. You click it and it opens.

Underneath, the services really do differ. But the part a person touches is the same everywhere. Every one of these APIs can list what is under a prefix, grouped by the slash, a page at a time. That is a folder listing. So the same folder picture can sit on top of all of them, and I learn it once.

Where they differ, the picture should stay honest. A rename in object storage is a copy and a delete, and it should behave like one: never deleting the originals until every copy has come back.

<StoryPoster />

That is one tree with a local folder and buckets from three clouds, each drawn the same way and opened the same way. In the code, S3, Google Cloud Storage and Azure Blob are all listed with the slash as the delimiter, so their grouped prefixes become folders. Renaming a folder in any of the three copies every key under it and runs the delete only after all the copies are back. A local folder is renamed for real.

## Where it stops

The file server is the gap. A share on a Windows file server is not one of the places the tree can open; S3 and compatible stores, Google, Azure Blob, OneLake and local folders are. And a folder rename in object storage is still as slow as copying everything under it, because that is what it is. The picture can hide the vocabulary. It can't make a copy free.

And I still sign in once per cloud. The tree gathers the places; it does not make them one account.

**A folder is a folder. Learn it once.**
