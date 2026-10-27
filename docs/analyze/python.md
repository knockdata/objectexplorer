# Python

<img src="/screenshot/notebook-python.png" alt="A Python cell: pandas reading oe.path of an object in a bucket, its session and venv under it, and the DataFrame it returned as a grid">

A **Python** cell runs real Python — in a real interpreter, in a virtual environment you made, with
pandas or polars or whatever else you installed. It sits in the same notebook as the SQL and the
chart, and what it returns flows into the cells below it.

```python
import pandas as pd

frame = pd.read_parquet(oe.path("s3://sales-eu/orders/2026-08-24.parquet"))
frame.groupby("region")["amount"].sum().sort_values(ascending=False)
```

The last value is the answer — there is no `print` to write, and no `return`. A pandas, polars or
Spark DataFrame comes back as a grid, and a chart cell under it plots those rows; a matplotlib figure
comes back as a picture, anything else as its `repr`. Whatever you print along the way is kept behind
the info icon in the cell's toolbar.

A Python cell does not read the rows of the cell above it: the session is a separate process, and it
reaches the data through `oe`. When the notebook's file is on this machine, its folder is the cell's
working directory.

## `oe` — the objects, from Python

Every cell starts with `oe` already imported. It is how Python reaches the same storage the window
reaches: your sign-ins, your cache. **Nothing in a Python cell talks to a provider directly**, so a
bucket you can browse is a bucket you can read, and one you cannot is one you cannot.

|                      |                                                                                       |
|----------------------|---------------------------------------------------------------------------------------|
| `oe.path(uri)`       | one absolute local path, copied into the cache if needed                              |
| `oe.paths(uri)`      | a list of them with globs expanded — `s3://b/y=*/*.parquet` → forty paths             |
| `oe.glob(uri)`       | the matching URIs, without downloading anything                                       |
| `oe.stat(uri)`       | `{"size": …, "mtime": …}`, or `None`                                                  |
| `oe.query(sql)`      | rows from the app's own [SQL](/analyze/sql) engine, as a list of dicts                |
| `oe.frame(sql)`      | the same as a DataFrame — needs pandas                                                |
| `oe.open(uri, mode)` | an open file over the local copy                                                      |
| `oe.current`         | the object this notebook is on, as `{"path": …, "uri": …}`                            |
| `oe.uri()`           | that object's URI                                                                     |

`oe.query` reads files on this machine by their path, with the same readers the explorer uses — a
parquet, a csv, a `.sav`, a table of a DuckDB file. For an object in a bucket, `oe.path` first:

```python
import pandas as pd

# every partition of a Hive export, as local paths
paths = oe.paths("gs://sales-eu/orders/year=*/month=*/*.parquet")
pd.concat(pd.read_parquet(path) for path in paths)
```

`oe` itself needs nothing installed — it is standard library only, so it imports in an environment
you made a second ago and have not put anything in yet.

## `%sql`

The `%sql` lines a data notebook uses are answered by the app itself, with nothing to install:

```python
%sql sqlite:///media_survey.db
%sql SELECT genre, count(*) FROM tracks GROUP BY genre
```

`%sql <url>` connects to an SQLite or DuckDB file, `%sql <statement>` runs one statement on it, a cell
that starts with `%%sql` is one statement, and `%config SqlMagic.displaylimit = 20` says how many rows
an answer shows. `%load_ext sql` is accepted and does nothing. The file is read, never written: only
`SELECT` runs.

## Sessions

A **session** is a running Python process, and it keeps everything you put in it. Assign a variable
in one cell and the next cell has it; import pandas once and it stays imported.

The session is called `global` and it is **shared across notebooks**. Two objects open side by side
are two views onto one namespace, which is usually what you want — load a frame while reading one
file, reshape it while reading another. When it is not, pick **New Session…** from the box in the
cell's toolbar and name one; that notebook gets a namespace of its own, and another notebook joins it
by picking the same name.

A session belongs to one environment, and naming a new session is when you pick which — or make one
there with **New venv…**. Cells never carry an environment of their own: a cell runs in whichever one
its session was started on.

The info icon beside the session opens everything else about the cell in one place: what is in the
session's namespace right now — every name, its type, and a word about what it holds, a DataFrame
saying its shape — and anything the cell printed. The namespace is asked for rather than remembered,
because another notebook may have changed it since.

A cell whose last line is not a value — an assignment, an import, a bare `print` — draws nothing at
all, and stays that way. What the session did is behind the icon for whenever you want it.

## Virtual environments

**Settings → Python.** Everything here is made by [uv](https://docs.astral.sh/uv/), and every
environment lives in one place:

```
~/.objectexplorer/venvs/
```

Name an environment, pick a version, and it is made. The versions in that box are the Pythons found
on your machine — the ones uv manages and the ones on your PATH — offered where they are actually
useful rather than as a list to read. If none is found the pane says so, and points at
[python.org/downloads](https://www.python.org/downloads/) or `uv python install 3.12`. If **uv**
itself is missing it says that first, because nothing below it can work, and **Install uv** puts it
on the machine.

The first Python cell you run makes an environment called `default` if you have not made any yet, so
a fresh machine is not a four-step setup before `1 + 1`.

### Installing packages

Open an environment and you get what is in it, a command box, and a row of one-click badges for the
packages a data notebook reaches for first — pandas, polars, numpy, matplotlib, pyarrow, duckdb,
pyspark, scikit-learn.

```
uv pip install "polars[all]" pyarrow
```

The box takes anything `uv pip install` takes — extras, pins, git URLs, `-r requirements.txt` — and
nothing else: a command that does not start with `uv pip install` is refused, and the environment to
install into is filled in for you, so it cannot go to the wrong one by accident.

## Spark

Install **pyspark** and a Spark session in a Python cell runs on this machine, sized by the
environment's own setting:

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.getOrCreate()
spark.read.parquet(oe.path("s3://sales-eu/orders/2026-08-24.parquet"))
```

Spark reads local files, so an object in a bucket goes through `oe.path` first, which copies it into
the cache once and hands Spark the local path.

Note the plain `getOrCreate()` with no `.master(...)` in front of it. How big the session is comes
from the environment's own setting, and a builder that names its own master overrides that.

### How big the session is

Install **pyspark** into an environment and Settings → Python grows two sliders for it: how many
cores a session may use, and how much memory its driver may take.

Each slider runs the length of the machine — all 10 cores, all 24 GB — and the thumb stops short of
the end where the machine keeps something back. Memory stops at three quarters, so a 24 GB machine
lets a session have 18 GB and holds the rest for the operating system, this app and your browser;
the end of the track past that is shaded. Cores have no such reserve, so that slider goes the whole
way. The number beside each one reads *18 of 24 GB* — what you gave Spark, out of what you have.

Two facts, kept apart on purpose: a machine with 24 GB really does have 24 GB, and 18 is the share
Spark is allowed. Flattening them into one number makes a ceiling look like a mis-measured machine.

That ceiling is the point: a JVM told it may have more memory than the machine has does not fail on
the number, it starts, allocates, and takes the machine down with it. Unset, a new environment gets
all but one core and a quarter of the memory.

This is a local Spark — one process on your machine, where the driver *is* the executor. That is why
memory is a driver setting, and why it can only be set here: a JVM's heap is fixed when it starts,
which is before any `.config()` in your builder is read.

A session that is already running keeps the size it started with. Move a slider and the next session
you start picks up the new numbers.

### Checking what you got

```python
sc = spark.sparkContext
print(sc.master)                                    # local[2]
print(sc.defaultParallelism)                        # 2   — the cores in use
print(spark.conf.get("spark.driver.memory"))        # 6g
print(sc._jvm.java.lang.Runtime.getRuntime().maxMemory() / 1024**3)   # 6.0
```

That last line is the one to trust: it is the JVM's real heap, so it says the setting reached the
launch arguments rather than only the config map.

`spark.executor.memory` and `spark.cores.max` are **not** the keys to check, and both report
`not set` on a healthy local session. They belong to a cluster, where an executor is a separate
process from the driver. Local mode runs one JVM that is both — `spark.sparkContext._jsc.sc().env().executorId()`
answers `driver` — so the executor keys are never read, and setting `spark.executor.memory` to 16g
on a 2 GB session changes nothing at all.

### When the session ends

Stopping a session — changing its environment, deleting the environment, closing the app — stops the
Spark session with it. The JVM is asked to shut down first; one that has stopped answering is killed
about eight seconds later, because a driver holding several GB is not something to leave running
until the machine is next restarted.

Every JVM this app starts carries its environment's name on its command line, so one you find in `ps`
is identifiable — and it is what the app itself checks before killing one, so it can never take out a
process that merely inherited the same pid.

If a session's JVM dies on its own, the next cell starts a new one. pyspark would otherwise hand
back the dead session forever, leaving the session unusable with no way to ask for another.

**What it needs.** A JDK 17 or 21 — Spark does not yet run on 26. The app finds one wherever your
package manager put it, including Homebrew's `openjdk`, which is deliberately kept off your PATH; a
`JAVA_HOME` you set always wins:

```
brew install openjdk@21
```

**The file.** The two numbers are kept in the environment's `spark-defaults.conf`, and nowhere else.
The sliders and that file are the same thing, not a copy of each other. Move a slider and the file
changes; edit the file and the sliders say what you edited; delete it and the environment is back on
its defaults. A hand-written number over what the machine has is still held to the cap on the way
back in.

**Outside the app.** A terminal session is pointed at the same configuration with one line per
environment, named after it:

```
export SPARK_CONF_DIR=~/.objectexplorer/spark-conf/default
```

The cached files a session reads are on this machine, so a cluster whose executors cannot see your
home directory is not what this is for.

## What it is not

There is no Jupyter server, no notebook file on disk and no `.ipynb` to keep in sync. The cells are
kept per object like every other cell in [the notebook](/analyze/notebook), and the process runs on
the machine the app runs on.

Python runs in the desktop app and on a server. The instant page at objectexplorer.com/app has no
interpreter to run it in, and the Python cell is not offered there. Environments are made and
packages installed only on the server's own machine or from the command line, and other people signed
in to a server run Python only when its owner turned that on.

Next: [charts](/analyze/charts).
