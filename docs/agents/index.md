# ObjectExplorer for agents

ObjectExplorer was built for a person looking at a bucket. It turns out the hard parts of that job —
holding the credentials, reading the formats, knowing what a column contains, and deciding what may
leave the machine — are exactly the parts an agent does not have.

So the window is one of two ways in now. The other is
[MCP](https://modelcontextprotocol.io): Claude Code, Codex or any MCP client on this machine can ask
the app the same questions the window asks, and gets answers decided by rules you wrote.

<img src="/shot/hero.png" alt="ObjectExplorer with a folder of parquet open">

**The agent never gets a credential and never talks to a provider.** It asks this app, and this app
answers — or refuses. Everything below follows from that one arrangement.

## Why an agent should read through it

### Only what you wrote down is reachable

No rule file means the door is shut. A file with no `roots` in it means nothing is reachable. What
an agent may see is one list of roots you ticked, minus one deny list that holds in every root — so
`.env`, `*.pem` and anything with `secret` in the path is refused wherever it lives, in a bucket
nobody remembered to think about.

There is no path where an agent reaches storage without passing that gate, because the gate sits
where the bytes are rather than inside each tool. A SQL statement naming a denied object is denied
at the same step a byte range would be.

→ [The rule file](/reference/mcp-rules), [connecting an agent](/agents/connect)

### Every access is recorded, watchable live, and replayable

One line per call — what was asked, which rule decided it, how many rows and bytes went back —
written and flushed **before the answer leaves the server**. A process that is killed still has
everything it answered.

While an agent works you can watch it: the window follows what it opens, in the window, as it
happens. Afterwards, a session opens as a tab — the client's own transcript beside our log of what
it actually reached — and **Replay** opens again, in order, everything the agent opened. **Recheck**
re-issues the recorded calls against today's rules and reports which decisions moved.

→ [Sessions, replay and audit](/agents/sessions)

### PII is sanitized on the way out, by configuration

A rule says which values it catches and what happens to them: **FPE** (a different value of the same
shape), **Hash**, **Mask** (a range of characters), or **Drop**. Two ways to name a value, because
there are two kinds of data:

- **Tabular** — matched on the column name, anywhere in it, so one `email` rule catches
  `emailAddress` and `billingEmail`. Every value in that column goes through it.
- **Full text** — matched on what a value *says*. A note with a customer's address and personal
  number in it comes back as the same note with those gone, and the rest of the sentence intact.

FPE is the default because it is the only action that leaves the data still usable: same length,
same alphabet, equal values still equal — so a query still joins, still groups, still counts.
Every rewritten column is named as `encrypted` in the result, so an agent never quotes a fake id
back to a person as a real one.

→ [PII rules](/agents/pii)

### It can read the formats an agent cannot

An agent with a shell and a cloud SDK can fetch bytes. What it does with a `sas7bdat`, a `.sav`, an
ORC file, a Hudi folder or a 3 GB Parquet file is the actual problem — and "pip install something
and write a script" is where the tokens and the mistakes go.

Every parser this app has is on the other side of that door: Parquet, Avro, ORC, Arrow, SPSS, SAS,
Delta, Iceberg, Hudi, archives, spreadsheets, documents. An agent asks in SQL and gets rows. The
range of data it can reach at all is the whole [format list](/formats/), not the subset it happens
to have a library for.

### Limits, for safety and for cost

Rows per call, bytes per call, bytes per session, bytes per day, calls per minute, objects per
listing, and a largest-object ceiling. Counted on the way **out** — what the agent received, not
what the app read, so a cache hit costs the same as a download.

Two problems, one dial. An agent that walks a bucket one refusal at a time is stopped by the same
number that stops an agent from pouring a 400 MB table into a context window you are paying for.

→ [Limits](/reference/mcp-rules#limits-how-much-may-be-taken)

### Column summaries, so it looks before it reads

`columnSummary` hands back per-column statistics — type, nulls, distinct, min, max, the common
values — measured **after** the PII rules, never before. It is the cheapest call in the set and it
is usually the one that answers the question.

An agent that can see a column's shape asks for the right thousand rows. One that cannot, asks for
all of them.

→ [Column summaries](/explore/column-summary)

## What it costs to try

Settings → MCP, one toggle, one tick per client. The starting rule file grants the folders already
in your window, turns `query` off, and leaves the door shut until you open it.

Next: [connecting an agent](/agents/connect).
