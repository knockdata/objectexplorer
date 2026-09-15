---
title: "Read a lake table's history?"
answer: "Every commit, on a timeline."
episode: 11
runtime: null
video: null
poster: /screenshot/lake-metadata.png
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
