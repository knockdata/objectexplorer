# The MCP endpoint

What an agent talks to, and what it may call. The rules that decide the answers are in
[the MCP rule file](/reference/mcp-rules); this page is the wire.

## One endpoint

```
POST   http://127.0.0.1:<appPort>/api/mcp      a JSON-RPC message
GET    http://127.0.0.1:<appPort>/api/mcp      the server's own stream
DELETE http://127.0.0.1:<appPort>/api/mcp      end this session
```

MCP's Streamable HTTP transport, protocol version `2025-06-18`, on the port the app is already
serving — the desktop app, `npx objectexplorer` and the browser front door all bind a local port,
and this rides it. `server.port` in the rule file gives it one of its own instead, for the case
where a client cannot be told the app's port.

It sits under `/api` with everything else this app answers, and it is never mounted on the public
host, for the same reason `/api/duckdb` is not: this is the door to local storage, and only this
machine may knock.

The bare path is the agent's, and **everything under it is the window's** — `/api/mcp/events`,
`/api/mcp/rules` and the rest, listed at the bottom of this page. One prefix, one router, and one
line that keeps them apart: a request carrying the bearer token is answered only at `/api/mcp`
itself. An agent that has the token and tries `/api/mcp/rules` is asking to rewrite the rules that
bind it, and gets a `403` — the token buys the JSON-RPC door and nothing else.

Three things are checked before a byte of JSON-RPC is parsed, and each is a plain HTTP failure:

| Check                                        | Failure |
|----------------------------------------------|---------|
| `Authorization: Bearer <server.token>`       | `401`   |
| the connection came from `127.0.0.1`         | `403`   |
| `Origin`, when present, is loopback or absent | `403`   |

The `Origin` check is what stops a web page in the user's own browser from driving the agent
endpoint — a page can send a POST to localhost, and without this it would be an agent.

## A session

```
→ POST /api/mcp   {"jsonrpc":"2.0","id":1,"method":"initialize","params":{
                 "protocolVersion":"2025-06-18",
                 "clientInfo":{"name":"claude-code","version":"2.1.88"},
                 "capabilities":{}}}

← 200         Mcp-Session-Id: 3f9c1a7e
              {"jsonrpc":"2.0","id":1,"result":{
                 "protocolVersion":"2025-06-18",
                 "serverInfo":{"name":"objectexplorer","version":"0.4.12"},
                 "capabilities":{"tools":{"listChanged":true}}}}

→ POST /api/mcp   {"jsonrpc":"2.0","method":"notifications/initialized"}
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

A `tools/call` that runs and returns is answered with `Content-Type: application/json` — one
JSON-RPC response, no stream, because that is a smaller thing to get right and most calls finish in
milliseconds.

A call that has to wait — an `approve` prompt in the window, a query on a cold object that has to be
downloaded first — is answered with `text/event-stream`, and progress goes out on it while it
waits:

```
event: message
data: {"jsonrpc":"2.0","method":"notifications/progress","params":{
        "progressToken":7,"progress":1,"message":"waiting for approval (4:31 left)"}}
```

Progress every ten seconds, for the whole five minutes. Without it a client's own timeout decides
the answer instead of the human, and the human is the point. `notifications/cancelled` — the agent
gave up, or the user pressed ctrl-c in it — closes the prompt and is logged as
`decision: cancelled`, which is not the same fact as a timeout.

## The tools

Stage 1, the five in
[what ships first](/reference/mcp-rules#what-the-app-can-offer-and-what-ships-first). Every one of
them takes a `uri`, and it is the same URI the app writes into SQL — `gs://bucket/key`,
`s3://bucket/key`, `az://account/container/key`, `abfss://…`, and `root/key` for a local folder the
user mounted. One string for an agent to carry, and the one it would have typed into a query
anyway. The gate turns it back into `providerType` + `root` + `path` and checks it there.

```
listRoots     {}                → what is reachable at all
listObjects   {uri, limit?}     → children of one path, and how many were hidden
describeObject{uri}             → size, time, content type, columns
columnSummary {uri}             → statistics per column, measured after the column rules
query         {sql, limit?}     → rows
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
query          {columns: [{name, encrypted}], rows, rowCount, truncated}
```

`encrypted: true` is on every column a rule rewrote, in `describeObject`, in `columnSummary` and in
`query` results. An agent holding a customer id that is not the customer id has to be told, or it
will hand it to a human as one.

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

**Claude Code** — `claude mcp add --transport http objectexplorer http://127.0.0.1:<port>/api/mcp
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

## The other half: what the window listens to

The agent's side is above, at the bare `/api/mcp`. The window's side is everything under it: our
own API, deliberately not MCP, and refused to anyone holding the bearer token.

```
GET  /api/mcp/events                     SSE: one event per call, as it is decided
GET  /api/mcp/status                     on or off, which clients, what is waiting
GET  /api/mcp/sessions                   the sessions each agent has performed
GET  /api/mcp/session?agent=&session=    one session's calls, for replay and for reading
GET  /api/mcp/transcript?agent=&session= the client's own account of the same work
POST /api/mcp/recheck  {agent, session}  run that session's calls again against today's rules
POST /api/mcp/approve  {callId, ok}      the answer to a prompt
GET  /api/mcp/rules                      the parsed rule file, its text, and any error in it
POST /api/mcp/rules    {text}            write it back
POST /api/mcp/enable   {on}              one line of the rule file, comments kept
POST /api/mcp/install  {client, on, url} tick a client: the rule file, then its own config
POST /api/mcp/starter  {roots}           write a first rule file when there is none
POST /api/mcp/settings {…}               one setting, written back into the file's own text
POST /api/mcp/try      {…}               run the gate and the column plan, reading nothing
GET  /api/mcp/transcriptFile             the client's own transcript, as it is on disk
```

`/api/mcp/events` is what observing is: the window follows what it sees, debounced, and Escape
stops following. The stream is a mirror of the log, never its source — the log is written and
flushed before the answer leaves the server, whether or not a window is listening.

## Where it lives

```
server/src/router/RouterMcp.js     the endpoint: sessions, JSON-RPC, SSE
server/src/mcp/rules.js            read and watch mcp.yaml, parse it into one rule set
server/src/mcp/gate.js             the seven steps, one function, called by the storage layer
server/src/mcp/call.js             one call, from the rules to the record
server/src/mcp/budget.js           what an agent has taken, and whether it may take more
server/src/mcp/approve.js          the prompt, and what a timeout means
server/src/mcp/transcript.js       the client's own account, matched to a session
server/src/mcp/columns.js          fpe / hash / mask / drop
server/src/mcp/tools.js            the tool definitions and what each one calls
server/src/mcp/log.js              one ndjson file per agent per session, flushed on write
explorer/src/components/McpPane.jsx   the Settings pane
explorer/src/components/McpActivity.jsx  the sparkline strip, one colour per agent
```

The gate is called by the storage layer, not by the tools — see
[one gate, not one per tool](/reference/mcp-rules#one-gate-not-one-per-tool).
