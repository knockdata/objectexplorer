---
title: "Train without copying data out?"
answer: "Data stays, columns leave rewritten."
episode: 12
runtime: null
video: null
poster: /screenshot/notebook-python.png
published: 2026-09-14
description: "Parsers and queries run on your machine against the bucket, and PII rules rewrite the columns that matter on every request that leaves."
---

## Today

A request, a review, a scrubbed extract someone hand-built, and a three-week wait.

## Here

The data is never copied anywhere we can see: parsers and queries run on your machine, against the
bucket. PII rules rewrite the columns that matter on every request that leaves, so an agent's answer
and a share link are sanitized by the same code. FPE means `customerId` still joins to the other
table, and every rewritten column is marked `encrypted`, so nothing fabricated is quoted back as real.

## In the docs

- [Your data stays here](/privacy)
- [PII rules](/agents/pii)
- [Python](/analyze/python)
