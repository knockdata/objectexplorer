# Sessions, replay and audit

Everything an agent asked for is written down before it is answered. This page is what you can do
with that record — while it happens, and afterwards.

## The log

```
~/.objectexplorer/mcp/<agent>/<session>.ndjson
```

One line per call, **written and flushed before the answer leaves the server**, so a process that is
killed still has everything it answered. Each line holds the call as it arrived, the decision and
which rule made it, the rows and bytes counted, how long it took — and never the payload. A log
holding the rows would be a second copy of the data the rules just spent their time protecting.

Two things split it, and they are the two things worth asking about:

- **agent** — which client is calling. The name it gives at the handshake, checked against the
  clients you ticked: `claudeCode`, `codex`.
- **session** — one connection, from `initialize` to the socket closing. A new `claude` in a new
  terminal is a new session under the same agent.

**Log history** in Settings → MCP is how long they are kept: 1D, 7D, 1M, 3M or 1Y.

## Watching it happen

**Observe** — *open what the agent opens*. While it is on, every object the agent touches is opened
here, in the window, as it is touched. Debounced, with a dial, so a burst of forty calls does not
flick through forty objects. **Escape** stops following; the log keeps recording either way.

Under it, the **activity strip**: one line per agent, in its own colour, over the last ten minutes.
The shape is the point rather than the number — a burst, a steady walk through a folder, an
afternoon of nothing. Denied calls are drawn on the same line, so a run that is mostly refusals
looks different from a run that is mostly work. That difference is the whole reason to watch.

The window is a mirror, never the source. It subscribes to the same records that were already
written — a window that is closed, slow or looking somewhere else changes nothing about what the
log holds.

## Approvals

A call matching an approve rule stops and raises a prompt naming the agent, the tool and the path.
Nothing runs while it is up. No answer within `timeoutSeconds` is a **no**, recorded as a timeout —
an agent waiting on a laptop that went to sleep gets a denial, not the data. An agent that gave up
first, or a person who pressed ctrl-c in it, closes the prompt as *cancelled*, which the log records
as the different fact it is.

*Yes* is remembered for identical calls for the rest of that session. There is no remember-forever:
that is what removing the rule is.

## The session list

**Settings → MCP sessions** — one row per session, newest first.

```
Agent        Started              Calls   Data   Denied
claudeCode   2026-09-05 14:02        41   18MB        2
claudeCode   2026-09-04 09:31        12    2MB
codex        2026-09-03 16:44         7     0B        7
```

A row opens that session as a **tab**, not a panel — a hooked session is thousands of lines of
trace, and a modal is not where anyone reads one.

## One session, whole

The tab draws two accounts of the same work, because neither is enough alone.

**The client's own transcript** — what a person asked, what the model answered, and which tools it
dispatched — drawn as a sequence diagram. Nothing in the protocol joins a transcript to a session;
it is a file the client writes for itself, and MCP never mentions it. So they are matched the only
way they can be: by time and by content. A transcript naming our tools with the same arguments,
inside the minutes the session ran, is that session's.

**Our log** — which of those calls reached this app, which rule decided each one, and how much data
left — as a table under the diagram. Every MCP step in the diagram carries what it actually reached:
the object, the rows, or the rule that refused it. Either one opens the object on a click.

When Claude Code was run through a capturing proxy, the transcript carries every LLM round trip as
well, and the diagram shows those too.

## Replay

**Replay**, on a session row, opens again — here, in the window, in the order it happened —
everything the agent opened. A folder it listed is navigated to; an object it read or queried is
opened; a call it was refused opens nothing, because there was never anything to see.

It asks the rules for nothing. It is this app showing a person what an agent saw.

The steps are listed in a panel in the top-right corner while it runs, marking the one it is on. The
panel outlives the run: it stays until it is dismissed with Escape or the ✕, and Escape also stops a
run in progress.

## Recheck

**Recheck** is the other way to run a session again, and it is a different question. It re-issues
the recorded calls, in order, against **today's** rules, and reports which decisions moved:

```
listObjects  sales-lake  exports/          allowed → allowed
query        sales-lake  delta/orders/     allowed → denied  (deny ^exports/hr/)
```

So a rule file that was just tightened can be checked against the traffic it will actually meet, and
a denial that surprised someone can be reproduced on demand.

A recheck is an ordinary set of calls: it is logged as its own session, marked as a recheck of the
one it came from, and it obeys every limit and every approval the live path obeys. It is not a way
to re-run something the rules no longer permit.

→ the endpoints behind all of this: [the MCP endpoint](/reference/mcp-protocol#the-other-half-what-the-window-listens-to)
