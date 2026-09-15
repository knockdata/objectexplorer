---
title: "Read the commit log as what it is."
problem: "What did the last few commits to this lake table actually do"
episode: 7
runtime: null
video: null
poster: /shot/lake-metadata.png
marker: amber
published: 2026-09-14
description: "Delta, Iceberg and Hudi metadata shown as commits, snapshots and a timeline — and the table queried as of any of them."
---

## Today

An engine that speaks the format, and somebody who knows how to read a commit log by hand.

## Here

Each format is parsed to its own specification and shown as what it is: Delta as its commit log with
what each version added and removed, Iceberg as its snapshots and manifests, Hudi as its timeline.
Query the table as of any of them, and the offending write is visible before anyone is woken up.

## In the docs

- [Data lake tables](/analyze/lake)
