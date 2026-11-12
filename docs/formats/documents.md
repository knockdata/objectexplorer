# Documents and presentations

Word processors, spreadsheets, presentations and mail, old and new — each opens as itself, and no
office suite has to be installed.

<img src="/screenshot/presentation.png" alt="A pptx: every slide as a thumbnail down the side, the one picked drawn large beside them">

| Kind                      | Files                                                                                                                         |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Documents**             | `docx` `dotx` `docm` `doc` `odt` `ott` `fodt` `rtf` `pages`, `hwp` `hwpx` (Hangul), `ofd`, AbiWord `abw` `zabw`               |
| **Older word processors** | WordPerfect `wpd`, Works and WPS `wps`, Write `wri`, MacWrite `mcw`, ClarisWorks `cwk`, T602 `602`                            |
| **OpenOffice.org 1.x**    | `sxw` `stw` documents, `sxc` `stc` sheets, `sxi` `sti` presentations, `sxd` `std` drawings                                    |
| **Printed**               | XPS `xps` and OpenXPS `oxps` — see [pages](#xps)                                                                              |
| **Spreadsheets**          | `xlsx` `xlsm` `xltx` `xls` `xlt` `ods` `fods` `numbers` `et`                                                                  |
| **Presentations**         | `pptx` `potx` `ppsx` `ppt` `pot` `pps` `odp` `fodp` `key` `dps`                                                               |
| **Text only**             | Publisher `pub` and OneNote `one` — their words, as a document                                                                |
| **Mail**                  | `eml` `msg` `emlx` `mhtml` `mbox`, `winmail.dat` — see [email](#email); Outlook `pst` `ost` `olm` — see [mail](/formats/mail) |

A PDF opens in [the PDF reader](/formats/pdf), with selectable text, find and notes.

## Documents

A Word file renders as its text with its structure, one column of prose: headings, lists, tables,
links, pictures, and the bold, italic, underline, colour and size of the words. The old binary
`.doc`, an OpenDocument `.odt`, a Pages document — Pages '09 too — and the older word processors'
files open the same way, and so do an AbiWord file (`.abw`, gzipped as `.zabw`) and an
OpenOffice.org 1.x `.sxw`, OpenDocument's forerunner. An OFD, China's fixed-layout format, is
painted page by page.

## Spreadsheets

A workbook opens a sheet at a time, with a tab for each sheet under it: Excel's `.xlsx` and its
97–2003 `.xls`, a Numbers file's tables, and Kingsoft's `.et`. A large sheet is read a page of rows
at a time rather than all at once, and a sheet as wide as Excel allows opens at once. An Excel
sheet can be queried with [SQL](/analyze/sql). An OpenDocument `.ods` opens as the table of its
first sheet.

## Presentations

A presentation is painted slide by slide — the old binary `.ppt`, Kingsoft's `.dps` and Keynote's
`.key`, Keynote '09 too, included — with a strip of thumbnails beside the slide on show; the arrow
keys, `PageUp` and `PageDown` move between them. An OpenDocument `.odp` opens as its slides' text,
one after the other.

The OpenOffice.org 1.x files — `.sxc` sheets, `.sxi` presentations, `.sxd` drawings — open the way
their OpenDocument successors do.

A deck written in Markdown is a [slide deck](/formats/slides) of its own.

## Email

An e-mail (`.eml`, Outlook's `.msg`) or a web page saved whole (`.mhtml`) opens as a document: its
header, its body, and its attachments named, with the attachments' table next. A mailbox (`.mbox`)
opens as a table, a row a message, each message one click from opening as an e-mail. Outlook's
`winmail.dat` is browsed as the files it carries. An Apple Mail message (`.emlx`) opens as an e-mail
too. An Outlook data file (`.pst`, `.ost`) or an Outlook for Mac archive (`.olm`) opens as its
messages — see [mail, chats and personal files](/formats/mail).

## XPS

An XPS or OpenXPS document (`.xps`, `.oxps`), what Windows prints to when it prints to a file, opens
as its pages, a strip of them beside the one on show. Its zip of pages can be browsed too.

## Search and inside the file

The words of every document, sheet and slide are read for [search](/explore/search), and a result
points at the page, sheet or slide it was found on.

Because most office formats are zips or compound files, the same objects can also be
[browsed as folders](/explore/archives): open the `.pptx` as an archive and the slide XML, the media
and the theme are entries you can open one at a time.

## Evernote

An Evernote export (`.enex`) opens as a book of its notes, one note a page, with their pictures in
place. A single note saved as `.html` opens the same way.

Next: [mail, chats and personal files](/formats/mail).
