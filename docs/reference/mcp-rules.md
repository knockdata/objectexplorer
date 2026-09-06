# The MCP rule file

ObjectExplorer can expose what it already knows how to do — list, describe, summarise, query — to
an agent over MCP. The app is the one holding the sign-ins, the cache and the object tree, so the
agent never gets a credential and never talks to a provider: it asks this app, and this app decides.

What it may ask for is one file:

```
~/.objectexplorer/mcp.yaml
```

No file means the MCP server is off. That is the whole safety story in one line: **nothing is
reachable until it is written down here.**

Settings → MCP writes this file, and the file is watched, so editing it in an editor and editing it
in the dialog are the same act.

## The rules are the file's, not an agent's

Every rule here applies to **every agent**. There is one set of roots, one set of limits, one PII
floor, and turning on a second client does not mean writing them again.

A rule may then name the agents it is for:

```yaml
agents: [claudeCode]
```

Without that line the rule is for everyone; with it, only for those. It is allowed on a root under
`roots` and on `approve` — the two places where one client plausibly differs from another. The
names are the clients the app installs into: `claudeCode`, `codex`.

## The whole file

```yaml
version: 1

# The server itself. It binds to the loopback address only, in every mode — the desktop app,
# `npx objectexplorer`, the browser front door.
server:
  enabled: false
  host: 127.0.0.1
  port: 0                      # 0 = ride the app's own port, at /api/mcp
  token: 7f2a1c4e9b8d3a6f5e0c2b7d4a9f1e83   # generated on the first write; the app's only secret
  install:
    claudeCode: true           # write the entry into that client's own MCP config
    codex: false               # ticking a client also lets it initialize; only Claude Code's
                               # own config is written for it today

# What the window does while an agent is working. Following opens each object the agent touches,
# debounced, so a burst of calls does not flick through twenty objects. Escape stops following;
# the log keeps recording either way.
observe:
  follow: true
  debounceMs: 400

# The access log is always written, synchronously, before the answer leaves. This only says how
# long it is kept.
log:
  keepDays: 30

# What may be called at all.
tools: [listRoots, listObjects, describeObject, columnSummary, query]

# How much may be taken. Counted on the way out — what the agent received.
limits:
  rowsPerCall: 10000
  bytesPerCall: 32MB
  bytesPerSession: 1GB
  bytesPerDay: 4GB
  callsPerMinute: 60
  objectsPerListing: 1000
  maxObjectBytes: 256MB        # an object bigger than this is never opened for an agent

# When a human is asked first. One list for every root.
approve:
  tools: [query]
  paths: ["^raw/"]
  timeoutSeconds: 300
  onTimeout: deny
  remember: session            # never | session | day

# The PII floor, for every agent and every root. `action` defaults to `fpe`.
columns:
  - match: "^(email|emailAddress)$"
  - match: "^(phone|phoneNumber|mobile)$"
  - match: "(ssn|personalNumber|nationalId)"
  - match: "(cardNumber|iban|accountNumber)"
  - match: "^salary$"
    action: drop

# Denied everywhere, in every root. These are the paths nobody meant to share.
deny:
  - "(^|/)\\.env(\\.|$)"
  - "(secret|credential|password|token)"
  - "\\.(pem|key|p12|pfx|kdbx)$"
  - "(^|/)\\.(git|ssh|aws|azure)/"

# The roots. Each one is reachable in full, minus the deny rules above. Nothing outside this
# list is reachable at all.
roots:
  - providerType: gcs
    root: sales-lake

  - providerType: folder
    root: reference
    agents: [claudeCode]       # this one root is Claude Code's alone
```

## How one call is decided

Every call — a listing, a query, a byte range — goes through the same seven steps, in this order.
The first `deny` ends it.

| # | Step             | Denied when                                                             |
|---|------------------|-------------------------------------------------------------------------|
| 1 | server           | `server.enabled` is false, or the request did not come from `127.0.0.1` |
| 2 | agent            | the bearer token is not one this app issued                             |
| 3 | tool             | the tool is not in `tools`                                              |
| 4 | root             | no entry under `roots` names that `providerType` + `root`, for this agent |
| 5 | path             | any regex in `deny` matches                                             |
| 6 | limit            | this call, this session or today would go over a `limits` number         |
| 7 | approve          | the human said no, or said nothing for `timeoutSeconds`                 |

Then the call runs, and on the way back the result passes through `columns`.

Default deny: no `roots` means nothing is reachable. Nothing is granted by omission. A root that
is listed is reachable in full — what narrows it is `deny`, which is one list for every root
rather than a set of patterns per root: a rule about `.env` is the same rule wherever the file is.

### One gate, not one per tool

The check sits where the bytes are, in the storage layer — not in each tool. That matters most for
`query`: duckdb reaches an object only by asking this app to glob and localize it, so a SQL
statement naming a denied path is denied at the same step 5 as a byte range would be. There is no
second rule engine to keep in sync with the first, and no tool that quietly bypasses it.

### What a denial looks like

A **listing** hides what it may not show, and says how many it hid. An agent that cannot see
`exports/hr/` should not learn the folder exists from a hole in the list.

A **direct call** on a denied path is refused by name: `denied: exports/hr/staff.parquet (rule:
deny ^exports/hr/)`. An agent that asked for something specific has already guessed the name, and a
vague answer only makes it try again.

## Identity: agent, and session

`server.token` is the bearer token, and it is the one secret this feature has. The app generates it
the first time it writes this file and copies it into each client's own config when that client is
ticked — nobody types it, and nobody pastes it. Changing it here and saving cuts off every client
until they are ticked again.

One token, not one per client: the token says the caller is a program this machine let in, and the
client's own name says which program. Both are in the file, in one place, which is the point.

Two things are recorded, and they are what the log is split by:

- **agent** — which client is calling: the name it gives at `initialize`, checked against the
  clients ticked under `install`. `claudeCode`, `codex`. It is what a root's `agents:` line names,
  and what the activity strip colours.
- **session** — one MCP connection, from `initialize` to the socket closing. A new `claude` in a
  new terminal is a new session under the same agent.

```
~/.objectexplorer/mcp/<agent>/<session>.ndjson
```

One line per call, written and flushed before the answer is sent, so a killed process still has
everything it answered. The line holds the call as it arrived, the decision and which rule made it,
the counted rows and bytes, and a digest of what went back — never the payload itself. The UI is
not in this path at all: it subscribes to the same events and draws them, and a window that is
closed, slow or observing something else changes nothing about what was written.

## Path rules

`providerType` is the name the app addresses that storage by — `folder`, `gcs`, `s3`, `azure`,
`onelake` — the same word as the first segment of `/api/<providerType>/`.

Regexes, matched against the path **relative to the root**, POSIX separators, no leading slash,
folders ending in `/`. They are ordinary JavaScript regexes, matched **case-insensitively** — a
rule written for `secret` has to catch `Secret` too, and one that did not would be a rule that
looks like it works.

```
delta/orders/part-0001.parquet
exports/2026/03/
```

`deny` and `approve.paths` are lists, and any one match is enough. `deny` always wins, in every
root, which is what makes it a floor no root can raise.

One thing a listing does on its own: a folder is named with its trailing slash whichever way the
agent wrote it, so `data/sales` and `data/sales/` meet the same rule. What comes back is decided
child by child — a root with a deny rule on `exports/hr/` lists everything else and says how many
it hid.

## Limits — how much may be taken

Counted on the way **out**: what the agent received, not what the app read. A cache hit costs the
same budget as a download, because the agent got the same data.

| Limit               | Counted per            |
|---------------------|------------------------|
| `rowsPerCall`       | one call               |
| `bytesPerCall`      | one call               |
| `bytesPerSession`   | one MCP connection     |
| `bytesPerDay`       | agent, local midnight  |
| `callsPerMinute`    | agent, sliding minute  |
| `objectsPerListing` | one listing            |
| `maxObjectBytes`    | the object itself      |

A call over `rowsPerCall` is truncated and says so. A call that would cross `bytesPerSession` or
`bytesPerDay` is denied rather than truncated — a budget that silently shrinks every answer is
worse than one that stops.

## Column rules — the PII floor

One list, for every agent and every root. It is applied to every value leaving the app that has a
column name: `query` results, `columnSummary`, the sample rows in `describeObject`. First matching
rule wins, matched case-insensitively against the column name, and a column matching nothing is
returned as it is.

| Action | What comes back                                      | Keeps          |
|--------|------------------------------------------------------|----------------|
| `fpe`  | same length, same alphabet, a different value        | format, joins  |
| `hash` | 16 hex characters, `sha256(salt + value)`            | joins, counts  |
| `mask` | `•••` plus the last `keep` characters                | shape          |
| `drop` | the column is not in the result at all               | nothing        |

**`fpe` is the default**, and a rule that names no action gets it. It is the only one that leaves
the data still looking like data: a masked column breaks a join and makes every distinct count
`1`, a hashed one turns a card number into something no analysis can sanity-check, and both make an
agent ask for the raw file instead. Format-preserving encryption keeps the length, the alphabet and
the equality — so a query still groups, still joins, still counts — and gives up nothing real.

Where it cannot preserve the format — a float, a timestamp, a blob — the value is hashed instead,
which is the one place an action is decided for you. Every encrypted column is named as encrypted by
`describeObject` and beside the results of `query`, so an agent knows an id it is holding is not the
real id and never quotes it back to a human as one. The FPE key and the hash salt live in
`~/.objectexplorer`, never in this file, and never leave the machine. They are per install, so a
value is stable across sessions and means nothing anywhere else.

Two things a column rule cannot do, which is why they shape the tool list below: it cannot touch
raw bytes (`readObject`), and it cannot touch a line of a text file (`search`). Those tools carry
`approve` instead.

## Approve — the human in the loop

```yaml
approve:
  tools: [query]
  paths: ["^raw/"]
  timeoutSeconds: 300
  onTimeout: deny
  remember: session
  agents: [codex]              # optional: only this client is asked about
```

A call that matches raises a prompt in the window naming the agent, the tool and the path. Nothing
runs while it is up. No answer within `timeoutSeconds` is a denial, recorded as
`decision: timeout` — an agent waiting on a laptop that went to sleep gets a no, not the data.

`remember: session` carries one *yes* to identical calls for the rest of that session. `never` asks
every time. There is no "remember forever": that is what removing the rule is.

## Replay, and recheck

A session log is not only a record; it is something to run again — in two different senses, and
they are two different words here.

**Replay** is the window opening again what the agent opened, in the order it happened: a folder it
listed is navigated to, an object it read or queried is opened, a call it was refused opens
nothing, because there was never anything to see. It asks the rules for nothing — it is this app
showing a person what an agent saw.

The steps are listed in a panel in the top-right corner while it runs, marking the one it is on,
and the panel stays after the last step until it is dismissed — Escape, which also stops a run in
progress, or the ✕.

**Recheck** re-issues the recorded calls against today's rules and reports which decisions moved.

The list of sessions is the way into both — agent, when, how many calls, how much data.

```
claudeCode   2026-09-05 14:02   41 calls   18 MB   ok 39 · denied 2
claudeCode   2026-09-04 09:31   12 calls    2 MB   ok 12
codex        2026-09-03 16:44    7 calls    0 B    denied 7
```

Opening one opens a tab, not a panel in the dialog: a session is thousands of lines of trace and a
sequence diagram to go with it. The tab draws the client's own transcript — user, assistant, tools,
and, when Claude Code was run through a capturing proxy, every LLM round trip as well — and marks
each tool step with what it actually reached here: the object, the rows, or the rule that refused
it. Under the diagram is the same thing as a table, and either one opens the object on a click.

Nothing in the protocol joins the two accounts — a transcript is a file the client writes for
itself, and MCP never mentions it — so they are matched by time and by content: a transcript whose
tool steps name our tools with the same arguments, within a minute of the calls we logged, is that
session's.

Rechecking one re-issues the recorded calls, in order, against **today's** rules — so a rule file
that was just tightened can be checked against the traffic it will actually meet, and a denial that
surprised someone can be reproduced on demand. Each call is compared with what happened the first
time, and the ones that changed are what the replay is for:

```
listObjects  sales-lake  exports/          allowed → allowed
query        sales-lake  delta/orders/     allowed → denied  (deny ^exports/hr/)
```

A recheck is an ordinary set of calls: it is logged as its own session, marked as a recheck of the
one it came from, and it obeys every limit and every approval the live path obeys. It is not a way
to re-run something the rules no longer permit.

## What the app can offer, and what ships first

Everything here already exists in the product. The question is only which of it an agent should
reach first.

| Tool            | What it answers                                     | Built on                          | Stage |
|-----------------|-----------------------------------------------------|-----------------------------------|-------|
| `listRoots`     | which providers and roots are visible               | the storage routers               | 1     |
| `listObjects`   | the children of one path, paged                     | `RouterStorage.getObjects`        | 1     |
| `describeObject`| size, time, kind, sniffed format, schema            | `HEAD` + `base/sniff` + parquet   | 1     |
| `columnSummary` | per-column statistics, already measured             | `base/ColumnSummary`, `meta.db`   | 1     |
| `query`         | SQL over the objects, rows capped                   | `RouterDuckdb` + objectfs         | 1     |
| `search`        | names and content across a root                     | `/api/search`                     | 2     |
| `readObject`    | the bytes, or a range of them                       | `RouterStorage.get`               | 2     |
| `parse`         | a format duckdb cannot read — sav, sas7bdat, zip, pdf | `base` parsers + converter      | 2     |
| `plot`          | a chart of a result, as SVG                         | `base/plot`                       | 3     |
| `model`         | fit and score a LightGBM model                      | `lgbmEngine`                      | 3     |

**Stage 1 is the loop an agent actually runs**: find the data, learn its shape, aggregate it. All
five are server-side already, all five return rows or facts rather than bytes, and every one of
them caps naturally to `rowsPerCall`. Column rules cover the whole surface, so the PII floor holds
without a single `approve` prompt.

**Stage 2 is where raw content starts.** `readObject` and `search` both return bytes that never
passed a column name, so the column rules cannot touch them — they need `approve` and a hard
`maxObjectBytes`, and that machinery should be proven on the easy tools first. `parse` is stage 2
only because it is a conversion path, not a new risk.

**Stage 3 needs somewhere to run.** Plotting and LightGBM live in the page today, not in the
server. Exposing them means either a headless render path or driving the observing window, which is
a second architecture — worth doing once an agent is asking for it, not before.

## When there is no file

The server is off, the Settings pane offers to write a starting file, and that starting file is one
root — the local folder in the window — with `tools: [listRoots, listObjects, describeObject,
columnSummary]`, no `query`, and no cloud. Everything else is a deliberate line someone typed.

## Open questions

1. **`callsPerMinute` on a denial.** A refused call still costs a rule evaluation. Counting denials
   toward the rate limit is what stops a probe; not counting them is friendlier to a confused
   agent. Proposal: count them.
