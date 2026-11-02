# Fonts

`ttf` `otf` `ttc` `otc` `woff` `woff2` `eot` `pfb` `pfa` `cff` `dfont`, TeX's `tfm`, fonttools'
`ttx`, UFO `glif`, and `designspace`

<img src="/screenshot/format-font.png" alt="A font in the font view: its name and glyph count, a size slider, a sample sentence typed in the font, and its glyphs in a grid below">

A font file opens as a font app shows one: its name and how many glyphs it has, a line of text
drawn in it, and its glyphs in a grid below, each with its name or its character under it. The app
reads the outlines itself, so no font has to be installed to look inside one.

Every font format below, but TeX's metrics, opens in this one view. The line of text is yours to
type — "The quick brown fox jumps over the lazy dog" at first — and the slider beside the name sets
its size, from 8 to 160 pixels. The text and the size stay as they are when you open the next font,
so two fonts are compared by opening one after the other. Hover a glyph for its name, its character
and its number. A font of more than 512 glyphs shows its first 512, and says so: `the first 512 of
933 glyphs`.

Its **table** holds a row per glyph: its number, its name, the Unicode character it draws, how far
it advances the pen, and how many contours and points its outline has.

| Format                        | Extensions          |
|-------------------------------|---------------------|
| **TrueType** and **OpenType** | `ttf` `otf`         |
| **Collections**               | `ttc` `otc`         |
| **WOFF** and **WOFF2**        | `woff` `woff2`      |
| **Embedded OpenType**         | `eot`               |
| **PostScript Type 1**         | `pfb` `pfa`         |
| **Bare CFF**                  | `cff`               |
| **Mac resource fonts**        | `dfont`, `LWFN`     |
| **TeX font metrics**          | `tfm`               |

Which of these a file is, its first bytes decide, not its name. A collection draws its first font.
A TeX font metrics file holds no outlines: it opens as the table of each character's width,
height, depth and italic correction.
**Structure** mode lays out how it is put together: the table directory of a TrueType or OpenType
font, the compressed tables of a WOFF, the table directory and Brotli stream of a WOFF2, the indexes
of a CFF, the segments of a Type 1 font. A WOFF2 that holds a collection shows its structure, but
not its glyphs, and an EOT compressed with MicroType Express is not read.

## Font sources

A fonttools `.ttx` dump that holds outlines is drawn like the font it came from; one that holds
only a table — a lone `GSUB` — opens as its XML. A UFO `.glif` is drawn as one glyph, the way a font
editor shows it, with the components it borrows from the glyphs beside it, and its points as a
table. A `.designspace` opens as its axes, masters and instances.

Next: [ebooks](/formats/ebooks).
