# Text, code and notebooks

`txt` `md` `markdown` `html` `xml` `xsl` `py` `js` `pem` `crt` `cer`, every other source file by its
language, and `ipynb`

Text opens as text, syntax highlighted by its language. A file too big to hold is read in windows, so
a multi-gigabyte log scrolls from its first line to its last without being downloaded whole — the
same way [hex](/explore/hex) reads it.

## Markdown

A Markdown file opens rendered: headings, lists, tables, code blocks. The **text** mode beside it
shows the source.

In a local folder, that source is also editable: type, and `⌘S` saves it back. That is where the
[writing assistant](/analyze/writing) lives.

## Jupyter notebooks

An `ipynb` opens as its cells, each with the output it was saved with — tables, pictures and text —
so a notebook someone left in a bucket reads without starting a kernel.

In a local folder, on a machine with Python, it opens live instead: the cells can be edited and run,
in the same [Python environment](/analyze/python) the app's own notebook uses, and every run and
every pause in typing is saved back into the file. `%sql` and `%%sql` cells are answered by the app.

## Logs

A JSON file of Cloud Logging entries or OpenTelemetry records is recognised by what it holds, and
opens in the [log viewer](/analyze/logging) rather than as text, with **text** a click away.

Next: [drawings and diagrams](/formats/diagrams).
