# Translate and QLingo

A word you meet, in every language you learn, where you met it; and the words you translated come
back as flash cards. It runs on the agent you already use, on this machine, in the desktop app and
in the page `objectexplorer` serves from your own machine.

Translate and QLingo need an agent set up in **Settings → Ask** — see [Ask an agent](/agents/ask).
At objectexplorer.com/app, Translate offers to download the app instead.

## Translate

Select a word — in a PDF, an ebook, code, a text field, a [Browser](/explore/browser) page — and
right-click: **Translate**, after **Ask…**, opens a card where you pressed. It shows the word in each
language you learn, with its reading and a 🔊 that says it in your computer's voice for that
language. **Already Know** takes the word out for good. The card closes on **Esc** or a press
elsewhere.

## QLingo

**Open QLingo Sidebar** in the command palette opens the cards beside the panes, one at a time: the
word and the sentence it was met in, every language on it. **Next** decides when the card comes
back by how often you pressed 🔊 on it; **Already Know** cuts it, and it never comes back. A ring
at the top counts the day's new words against your goal.

Words come in from what you translate, from the last line of an **Ask…** answer (the agent names
its hardest words), from a topic typed in Settings, and from **Mark New Words**: the **Q** before a
Markdown file's, a PDF's or an ebook's search, or the button in the Browser's toolbar, takes the
hardest words of the chapter or the page you are reading, and marks every word of your cards there.

## Settings → QLingo

| Setting                        | What it sets                                                                |
|--------------------------------|-----------------------------------------------------------------------------|
| **Languages**                  | the languages you learn, ticked and in your order                           |
| **Translate with**             | which agent of **Settings → Ask** translates; Claude Code's model beside it |
| **New words a day**            | the goal                                                                    |
| **Open QLingo when idle**      | off at first; minutes of no typing in the window in front before it opens   |
| **Open QLingo at these times** | never at first; times of day it opens once                                  |
| **Test**                       | translates the hardest word of a famous quote, to see the agent answer      |

The voices it speaks with are your system's — see [better voices for QLingo](/agents/qlingo-voices).

## What is sent

The word, the sentence it was in (at most 300 characters) and the languages ticked go to the agent
you picked, run on this machine; Mark New Words sends the chapter (at most 20,000 characters, once
per chapter until the file changes) and the words you already have. Nothing goes to
objectexplorer.com, and a word translated once is answered from this machine afterwards.

Next: [better voices for QLingo](/agents/qlingo-voices).
