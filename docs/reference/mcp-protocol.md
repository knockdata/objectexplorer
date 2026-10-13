# The MCP endpoint

What an agent talks to, and what it may call. The rules that decide the answers are in
[the MCP rule file](/reference/mcp-rules); this page is the wire.

## One endpoint

```
POST   http://127.0.0.1:3417/mcp      a JSON-RPC message
GET    http://127.0.0.1:3417/mcp      405: no server stream is offered
DELETE http://127.0.0.1:3417/mcp      end this session
```

MCP's Streamable HTTP transport, protocol version `2025-06-18`, on **a listener of its own**:
`server.host` and `server.port` in the rule file, `127.0.0.1:3417` unless you change them. It is not
the port the window or `npx objectexplorer` serves on, and it is open only while `server.enabled` is
on and a token is written. `/api/mcp` on the same listener is answered the same way, for client
configs written by an older version.

The listener answers the agent and nothing else. The window does not talk to it: it reaches the MCP
service the way it reaches every other service of the app, so there is no settings route a token
could be pointed at.

Four things are checked before a byte of JSON-RPC is parsed, and each is a plain HTTP failure:

| Check                                         | Failure |
|-----------------------------------------------|---------|
| `server.enabled` and a token in the rule file | `403`   |
| the connection came from this machine         | `403`   |
| `Origin`, when present, is loopback or absent | `403`   |
| `Authorization: Bearer <server.token>`        | `401`   |

The `Origin` check is what stops a web page in the user's own browser from driving the agent
endpoint — a page can send a POST to localhost, and without this it would be an agent.

## A session

```
→ POST /mcp   {"jsonrpc":"2.0","id":1,"method":"initialize","params":{
             "protocolVersion":"2025-06-18",
             "clientInfo":{"name":"claude-code","version":"2.1.88"},
             "capabilities":{}}}

← 200         Mcp-Session-Id: 3f9c1a7e
              {"jsonrpc":"2.0","id":1,"result":{
                 "protocolVersion":"2025-06-18",
                 "serverInfo":{"name":"objectexplorer","version":"<app version>"},
                 "capabilities":{"tools":{"listChanged":true}}}}

→ POST /mcp   {"jsonrpc":"2.0","method":"notifications/initialized"}
```

Every request after that carries `Mcp-Session-Id` and `MCP-Protocol-Version`. The session id is
what the access log is filed under, next to the agent name — and the agent name is
`clientInfo.name`, normalised (`claude-code` → `claudeCode`) and matched against the clients ticked
under `install`. A client that is not ticked is refused at `initialize`, which is the one place a
refusal can say why in words a human will read.

`tools.listChanged` is not decoration: editing the rule file changes which tools exist, and the
notification is what stops an agent from calling one that was there a minute ago.

Session state is one map in the server process. A restart drops it, and a client that gets `404
session not found` re-initializes — the same recovery every Streamable HTTP client already has.

## Answering: JSON, or a stream

Every message is answered with `Content-Type: application/json` — one JSON-RPC response, never a
stream, because that is a smaller thing to get right and most calls finish in milliseconds.

A call that has to wait — an `approve` prompt in the window — holds its response open until a
person answers or `approve.timeoutSeconds` runs out. No progress is sent while it waits, so a client
whose own timeout is shorter gives up first; the prompt then stays until it times out here.
`notifications/cancelled` — the agent gave up, or the user pressed ctrl-c in it — closes the prompt
and is logged as `decision: cancelled`, which is not the same fact as a timeout.

## The tools

Seven, the same seven [the rule file](/reference/mcp-rules#the-tools) ticks one by one — and a
tool that is not ticked is not listed at all. Every one of them names its object by a `uri`, and it
is the same URI the app writes into SQL — `gs://bucket/key`, `s3://bucket/key`,
`az://account/container/key`, `abfss://…`, and `root/key` for a local folder the user mounted. One
string for an agent to carry, and the one it would have typed into a query anyway. The gate turns it
back into `providerType` + `root` + `path` and checks it there.

```
listRoots      {}                         → what is reachable at all
listObjects    {uri, limit?}              → children of one path, and how many were hidden
describeObject {uri}                      → size, time, format, columns
columnSummary  {uri}                      → statistics per column, measured after the column rules
searchText     {uri, pattern, limit?}     → lines matching a regular expression, in one object or a folder
query          {sql, limit?}              → rows
getObject      {uri, offset?, limit?}     → rows, text or a tree, by what the object is; raw bytes refused
```

Two of them, as they are listed:

```json
{
  "name": "describeObject",
  "description": "Size, time, format and columns of one object.",
  "inputSchema": {
    "type": "object",
    "properties": { "uri": { "type": "string" } },
    "required": ["uri"]
  }
}
```

```json
{
  "name": "query",
  "description": "Run one SQL statement. Name an object by its URI, as duckdb does.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "sql": { "type": "string" },
      "limit": { "type": "integer" }
    },
    "required": ["sql"]
  }
}
```

What each one answers with:

```
listRoots      {roots: [{uri, providerType, root}]}
listObjects    {uri, objects: [{uri, name, objectKind, size, mtime}], hidden, truncated}
describeObject {uri, objectKind, size, mtime, contentType, columns: [{name, encrypted}]}
columnSummary  {uri, rowsMeasured, columns: [{name, encrypted, …statistics}]}
searchText     {uri, pattern, hits: [{uri, line, text}], searched} — searched: a folder only
query          {columns: [{name, encrypted}], rows, rowCount, truncated}
getObject      {uri, objectType, …} — rows, text or a tree
```

`getObject` counts `offset` and `limit` in rows for a table and lines for a text. An object with no
text this app can read (an image, an archive, a model) is refused with `step: "type"`: bytes no
rule has checked are not sent.

`encrypted: true` is on every column a rule rewrote, in `describeObject` and in `columnSummary`. A
`query` never sees a real value of such a column: each object it names is read through a view where
those columns are already rewritten (a dropped one is not there), so `SELECT ssn AS x` or
`upper(email)` gets the rewritten value too, and its result marks a column `encrypted` when its name
is one a rule catches. An agent holding a customer id that is not the customer id has to be told, or
it will hand it to a human as one.

Every result is returned twice, as the protocol asks: `structuredContent` is the object above, and
`content[0]` is the same thing as text, so a client that reads neither schemas nor structured
results still shows something useful.

## What a denial looks like on the wire

A denial is not a transport failure. The call was well formed, the server understood it, and the
answer is no — so it is a tool result with `isError`, and it says which rule:

```json
{
  "jsonrpc": "2.0", "id": 12,
  "result": {
    "isError": true,
    "structuredContent": {
      "denied": true,
      "step": "path",
      "rule": "deny ^exports/hr/",
      "uri": "gs://sales-lake/exports/hr/staff.parquet"
    },
    "content": [{ "type": "text",
      "text": "denied: gs://sales-lake/exports/hr/staff.parquet (rule: deny ^exports/hr/)" }]
  }
}
```

The same shape carries a limit (`step: "limit"`, `rule: "bytesPerDay 4GB"`) and a refused approval
(`step: "approve"`, `rule: "timeout"`). An agent that is told which rule stopped it stops guessing;
one that is told only "error" tries the same call four more ways.

JSON-RPC `error` is kept for what it is for: a method that does not exist, arguments that do not
parse, a session that is gone.

## Installing into a client

Ticking a client in Settings writes that client's own config, with the token from the rule file.

**Claude Code** — `claude mcp add --transport http objectexplorer http://127.0.0.1:3417/mcp
--header "Authorization: Bearer <token>"`, which lands in `~/.claude.json`. The app writes the same
entry itself rather than shelling out, so it works when the CLI is not on PATH.

**Codex** — `~/.codex/config.toml`, `[mcp_servers.objectexplorer]`, edited as text so nothing else
in the file is touched. `experimental_use_rmcp_client = true` is added when it is missing, because
that is what turns Codex's HTTP transport on at all, and it is left alone on uninstall — another
server may be relying on it.

Anything else that speaks this transport is wired by hand: **Copy Connection** in Settings → MCP
puts the address and the token on the clipboard as one block, already shaped the way a client's
config wants them. A client that speaks only stdio needs a bridge, and there is none in the app
today.

## The other half: what the window uses

The window never calls the agent's listener. Settings → MCP and the session tabs reach the same MCP
service in the app's own process: the rule file read and written (comments kept), Install, the
sessions and their calls, the client's transcript, Recheck, the answer to an approval, and a live
feed of every call as it is decided. That feed is what observing is: the window follows what it
sees, debounced, and Escape stops following. It is a mirror of the log, never its source — the log
is written before the answer leaves, whether or not a window is listening.

## Where it lives

```
service/mcp/door.js        the listener: the four checks, sessions, JSON-RPC
service/mcp/rules.js       mcp.yaml, read again whenever it changed
service/mcp/gate.js        the steps that decide a call, and the only thing that does
service/mcp/call.js        one call, from the rules to the record
service/mcp/budget.js      what an agent has taken, and whether it may take more
service/mcp/approve.js     the prompt, and what a timeout means
service/mcp/tools.js       each tool, over the app's storage, database and readers
service/mcp/log.js         one ndjson file per agent per session, written before the answer
service/mcp/transcript.js  the client's own account, matched to a session
service/pii/columns.js     fpe / hash / mask / drop
service/pii/sanitize.js    the floor every answer goes through
```

Next: [troubleshooting](/reference/troubleshooting).
