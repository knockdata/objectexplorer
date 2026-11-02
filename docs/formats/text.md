# Text, code and notebooks

`txt` `md` `markdown` `html` `xml` `yaml` `json` `toml` `py` `js`, every other source file by its
language, the other text markups (`rst` `org` `adoc` `wiki` `textile` `tex` `typ` `dbk` `opml`, man
pages), JATS and TEI articles, R Markdown and Quarto (`rmd` `qmd`), and `ipynb`

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

On this machine, that source is also editable: type, and `⌘S` saves it back — see
[editing text](/explore/edit). That is where the [writing assistant](/analyze/writing) lives.
**Book**, the open-book icon in the toolbar, reads the page as a book, two pages at a time — see
[ebooks](/formats/ebooks#book).

### Math

<img src="/screenshot/math.png" alt="A Markdown file with formulas drawn as math: an integral, a sum, a limit, a matrix and cases">

Math in a Markdown file is drawn as math, on the desktop and in the browser alike:

| Written as                         | Drawn                            |
|------------------------------------|----------------------------------|
| `$e^{i\pi} + 1 = 0$` or `\(…\)`    | in the line                      |
| `$$ … $$` or `\[ … \]`             | on a line of its own, centred    |
| a ` ```math ` block                | on a line of its own, centred    |

A dollar sign counts as math the way GitHub counts it, so "$5 and $10" stays text. Fractions, roots,
sub- and superscripts, limits, sums and integrals, growing brackets, matrices, cases, aligned lines,
`\mathbb` and `\mathcal` letters, accents and about 250 symbols are drawn. `\newcommand`, `\over` and
equation numbers are not drawn yet.

## Other text markups

reStructuredText, Org, AsciiDoc, MediaWiki, Textile, LaTeX, Typst, DocBook, OPML outlines and man
pages open as the page they describe — headings, lists, tables, links and code — with their source
a click away. A LaTeX file's formulas are drawn as math, as in Markdown. The other files a LaTeX
paper is made of — `sty` `cls` `dtx` `ins` `bbx` `cbx` `lbx` `bbl` `aux` — open as LaTeX source,
coloured.

An R Markdown or Quarto file (`.Rmd`, `.qmd`) opens as its Markdown page, each code chunk with its
language, label and options over its coloured code, and a Mermaid chunk drawn. Nothing is run.

## Articles

A journal article in JATS, the Journal Article Tag Suite (`.nxml`, `.jats`, or an `.xml` that is one:
the XML PubMed Central keeps its articles in), or in TEI, the Text Encoding Initiative's XML (`.tei`,
or an `.xml`: what GROBID makes of a PDF, and what digital editions are written in), opens as the
article: its title, authors and journal, the abstract and keywords, the numbered sections, figures
with their captions, tables, formulas drawn as math, and the numbered references. Its XML is a click
away.

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
