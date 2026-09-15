---
title: "Prove what the agent read?"
answer: "Every call, written down first."
episode: 15
runtime: null
video: null
poster: null
published: 2026-09-14
description: "Every agent call is logged before its answer leaves — the rule that decided it, the rows, the bytes — and any session can be replayed step by step."
---

## Today

Provider access logs that say an IAM principal read a prefix, which is not an answer.

## Here

Every call was written and flushed before the answer left: the rule that decided it, the rows, the
bytes. The session list opens one session as a tab with the agent's own transcript beside what it
reached, and Replay opens it again, in order, step by step.

## In the docs

- [Sessions, replay and audit](/agents/sessions)
- [The MCP rule file](/reference/mcp-rules)
