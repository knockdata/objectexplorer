---
title: "Share a result without the PII?"
subtitle: "Rewrite the columns, send the link."
episode: 9
runtime: null
video: null
poster: /screenshot/share.png
focus: { x: 45, y: 50, width: 55 }
caption: "The share dialog for nl_train_stations.parquet: each column set to None, Mask, Hash or FPE (uic is FPE, name_long masked for characters 0 to 4, slug hashed to 16 hex characters), three sample rows shown before and after, an expiry of one week picked, and Copy URL, Email and Copy key."
today:
  - tool: "Cloud console"
    step: "download the file"
  - tool: "Spreadsheet app"
    step: "delete columns by hand"
  - tool: "Spreadsheet app"
    step: "save a copy"
  - tool: "Email"
    step: "attach and send"
tally: "one hand edit, two inboxes, no expiry"
published: 2026-09-14
description: "Personal columns deleted by hand, then emailed into two inboxes forever. They have names: rule them once, for a link or an agent."
---

<!--
Lines:
1. Rewrite the columns, send the link.
2. Send the answer. Keep the names.
3. The email is forever. The link isn't.

Cue:
- export, delete columns, hope
- two inboxes, forever
- the columns have names
- Rewrite the columns, send the link.

Board:
  0:00  Share a result without the PII?        white       top
  0:06  table shape, two columns shaded        white       upper middle
  0:20  arrow to envelope, FOREVER under it    pink        upper middle, right
  0:42  same table, two columns blacked out,   neon green  middle
        link shape beside it
  0:52  Rewrite the columns, / send the link.  neon green  lower band
Drawn: 8

Words: 129

Delivery:
- Say "the personal columns" out loud, not the three letters. The board carries the initials.
- Pause after "Hoped you got them all."
- Cut "You could list them right now." first.

Script:
[0:00, walk in]
You deleted the private columns by hand and hoped you got them all.
TODAY
[0:06, draw a table with two columns shaded, white]
Somebody asked for the numbers. The file has names and emails in it. Sharing the object hands over everything.
[0:20, draw an arrow to an envelope, FOREVER under it, pink]
So you exported it. Deleted the columns by hand. Hoped you got them all. Then attached it to an email, and now it lives in two inboxes forever.
IDEAL
Start over. You weren't sending a file. You were answering a question. And the columns that must not leave aren't a mystery. They have names. You could list them right now.
[0:42, draw the same table with two columns blacked out, a link beside it, neon green]
So say it once, at the door. This column is hashed. This one is masked. This one doesn't go. Then send a link that can expire, instead of a file that can't.
[0:52, write the line, step out, hold three seconds]
Rewrite the columns, send the link.
-->

Someone from another team asked for the numbers in a file. The file also had names and email addresses in it. I deleted those columns by hand, sent the rest as an attachment, and hoped I had found them all. That week an agent on my machine asked to read the same file, and I had no answer ready for it either.

## Today

Sharing the object from the console would have handed over everything. I downloaded the file, opened it in a spreadsheet, and scrolled across looking for anything personal. I deleted the name column and the email column. I deleted a column of codes too, because I wasn't sure about it. I saved a copy under a new name and attached it to an email.

Now it lives in my sent folder and in their inbox, and there is no way to take it back.

<StoryToday />

I don't think I did anything wrong, and neither did the spreadsheet or the email. The shared assumption was that sharing a result means sending a file: a whole copy, edited by hand, with no rules attached to it once it leaves. And what I decided about the email column lived in one spreadsheet, where the agent would never see it.

## Ideal

So I tried to start from what I was really doing. I wasn't sending a file. I was answering a question, and the answer needed some columns and not others.

The columns that must not leave have names. I could have listed them before I opened the file. So the rule belongs at the door, stated once per column: this one goes as it is, this one is hidden, this one is replaced. And it is the same door whoever stands outside it. A colleague opening a link and an agent calling over MCP are both data leaving my machine, so I think the rules should be written once and hold for both.

Hidden doesn't have to mean deleted. A keyed hash keeps equal values equal and nothing else. A mask stars out part of a value. Format-preserving encryption swaps a value for another of the same shape, so a phone number still looks like one. And an email address inside a note has no column to be named by, so a second list matches what a value says and replaces only that.

The last part is the envelope. An attachment can't expire. A link can, if whatever serves it checks the date.

<StoryPoster />

That is the dialog for the train stations file. Each column opens on what my rules already say, and I can change one for this share alone. The rows at the bottom show each value as it is and as it will go.

In the code both readers go through one implementation on my own machine. Every call an agent makes asks for both lists and has no way to ask for less, and every column it gets rewritten is marked as encrypted. A share asks for the same two lists, with the dialog's choices tried first, and the preview is that same answer.

What differs is the key. An agent's answers use one key per install, so a value stays the same across sessions. A share gets a key of its own, never put into the link, so two shares of one file don't line up with each other or with what an agent saw.

The link lives from one day to one year, one week by default.

## Where it stops

A column can't be dropped from a share yet. A rule that says "drop" opens as a hash there, so the receiver sees the header over meaningless values, while an agent never sees the column at all. And a small share travels inside the link, carrying its expiry as a date the viewer checks. Anyone who keeps the link keeps the data. Only a stored share can truly stop answering.

A share is rows, not files, up to 5,000 of them. An agent can read more than rows, and a drawing or a window of raw bytes has nothing for either list to catch, which is why an agent starts without the tool that reads them.

**Rewrite the columns, send the link.**
