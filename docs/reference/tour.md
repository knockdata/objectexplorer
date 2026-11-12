# The tour and what is new

## The tour

<img src="/screenshot/tour.png" alt="The tour's first card, Open, look, export, over the demo's train stations opened as a table">

The first time the desktop window opens, a short tour shows you around: four cards, each lighting
up one part of the window and darkening the rest.

1. **The activity bar**: each icon down the left shows its view beside it — Explorer, the tree of
   your folders, and Search at the top; account, settings, the tour's **?** and the theme at the
   bottom;
2. **Add a location**: the **+** that adds a location to the tree — **Local Folder…** picks a folder
   on this machine, a cloud set up in Settings adds its buckets; nothing is copied or uploaded;
3. **Click an item in the tree**: a folder opens, a file shows in the pane;
4. **The file in the pane**: after **Next**, the demo's train stations, a Parquet file, open as
   rows; nothing is imported or uploaded.

**Next** (`→` or `Enter`) and **Back** (`←`) walk the cards, and the last one says **Done**;
**Skip**, the ✕ or `Esc` ends it. Once it has been shown it never starts by itself again. The **?**
at the bottom of the activity bar, **Show me around**, starts it any time.

In a browser page the tour never starts by itself, since a page opens nothing its address does not
name: the first visit shows one card, **Show me around**, pointing at the **?**, and the tour, with
its train stations, starts when you click it.

On macOS and Windows, the very first start opens Settings on [OS Extension](/reference/os-integration)
before the tour, once, while nothing of it is turned on; the tour waits until Settings is closed.

To start without the tour or any card about something new, give `tour=off` on the command line, or
add `?tour=off` to the address of the page in a browser. The **?** still works.

## What is new

Each release names what it brings. On a later start, the window points at the newest of them that
you have neither used nor been shown, with one card: what it is, and **Got It**. At most one card
comes up by itself a day, and none on the day the tour ran. Something you have already done is
never pointed at.

What you have seen and used is kept on this machine, in `~/.objectexplorer/settings/onboarding.json`. On a
server, what a signed-in person has used is kept by their email, so a card they dismissed in one
browser does not come back in another.

Next: [where the usage numbers come from](/reference/usage-data).
