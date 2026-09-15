---
title: "The agent asks the gateway, never the bucket."
problem: "An agent needs production data on Monday"
episode: 10
runtime: null
video: null
poster: null
marker: pink
published: 2026-09-14
description: "The agent holds no credential: it goes through a gateway that reaches only the ticked roots, asks a person for named paths, rewrites PII and caps what leaves."
---

## Today

Someone puts a long-lived key in an agent's environment, and nobody can say afterwards what it read.

## Here

The agent holds no credential and never talks to a provider; it goes through the gateway. It reaches
only the roots that were ticked, minus the deny list. Named paths stop and ask a person in the window,
with a timeout that defaults to no. PII is rewritten on the way out. Limits cap rows, bytes and calls
per call, per session and per day — which bounds a leak and an agent's token bill with the same number.

## In the docs

- [ObjectExplorer for agents](/agents/)
- [Connecting an agent](/agents/connect)
- [PII rules](/agents/pii)
- [The MCP rule file](/reference/mcp-rules)
