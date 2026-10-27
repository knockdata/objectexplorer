# Fonts

`ttf` `otf` `ttc` `otc` `woff` `woff2` `eot` `pfb` `pfa` `cff` `dfont`, fonttools' `ttx`, UFO
`glif`, and `designspace`

<img src="/screenshot/format-font.png" alt="A TrueType font in its table: a row per glyph with its number, name, the character it draws, its advance, contours and points">

A font file opens as its glyphs, drawn: a sheet of them, each with its name or its character under
it, the first 512 when there are more. The app reads the outlines itself, so no font has to be
installed to look inside one.

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

Which of these a file is, its first bytes decide, not its name. A collection draws its first font.
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
