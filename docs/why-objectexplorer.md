# Why ObjectExplorer?

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
