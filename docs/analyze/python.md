# Python

<img src="/shot/notebook-python.png" alt="A Python cell: oe.frame over the object, and the DataFrame it returned as a grid">

A **Python** cell runs real Python — in a real interpreter, in a virtual environment you made, with
pandas or polars or whatever else you installed. It sits in the same notebook as the SQL and the
chart, and what it returns flows into the cells below it.

```python
frame = oe.frame("SELECT * FROM 's3://sales-eu/orders/2026-08-24.parquet'")
frame.groupby("region")["amount"].sum().sort_values(ascending=False)
```

The last value is the answer — there is no `print` to write, and no `return`. A DataFrame comes back
as a grid, a matplotlib figure as a picture, anything else as its `repr`. Whatever you print along
the way is shown above it.

## `oe` — the objects, from Python

Every cell starts with `oe` already imported. It is how Python reaches the same storage the window
reaches: your sign-ins, your caches, your rules. **Nothing in a Python cell talks to a provider
directly**, so a bucket you can browse is a bucket you can read, and one you cannot is one you
cannot.

| | |
|---|---|
| `oe.path(uri)` | one absolute local path, downloading into the cache if needed |
| `oe.paths(uri)` | a list of them with globs expanded — `s3://b/y=*/*.parquet` → forty paths |
| `oe.glob(uri)` | the matching URIs, without downloading anything |
| `oe.stat(uri)` | `{"size": …, "mtime": …}`, or `None` |
| `oe.query(sql)` | rows from DuckDB, as a list of dicts |
| `oe.frame(sql)` | the same as a DataFrame — needs pandas |
| `oe.open(uri, mode)` | an open file over the local copy |
| `oe.current` | the object this notebook is on |
| `oe.uri()` | that object's URI — the same text a [SQL](/analyze/sql) cell writes for it |

A URI means the same thing here as it does in a SQL cell, so a query you wrote in one can be pasted
into the other:

```python
import pandas as pd

# every partition of a Hive export, as local paths
paths = oe.paths("gs://sales-eu/orders/year=*/month=*/*.parquet")
pd.concat(pd.read_parquet(path) for path in paths)
```

`oe` itself needs nothing installed — it is standard library only, so it imports in an environment
you made a second ago and have not put anything in yet.

## Kernels

A **kernel** is a running Python process, and it keeps everything you put in it. Assign a variable
in one cell and the next cell has it; import pandas once and it stays imported.

The kernel is called `global` and it is **shared across notebooks**. Two objects open side by side
are two views onto one namespace, which is usually what you want — load a frame while reading one
file, reshape it while reading another. When it is not, name a new kernel in the picker under the
cell's toolbar and that cell gets a namespace of its own; another notebook joins it by picking the
same name.

A kernel belongs to one environment. Point a cell at a different venv and the kernel restarts, the
namespace goes with it, and the cell says so — *started global on analysis* — rather than letting
you find out from a `NameError` in a line that worked a minute ago.

The **variables** icon beside the picker lists what is in the kernel right now: every name, its
type, and a word about what it holds — a DataFrame says its shape. It asks the kernel rather than
remembering, because another notebook may have changed it since.

## Environments

**Settings → Python.** Everything here is made by [uv](https://docs.astral.sh/uv/), and every
environment lives in one place:

```
~/.objectexplorer/venvs/
```

The pane finds the Python interpreters on your machine — the ones uv manages and the ones on your
PATH — and lists each with its version and its path. If it finds none it says so, and points at
[python.org/downloads](https://www.python.org/downloads/) or `uv python install 3.12`. If **uv**
itself is missing it says that first, because nothing below it can work.

Name an environment, pick a version, and it is made. The first Python cell you run makes one called
`default` if you have not made any yet, so a fresh machine is not a four-step setup before `1 + 1`.

### Installing packages

Open an environment and you get what is in it, a command box, and a row of one-click badges for the
packages a data notebook reaches for first — pandas, polars, numpy, matplotlib, pyarrow, duckdb,
scikit-learn.

```
uv pip install "polars[all]" pyarrow
```

The box takes anything `uv pip install` takes — extras, pins, git URLs, `-r requirements.txt` — and
nothing else: a command that does not start with `uv pip install` is refused, and the environment to
install into is filled in for you, so it cannot go to the wrong one by accident.

## What it is not

There is no Jupyter server, no notebook file on disk and no `.ipynb` to keep in sync. The cells are
kept per object like every other cell in [the notebook](/analyze/notebook), and the process runs on
your machine beside the app.

Python runs only in the desktop app and the local server — the browser front door has no interpreter
to run it in, and the Python cell is not offered there.

Next: [charts](/analyze/charts).
