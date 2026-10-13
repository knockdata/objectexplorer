# Fonts

`ttf` `otf` `ttc` `otc` `woff` `woff2` `pfb` `pfa` `cff`

<img src="/screenshot/format-font.png" alt="A WOFF2 font opened as its glyphs: a row each with its number, the character it draws, its advance, contours and points">

A font file opens as its glyphs, a row each: the glyph's number, its name, the Unicode character it
draws, how far it advances the pen, and how many contours and points its outline has. The app reads
the outlines itself, so no font has to be installed to look inside one.

| Format                        | Extensions     |
|-------------------------------|----------------|
| **TrueType** and **OpenType** | `ttf` `otf`    |
| **Collections**               | `ttc` `otc`    |
| **WOFF** and **WOFF2**        | `woff` `woff2` |
| **PostScript Type 1**         | `pfb` `pfa`    |
| **Bare CFF**                  | `cff`          |

Which of these a file is, its first bytes decide, not its name. **Structure** mode lays out how it is
put together: the table directory of a TrueType or OpenType font, the compressed tables of a WOFF,
the table directory and Brotli stream of a WOFF2, the indexes of a CFF, the segments of a Type 1
font. A WOFF2 that holds a collection shows its structure, but not its glyphs.

Next: [ebooks](/formats/ebooks).
