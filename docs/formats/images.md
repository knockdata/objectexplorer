# Images

`png` `jpg` `jpeg` `webp` `gif` `tiff` `tif` `svg` `ico` `cur` `bmp` `heic` `avif` `jxl` `psd` `tga`
`jp2` `dcm`, camera raw, and many older kinds

<AppDemo open="folder/demo/image/archipelago-dusk.jpg" image="/screenshot/image-exif.png" alt="A photo fitted to the pane, with a card over its top right corner: its description, camera settings and GPS position" />

The picture, fitted to the pane, with what the file carries in a card over its top right corner:
the EXIF tags of the image and of the camera and its settings, and the GPS position worked out in
degrees where there is one. A PNG shows the text chunks it holds, and a GIF its comments.

A PNG is shown at its own size, no wider than the pane, and a button flips the background behind it
between light and dark, so a transparent picture can be seen on either.

An `.ico` or `.cur` shows every size it contains side by side, each named by its size and depth,
rather than only the largest.

An SVG is painted by the app's own painter, not handed to a browser, and its text is a click away.

On a Mac the system draws the common web formats — PNG, JPEG, GIF, WebP, BMP, AVIF and JPEG XL. On
Windows and Linux the app's own decoders draw them. Everything else on this page is read by the
app itself, the same on every platform.

## Animated GIFs

An animated GIF opens in a player: play and pause, step a frame back or on, and play at `0.5×` to
`2×`. Under the picture runs a strip of its frames; drag along it to scrub, and hover it to see that
frame larger. `Space` plays and pauses, `←` and `→` step.

The pencil turns the player into an editor:

- **Draw** over it — a rectangle, an ellipse, an arrow, a line, a pencil stroke or text, in one of
  seven colours and three widths — or **mask** what should not be seen. Each drawing appears at the
  frame you drew it on, draws itself in, stays for as long as you set, and has a bar of its own on
  the strip to drag.
- **Trim** with the two handles on the strip, **crop** to the part to keep, **flip** left to right,
  and pick a speed.
- `⌘Z` undoes.

**Save** writes `<name>-edited.gif` beside the original, in a local folder; the original is never
changed. An MNG animation plays too, but only a GIF is saved.

## Photos and modern formats

**HEIC**, **AVIF** and **JPEG XL** open as pictures on every platform, with their EXIF in the card.
A Live Photo export (`.livp`) opens as its still picture; its movie is inside it, and opens as a
video.

**TIFF** is read in full: strips or tiles, BigTIFF, fax, LZW, Deflate, PackBits, JPEG (old-style
too), LZMA, Zstandard and WebP compression, grey, palette, RGB, CMYK and Lab colour, and any depth
from 1 bit to 64-bit floats. A file of several pages shows its first, and says how many there are.

**Camera raw** — `cr2` `nef` `arw` `dng` `orf` `rw2` `pef` `srw` `3fr` `iiq` and the other raws
built on TIFF — shows the largest preview the camera stored. The sensor data is not developed.

## Older and specialist formats

| Kind                  | Files                                                                         |
|-----------------------|-------------------------------------------------------------------------------|
| Photoshop and GIMP    | `psd` `psb` (the merged picture; the layers listed), `xcf`                    |
| JPEG 2000 and JPEG XR | `jp2` `j2k` `jpf`, `jxr` `wdp` `hdp`                                          |
| medical               | DICOM `dcm`, its first frame                                                  |
| simple bitmaps        | `qoi`, `pbm` `pgm` `ppm` `pnm` `pam` `pfm`, `tga`, `dib`                      |
| older                 | `pcx` `dcx`, `sgi` `rgb`, Sun raster `ras`, `xbm` `xpm`, `msp`, `blp`, `icns` |
| animations            | `fli` `flc` (the first frame), `mng`                                          |
| CorelDRAW `cdr`       | the preview the file carries                                                  |

## Metafiles and PostScript

`emf` `wmf` `pict` `cgm` `swf` `eps` `ps` `ai`

These are drawings, not pixels, and they are drawn as drawings: a Windows metafile (`emf` `wmf`), a
Mac `pict`, a `cgm` and the first frame of a Flash `swf` are painted by the same painter as an SVG,
sharp at any zoom.

A PostScript file is run by the app's own PostScript interpreter, its pages drawn; a table lists
the fonts it stood in for and anything it did not follow. An EPS, or an Illustrator file from
before CS, shows the preview it carries, and is run when it has none. An Illustrator file from CS
on is a PDF, and opens in [the PDF reader](/formats/pdf).

Next: [audio and video](/formats/media).
