# Slide decks

`.slides.md`, and Markdown with Slidev front matter

<img src="/screenshot/format-slides.png" alt="A slide deck: the slide titles down the side, the slide on show beside them with a table in its right column">

A deck is one Markdown file, and it opens as its slides: the slide titles down the side, the slide
on show beside them, and its notes under it. A file is a deck when its name ends in `.slides.md`, or
when its front matter has a deck setting such as `theme`, `layout`, `colorSchema` or `aspectRatio`
— the way a [Slidev](https://sli.dev) deck starts. Any other Markdown file opens as a page.

## Writing one

```md
---
theme: ocean
title: Third quarter
---

# Third quarter, ==in one page==

<!-- Open with the one number people will remember. -->

---
layout: two-cols
---

# Orders grew in every region

- Shipping time down to <Popup label="2.1 days">from 3.4 days last quarter</Popup>

::right::

| Region  | Orders |
|---------|--------|
| Nordics | 12,480 |
```

- A line of `---` starts the next slide; the lines between two of them are that slide's settings.
- **Layouts**: `cover`, `intro`, `section`, `center`, `two-cols`, `end`, `quote`, `fact` and
  `statement`. The first slide is a cover unless it says otherwise; in `two-cols`, `::right::`
  starts the right column.
- **Themes**: `dark`, `light`, `sunflower`, `ember`, `meadow`, `ocean` and `dusk` — or `yellow`,
  `orange`, `green`, `blue`, `purple`. The front matter sets the deck's, and a `section` slide with
  a `theme` of its own colours every slide up to the next section.
- `==words==` are marked in the theme's accent colour.
- `<!-- … -->` is a note: left off the slide and shown under it.
- `<Popup label="…">…</Popup>` puts a word in the text that opens a box over the slide when it is
  clicked. A click elsewhere or `Esc` closes it.
- Pictures (`![](chart.png)`, a path beside the deck), tables, code, and drawings: an
  ` ```excalidraw ` or ` ```mermaid ` block is drawn in place.
- ` ```timeline ` (`date | event`), ` ```stats ` (`number | caption`) and ` ```cards `
  (`title | sentence`) blocks lay out a row of dates, big numbers or cards.
- `source:` in a slide's settings puts its sources in the footer; `logo:` and `logoLink:` in the
  deck's put a logo on the first and the last slide.

The deck's **text** mode is the Markdown itself, and in a local folder you can edit it there and
save with `⌘S`.

## Moving through it

The arrow keys, `PageUp` `PageDown`, `Space` and `Enter` go back and forth; `Home` and `End` go to
the first and the last slide. A click on a title in the side list goes to that slide.

**Present** shows the slides alone, full screen, one at a time; `Esc` leaves. While presenting, the
pointer is a laser: press and drag anywhere on the slide and a trail follows it, then fades. A click
on a popup word or a link still opens it.

## A crowded slide

A slide whose text does not fit is drawn with its text smaller, step by step, until it fits. The
deck view, **Present** and every download draw it the same way, so what you see is what is sent.

## Downloading it

The **Download** button of a `.slides.md` deck writes its slides, drawn as the deck view draws them,
not its Markdown turned into a document:

| Format              | What it holds                                              |
|---------------------|------------------------------------------------------------|
| **PDF document**    | every slide as a vector page, first in the ring            |
| **PNG pictures**    | every slide as a picture, `01.png`, `02.png` …, in one zip |
| **Word document**   | every slide as a picture, its notes under it, a page each  |
| **Web page**        | every slide as a picture, its notes under it               |
| **Markdown slides** | the deck's Markdown as it is                               |

A PDF is ready for a LinkedIn document post; Word and the web page carry each slide with its notes,
popups and sources under it. A deck downloaded from a browser page is drawn
by the server the same way. See [download and convert](/explore/download).

A Markdown file that is a deck only by its front matter, not by a `.slides.md` name, downloads as a
document.

Next: [drawings and diagrams](/formats/diagrams).
