# Fonts

`ttf` `otf` `ttc` `otc` `woff` `pfb` `pfa` `cff`

A font file opens as its glyphs, a row each: the glyph's number, its name, the Unicode character it
draws, how far it advances the pen, and how many contours and points its outline has. The app reads
the outlines itself, so no font has to be installed to look inside one.

| Format                        | Extensions  |
|-------------------------------|-------------|
| **TrueType** and **OpenType** | `ttf` `otf` |
| **Collections**               | `ttc` `otc` |
| **WOFF**                      | `woff`      |
| **PostScript Type 1**         | `pfb` `pfa` |
| **Bare CFF**                  | `cff`       |

Which of these a file is, its first bytes decide, not its name. **Structure** mode lays out how it is
put together: the table directory of a TrueType or OpenType font, the compressed tables of a WOFF,
the indexes of a CFF, the segments of a Type 1 font.

Next: [ebooks](/formats/ebooks).
