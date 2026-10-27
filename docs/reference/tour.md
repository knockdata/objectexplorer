# The tour and what is new

## The tour

<img src="/screenshot/tour.png" alt="The tour's first card, Open, look, export, over the demo's train stations opened as a table">

The first time the window opens, a short tour shows you around. Each card lights up one part of the
window and darkens the rest. The first three are a small task on the demo folder's train stations:

1. **Open, look, export**: the stations, a Parquet file, open as rows; nothing is imported or
   uploaded;
2. **Look: click a bar**: the bars under a column's name filter the rows by that value;
3. **Export: hold Download**: the whole file written as an Excel workbook, or in another format.

The rest are the window's parts:

4. the activity bar, which decides what the side bar shows;
5. the tree, every folder you added, on this machine or in the cloud;
6. **Add a folder**, the **+** that adds a folder on this machine, or the buckets of a cloud set up in
   Settings;
7. the tabs, and splitting to read two side by side;
8. search, by name with `⌘P` or inside every file;
9. settings: folders, cloud accounts, the cache, the plan and updates;
10. the **?**, which shows the tour again.

**Next** (`→` or `Enter`) and **Back** (`←`) walk the cards, and the last one says **Done**;
**Skip**, the ✕ or `Esc` ends it. Once it has been shown it never starts by itself again. The **?**
at the bottom of the activity bar, **Show me around**, starts it any time.

On macOS and Windows, the very first start opens Settings on [OS Extension](/reference/os-integration)
before the tour, once, while nothing of it is turned on; the tour waits until Settings is closed.

To start without the tour or any card about something new, give `tour=off` on the command line, or
add `?tour=off` to the address of the page in a browser. The **?** still works.

## What is new

Each release names what it brings. On a later start, the window points at the newest of them that
you have neither used nor been shown, with one card: what it is, and **Got It**. At most one card
comes up by itself a day, and none on the day the tour ran. Something you have already done is
never pointed at.

What you have seen and used is kept on this machine, in `~/.objectexplorer/onboarding.json`. On a
server, what a signed-in person has used is kept by their email, so a card they dismissed in one
browser does not come back in another.

Next: [memory](/reference/memory).
