---
title: "Prove what the agent read?"
subtitle: "Every call, written down first."
episode: 15
runtime: null
video: null
poster: /screenshot/story-agent-session.png
focus: { x: 56, y: 50, width: 50 }
caption: "Settings, MCP sessions: every session an agent had with this machine, with when it started, how many calls it made, how much data left, and how many calls were denied."
today:
  - tool: "Cloud console"
    step: "find access logs"
  - tool: "Cloud console"
    step: "logs were off"
  - tool: "Log query"
    step: "principal read prefix"
  - tool: "Meeting"
    step: "we don't know"
tally: "hours of log digging for no answer"
published: 2026-09-14
description: "Access logs say a principal read a prefix, hours later, if they were switched on. The thing deciding is the thing that knows."
---

<!--
Lines:
1. Every call, written down first.
2. Write it down before you answer.
3. Say what it read. Show the rows.

Cue:
- someone asks what it read
- a principal read a prefix
- write it down before answering
- Every call, written down first.

Board:
  0:00  Prove what the agent read?             white       top
  0:06  PRINCIPAL / READ / PREFIX, a log line  amber       upper middle
  0:20  large ? beside it                      pink        upper middle, right
  0:44  numbered list of calls, ticks          neon green  middle
  0:52  Every call, / written down first.      neon green  lower band
Drawn: 7

Words: 128

Delivery:
- Read the log line out loud flatly, the way a machine wrote it. Then the question lands.
- Pause after "That is not an answer."
- Cut "Hours later, if somebody switched them on." first.

Script:
[0:00, walk in]
Someone asked what the agent had read, and the honest answer was: we don't know.
TODAY
[0:06, write PRINCIPAL / READ / PREFIX as a log line, amber]
The cloud keeps access logs. Hours later, if somebody switched them on.
[0:20, draw a large ? beside the line, pink]
And they say a principal read a prefix. Which objects? How many rows? What went back in the answer? That is not an answer. It's a receipt for the door being opened.
IDEAL
Start over. Who knows what the agent read? The thing that decided to let it. It saw the question, it picked the rows, it sent them. It knew everything, at that moment, and then it threw it away.
[0:44, draw a numbered list of calls with ticks, neon green]
So write it down before the answer leaves. The rule that allowed it, the rows, the bytes. Then anyone can walk the session back, in order.
[0:52, write the line, step out, hold three seconds]
Every call, written down first.
-->

A few weeks after an agent was given access to some production data, someone asked a fair question: what did it actually read? The honest answer, after a morning of looking, was that we didn't know.

## Today

The cloud keeps access logs for storage. On one of the clouds they had to be switched on per bucket, and they hadn't been. On the other they were on, and I queried them in the console's log explorer. They arrive with a delay, and what they record is a request: this principal read this object at this time.

That is a lot less than the question. It told me the agent's key had touched a set of objects. It didn't say which question it had been answering, how many rows it took out of each file, or what it sent back to the person who asked it. A log line that says a door was opened is not the same as knowing what came through it.

<StoryToday />

The logs did what they were built for, which is auditing access to storage. Nobody did anything wrong. The shared assumption was that the record of what an agent read can be reconstructed afterwards, from the outside, by the storage.

## Ideal

So I asked who actually knows what the agent read. Not the storage. The storage saw requests for bytes. The thing that knew was whatever stood between the agent and the data at the moment it answered. It saw the question. It decided whether the rules allowed it, and which rule. It picked the rows. It measured the answer. At that moment it knew everything the auditor would later want, and in most setups it then threw it away.

So write it down there, at that moment, and before the answer leaves. The order matters. If the record is written after the answer is sent, a crash between the two leaves an answer with no record, which is the one case an audit is for. Written first, the worst case is a record of an answer that never arrived.

And write down what was decided, not what was sent. The rows themselves shouldn't go into the log, or the log becomes a second copy of exactly the data the rules were protecting.

<StoryPoster />

That is the list of sessions, and each one opens to its calls, one by one. In the code every call, allowed or denied, is appended to a file for that agent and that session before the answer is handed back, and the append is synchronous, so a process that is killed still has everything it answered. Each record holds the time, the tool, the arguments, the object, the decision, the step and rule that decided it, how many rows and bytes the answer held, and how long it took. The rows themselves are never stored. There is a setting for how long records are kept, 30 days by default, but nothing deletes an old session file yet, so today they stay until I remove them.

## Where it stops

This covers what an agent read through this door. If the same agent also holds a key of its own, what it reads with that key is back to the storage's logs. The record is only complete if the door is the only way in, and nothing in the app can enforce that on its own.

The files also live on the machine running the app. That is fine for one person asking what their agent did. An organisation that wants these records in one central place will have to ship them there, and I haven't built that part.

**Every call, written down first.**
