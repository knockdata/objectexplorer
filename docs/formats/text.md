# Text, code and notebooks

`txt` `md` `markdown` `html` `xml` `yaml` `py` `js` `pem` `crt` `cer`, every other source file by its
language, and `ipynb`

Text opens as text, syntax highlighted by its language, and code folds where its blocks do. A file of
any size opens at once: only the lines in view are decoded, so a multi-gigabyte log scrolls from its
first line to its last — the same way [hex](/explore/hex) reads it.

A certificate or a key — `.pem`, `.crt`, `.cer`, or a `.key` that is not a Keynote deck — is text
too, and opens as it.

## Markdown

A Markdown file opens rendered: headings, lists, tables, code blocks, and the Mermaid and Excalidraw
blocks drawn. The **text** mode beside it shows the source.

In a local folder, that source is also editable: type, and `⌘S` saves it back. That is where the
[writing assistant](/analyze/writing) lives.

## Web pages

An `.html` file opens as a document — its text, pictures and links, read like a page of a book — and
then as a browser draws it, with its styles, its scripts left off. The second needs the system's web
view, which Linux does not have yet.

## Jupyter notebooks

An `ipynb` opens as its cells, each with the output it was saved with — tables, pictures and text —
so a notebook someone left in a bucket reads without starting a kernel. Its JSON, laid out and
folding, and its text are a click away.

## Logs

A `.log` file opens in the [log viewer](/analyze/logging) rather than as text: plain lines, JSON
lines, Cloud Logging entries or an OpenTelemetry export, with **text** a click away.

Next: [drawings and diagrams](/formats/diagrams).
