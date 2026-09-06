# Connecting an agent

Everything here is **Settings → MCP**. Each control on that pane is one line of
`~/.objectexplorer/mcp.yaml`, and the file is read again whenever it changes — so editing it in the
pane and editing it in an editor are the same act.

## 1. Write a starting rule file

With no file, nothing is reachable and the pane says so. **Write a starting rule file** creates one:

- the folders already in your window, as roots
- `listRoots`, `listObjects`, `describeObject`, `columnSummary` — **no `query`**
- the PII floor: email, phone, personal number, card and account numbers
- the deny floor: `.env`, `*.pem`, `*.key`, `.git/`, `.ssh/`, `.aws/`, anything with `secret`,
  `credential`, `password` or `token` in the path
- the door **shut**, and no client installed

Everything past that is a line you set.

## 2. Open the door

One toggle: *The door is shut* / *The door is open*. Under it, the two things any client needs:

```
Endpoint   http://127.0.0.1:<port>/api/mcp
Token      7f2a1c4e9b8d3a6f5e0c2b7d4a9f1e83
```

The server binds the loopback address, in every mode — the desktop app, `npx objectexplorer`, the
browser front door. It is never mounted on the public host, for the same reason `/api/duckdb` is
not.

## 3. Install into a client

| Client          | Button writes                        |
|-----------------|--------------------------------------|
| **Claude Code** | `~/.claude.json`, `mcpServers.objectexplorer` |
| **Codex**       | `~/.codex/config.toml`, `[mcp_servers.objectexplorer]` |

**Install** writes the entry, the URL and the token into that client's own config. Nobody types a
token anywhere. **Uninstall** takes it back out and touches nothing else in the file. A client that
is not on this machine says *not found on this machine* and its button is dead.

For anything else that speaks MCP's Streamable HTTP transport, **Copy Connection** puts the whole
block on the clipboard, already shaped:

```json
{
  "objectexplorer": {
    "type": "http",
    "url": "http://127.0.0.1:7788/api/mcp",
    "headers": { "Authorization": "Bearer 7f2a1c4e9b8d3a6f5e0c2b7d4a9f1e83" }
  }
}
```

Ticking a client does two things, and they are different: the client's config learns where to call,
and the rule file learns that this client may `initialize` at all. A client holding a valid token
whose name is not ticked is refused at the handshake, in a sentence a person will read.

## 4. Choose what may be called

Five tools, ticked one by one.

| Tool             | Answers                                          |
|------------------|--------------------------------------------------|
| `listRoots`      | what is reachable at all — an agent starts here   |
| `listObjects`    | the children of one folder                        |
| `describeObject` | size, time, content type and columns of one object |
| `columnSummary`  | per-column statistics of a tabular object          |
| `query`          | one SQL statement, over objects named by URI       |

`query` is the one worth thinking about, and the one a starting file leaves off: it is the only tool
that reads a whole table. Turning it on is what makes the app an analysis engine for the agent
rather than a catalogue.

An agent names everything by the same URI the app writes into SQL — `gs://bucket/key`,
`s3://bucket/key`, `az://account/container/key`, and `root/key` for a local folder you mounted.

## 5. Tick the roots

**Allow roots** is one tick per root already in this window. A ticked root is reachable **in full**;
nothing unticked is reachable at all. What narrows a ticked root is **Deny rules** — one list that
holds in every root, so a decision about `.env` is made once.

**Approve rules** is the third list: a path matching one of them stops and asks a person, in the
window, before anything runs. Nothing runs while the prompt is up, and no answer within five minutes
is a no.

→ the full file, key by key: [the MCP rule file](/reference/mcp-rules)

## 6. Try a rule before an agent does

**Test a rule** takes an object named the way an agent would name it, a tool, and a content box, and
answers with the verdict, the rule that decided it, and the content **in the form it would go to the
agent** — the header without the dropped columns, the values masked or encrypted, the free-text
field rewritten in place.

```
name,email,phone,personalNumber,geo_lat,city,amount,note      ← as it is
Rockie Yang,rockie.yang@example.com,+46 70 123 45 67,19850613-1234,55.60587,…

name,email,phone,personalNumber,city,amount,note              ← as it goes
Rock*e Yang,yqsbgn.wbce@seeqzli.qpk,+07 48 108 80 21,24519676-4457,…
```

Nothing is read and nothing is logged, and the object need not exist — it runs the real gate and the
real column plan.

## What a denial looks like to the agent

A denial is not an error. The call was well formed and the answer is no, so it comes back as a tool
result that names the step and the rule:

```
denied: gs://sales-lake/exports/hr/staff.parquet (step: path, rule: deny (secret|credential|password|token))
```

An agent told which rule stopped it stops guessing. One told only "error" tries the same call four
more ways, on your budget.

A **listing** behaves differently: it hides what it may not show and reports how many it hid. An
agent that cannot see `exports/hr/` should not learn the folder exists from a hole in the list.

Next: [sessions, replay and audit](/agents/sessions), or [PII rules](/agents/pii).
