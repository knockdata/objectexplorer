---
title: "Count yesterday's files without a script?"
subtitle: "Ask the question. Get the answer."
episode: 22
runtime: null
video: null
poster: /screenshot/story-agent-session.png
focus: { x: 56, y: 50, width: 50 }
caption: "Settings, MCP sessions: every session an agent had with this machine, with when it started, how many calls it made, how much data left, and how many calls were denied."
today:
  - tool: "Cloud console"
    step: "no way to count"
  - tool: "Cloud console"
    step: "find the keys"
  - tool: "Editor"
    step: "write the loop"
  - tool: "Terminal"
    step: "run, fix paging, run"
  - tool: "Editor"
    step: "delete the script"
tally: "forty lines and forty minutes for one number"
published: null
description: "Forty lines of code to count some files, then deleted. The question was four words. Asking it should cost what saying it costs."
---

<!--
Lines:
1. Ask the question. Get the answer.
2. One question. No script.
3. Say it. Don't code it.

Cue:
- forty lines, one count
- keys, loop, retry, delete
- the words were the job
- Ask the question. Get the answer.

Board:
  0:00  Count yesterday's files without a script?  white       top
  0:06  console box, X through it                  amber       upper middle
  0:16  KEYS / LOOP / RETRY, one word per line     pink        upper middle
  0:40  arrow past the stack to 312                neon green  middle
  0:52  Ask the question. / Get the answer.        neon green  lower band
Drawn: 7

Words: 128

Delivery:
- "Translation" is the idea word. It comes twice; mean it both times.
- Draw the pink stack fast and bored. It's a chore list, and the hand should say so.
- Cut "No cloud's console can." first.

Script:
[0:00, walk in]
You wrote forty lines of code to count some files.
TODAY
[0:06, draw a console box with an X through it, amber]
The question took four words. How many landed yesterday. The console can't answer that. No cloud's console can. So you opened an editor.
[0:16, write KEYS / LOOP / RETRY, pink]
Find the keys. Paste the keys. Write the loop. The listing comes in pages, so handle the pages. Run it. Run it. Forty minutes. One number. Then you deleted the script.
IDEAL
Start over. What did you actually want? A number. You had the question in plain words before you touched the keyboard. The words were the whole job. Everything after was translation, into a language the bucket happens to speak.
[0:40, draw an arrow past the stack to 312, neon green]
So skip the translation. Say the question. Get the number. Asking it should take as long as saying it.
[0:52, write the line, step out, hold three seconds]
Ask the question. Get the answer.
-->

I wanted to know how many files had landed in a folder yesterday. The question took four words. I answered it with forty lines of code, which I deleted as soon as I had the number.

## Today

The console lists a folder and shows a date on each file. It doesn't count them for me. So I opened an editor.

First the keys: I found the credentials, and put them where the SDK would find them. Then the loop. The listing comes back in pages, so the loop has to ask for the next page until there isn't one. Then the date comparison, with a time zone, because "yesterday" means something different in UTC. I ran it, fixed the paging, ran it again, and got a number. Forty minutes. Then I deleted the script, because I will never need that exact script again.

<StoryToday />

Nothing was wrong with the SDK or the console. The listing API is well designed for what it is. The shared assumption was that a question about a bucket has to be translated into a program before the bucket can answer it.

## Ideal

So I tried to start from what I had. Before I touched the keyboard, I had the whole question in plain words. The words were the job. Everything after them was translation, into the language the storage API happens to speak: keys, pages, timestamps.

Translation is now something a language model does reasonably well, if it can reach the data. The question then is only how it reaches it. Not with my keys pasted into its environment. Through a door that already holds the sign-in, answers small requests like "list this folder", and writes each request down.

With that, the question stays a question. I ask it in words. The agent turns it into a listing, reads the dates off the listing, counts, and tells me the number. I never see a key or a page token, and the forty lines are never written.

<StoryPoster />

That is where a session like that is kept: one row per session, which opens to the calls the agent made, one after another, each written down before its answer went back. In the code, the tool the agent uses here lists the children of one folder and returns, for each one, its name, kind, size and modified time, which is everything a count of yesterday's files needs. The listing is filtered by the same rules as every other call, so a file the agent may not see is counted as hidden, not shown.

## Where it stops

A listing is capped. By default an agent gets at most 1,000 objects per listing, and a setting can raise that to 10,000. A folder bigger than the cap answers with a flag that says it was truncated, and a careful agent will say so rather than give a wrong count. A folder with fifty thousand files in it is still a job for a script, or for a query over the listing, not for one call.

It is also one folder at a time. "How many landed yesterday, anywhere in this bucket" means the agent walking folders one by one, and every step of that walk is a call against the limits.

And the answer is only as good as the agent's arithmetic. The record shows exactly what it was given, so I can check. I think that is the right way round, but it is still a check.

**Ask the question. Get the answer.**
