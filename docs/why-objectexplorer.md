# Why ObjectExplorer?

## Where the day goes

Six things, on repeat, in every team that keeps its data in a bucket:

- **Download it to see it.** A 5 GB Parquet file, a zip you only wanted the file list of, one column
  you meant to check — each becomes a copy on a laptop, and the copy outlives the question.
- **A console per provider.** S3 in one tab, Cloud Storage in another, Blob in a third, each with its
  own idea of what a folder is and its own way of showing you nothing about the file.
- **Handing data to a viewer.** The quick way to read an unusual format is often to upload it
  somewhere, which is exactly what data you are not allowed to copy forbids.
- **Partitions you navigate by hand.** `year=2026/month=01/day=15` is a table, but a console reads it
  as three thousand folders.
- **pandas for a minimum and a maximum.** Loading a whole file into a notebook to answer a question
  the file's own footer already knows.
- **Click, wait, reload.** Every step through a console is a page load, and a page load is where
  attention goes.

## The loop it removes

A cloud console can list your objects and little else. To find out what is actually inside a Parquet
file you download it, open a notebook, read it, and delete the copy — for one look at one file. Do
that across three providers and you are also juggling three consoles, three sets of credentials, and
a `Downloads` folder full of data that should never have left the bucket.

ObjectExplorer collapses that loop:

- **One window for every provider.** S3, GCS, Azure Blob and your local disks in the same tree, with
  the same keyboard shortcuts.
- **Preview instead of download.** Formats render in place — including the ones no console will ever
  open, like Parquet, SPSS and SAS.
- **Search across buckets.** One query over local folders and cloud prefixes at the same time.
- **Query, chart and model in place.** A table opens as a notebook: SQL over the object, a chart of
  what came back, and a gradient boosting model over the rows — all on your machine.
- **Delta, Iceberg and Hudi are just tables.** Point DuckDB at the folder and it answers, deletes
  and schema changes included.
- **Move things where they belong.** Copy, move, rename and delete across buckets and disks, with
  one Undo — the explorer half of a file explorer, not only the reading half.

## The part that decides it

Most tools that can read a Parquet file in a bucket read it somewhere else. ObjectExplorer reads it
here. Objects are fetched from your provider to your computer and nowhere else, every parser runs in
a worker on your own machine, and credentials never leave it.

That is what makes it usable on data you are not allowed to copy — and it means there is no
data-processing agreement to negotiate before anyone can look at a bucket. The whole argument, and
what exactly does leave the machine, is on [your data stays here](/privacy).

Next: [getting started](/getting-started).
