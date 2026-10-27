# Text, code and notebooks

`txt` `md` `markdown` `html` `xml` `yaml` `json` `toml` `py` `js`, every other source file by its
language, the other text markups (`rst` `org` `adoc` `wiki` `textile` `tex` `typ` `dbk` `opml`, man
pages), and `ipynb`

Text opens as text, syntax highlighted by its language, and code folds where its blocks do. Comments
and strings that run over several lines — Python's `"""` and `'''` among them — are coloured as what
they are on every line. A file of any size opens at once: only the lines in view are decoded, so a
multi-gigabyte log scrolls from its first line to its last — the same way [hex](/explore/hex)
reads it.

A JSON or YAML file opens laid out, coloured and folding; JSON with comments, JSON5 and a broken
JSON are covered on [tabular](/formats/tabular#json). A certificate or a key opens as its fields —
see [certificates and keys](/formats/certificates).

## Markdown

A Markdown file opens rendered: headings, lists, tables, code blocks, and the Mermaid and Excalidraw
blocks drawn. Its front matter shows as foldable, coloured YAML. The **text** mode beside it shows
the source. A Markdown file that is a deck opens as its [slides](/formats/slides).

In a local folder, that source is also editable: type, and `⌘S` saves it back. That is where the
[writing assistant](/analyze/writing) lives.

## Other text markups

reStructuredText, Org, AsciiDoc, MediaWiki, Textile, LaTeX, Typst, DocBook, OPML outlines and man
pages open as the page they describe — headings, lists, tables, links and code — with their source
a click away.

## Web pages

An `.html` file opens as a document — its text, pictures and links, read like a page of a book — and
then as a browser draws it, with its styles, its scripts left off. The second needs the system's web
view, which Linux does not have yet.

## Jupyter notebooks

An `ipynb` opens as its cells, each with the output it was saved with — tables, pictures and text —
so a notebook someone left in a bucket reads without starting a kernel. A large notebook opens at
once: an output is read only as its cell scrolls into view. Its JSON, laid out and folding, and its
text are a click away.

## Logs

A `.log` file opens in the [log viewer](/analyze/logging) rather than as text: plain lines, JSON
lines, Cloud Logging entries or an OpenTelemetry export, with **text** a click away.

Next: [slide decks](/formats/slides).
