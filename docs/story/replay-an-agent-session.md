---
title: "Replay what an agent did?"
subtitle: "Play the session back, call by call."
episode: 24
runtime: null
video: null
poster: /screenshot/story-agent-replay.png
focus: { x: 75, y: 40, width: 45 }
caption: "A session replayed from its row in Settings → MCP sessions: the window opens again what the agent opened, in order — demo/, cars.sas7bdat, then the parquet file it queried — while the panel in the corner ticks off each step. The refused reference/.env opens nothing."
today:
  - tool: "Editor"
    step: "scroll the transcript"
  - tool: "Cloud console"
    step: "query the access log"
  - tool: "Spreadsheet"
    step: "line up two clocks"
  - tool: "Browser"
    step: "open each file again"
tally: "two records, two clocks, one afternoon"
published: null
description: "The agent's answer was wrong and its run was over. What it asked and what it read were in two files. Put them side by side, then press play."
---

<!--
Lines:
1. Play the session back, call by call.
2. Replay the run. See what it saw.
3. What it opened, opened again, in order.

Cue:
- the answer was wrong
- two lists, two clocks
- it's already written down
- Play the session back, call by call.

Board:
  0:00  Replay what an agent did?            white       top
  0:05  long scroll of lines                 amber       upper middle, left
  0:18  second list beside it, ? between     pink        upper middle, right
  0:40  two columns joined by lines          neon green  middle
  0:46  play triangle under them             neon green  middle
  0:52  Play the session back, / call by call. neon green lower band
Drawn: 6

Words: 113

Delivery:
- "Thousands of them." Let it sit.
- Pause after "in the order it saw it."
- Cut "with its own times" first.

Script:
[0:00, walk in]
The answer was wrong, and the agent's run was already over.
TODAY
[0:05, draw a long scroll of lines, amber]
So you went looking for why. The agent's transcript is a file of JSON, one line per message. Thousands of them.
[0:18, draw a second list beside it, a question mark between them, pink]
Then the cloud's access log, in the console, with its own times. You lined the two up by hand, minute by minute, to guess which read answered which question.
IDEAL
Start over. What do you want to know? What it saw, in the order it saw it. That's already written down, call by call.
[0:40, draw two columns joined by lines, then a play triangle under them, neon green]
So put the conversation beside the calls. Then press play, and open each file again, in order, the way it did.
[0:52, write the line, step out, hold three seconds]
Play the session back, call by call.
-->

An agent gave me a number that turned out to be wrong. By the time anyone noticed, the run was long over. I didn't need to know whether it had been allowed to read things. I needed to see what it had looked at, in order, to find the step where it went off.

## Today

There were two records, and neither was meant for this. The agent's client keeps a transcript, a file with one JSON object per line: my question, every message the model sent, every tool it dispatched. I scrolled through it in an editor. It said which tools were called, with their arguments, and then a great deal of model output.

The other record was the cloud's access log. I queried it in the console for the agent's principal and got objects and times. Then I put the two in a spreadsheet and tried to line them up by minute, to guess which read belonged to which step of the conversation. Then I opened the files it had read, one at a time, to see what it had seen.

<StoryToday />

Nobody did anything wrong. The transcript is the client's diary, written for the client. The access log is the storage's, written for the storage. The assumption they share is that the story of a run gets pieced together afterwards, by a person, from records that were never meant to meet.

## Ideal

So I started from the question I had: what did it see, in the order it saw it? That is a sequence, and a sequence is something you can play.

Half of it already exists. If the agent reads through a door that decides each call, the door writes every call to a file for that agent and that session before it answers: the time, the tool, the arguments, the object, the decision, the rule, the rows and the bytes. Never the data itself.

The other half is the transcript, and here I have to be careful. Nothing in the protocol joins a transcript to a session. The client never tells the door which conversation a call came from. So they are joined the only way they can be, by time and by content: a transcript counts a step only if the session has a call with the same tool and the same arguments within a minute of it. The transcript that agrees on the most steps is taken as that session's.

A row in the list of sessions opens that session as a tab. At the top is the conversation drawn as a sequence: the question, each request to the model, each tool call. Each call to the door carries what it actually reached. Below is the door's own table, and clicking an object opens it.

Then there is Replay, on the session's row and on the tab. It opens again, in this window and in order, everything the agent opened: a folder it listed, an object it read. It spends 700 milliseconds on each step, and a refused call opens nothing. It asks nothing of the rules. It is the window showing me what the agent saw. Escape stops it.

<StoryPoster />

That is Replay pressed on a session's row in MCP sessions. The dialog has closed and the window is opening what the agent opened: the demo folder, the SAS file it described and summarised, and now the parquet file it queried. The panel in the corner ticks off the steps as they go. reference/.env is crossed out. The agent was refused it, so there is nothing to open.

## Where it stops

The join is a guess, and I watched it guess wrong. When I ran a second session a minute after the first, making some of the same calls, it was matched to the first session's transcript too. And it only reads one client's transcript format. For any other agent the tab shows the door's table with a note where the conversation would be.

There is also a setting for how long the calls are kept, 30 days by default. As far as I can tell from the code, nothing deletes old sessions yet, so for now they are kept until someone removes the files.

**Play the session back, call by call.**
