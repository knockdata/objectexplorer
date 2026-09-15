---
title: "Click it. The analysis is already there."
problem: "A dataset landed overnight and nobody knows what is in it"
episode: 2
runtime: null
video: null
poster: /shot/column-summary.png
marker: pink
published: 2026-09-14
description: "A new tabular object opens as a notebook with the query and the chart written, and a summary under every column header."
---

## Today

Start Jupyter, make a new notebook, type the imports, type the read, run it, type `df.describe()`,
run it, type `df.isna().sum()`, run it. Twenty minutes of ceremony to learn the object has three
usable columns and a date range that stops in March.

## Here

Click it. It opens as a notebook that already has the query and the chart written, and under every
column header there is a histogram or a box plot with min, max, nulls, distinct count and top
values — measured here, on the rows that were read, by your own cores.

## In the docs

- [Column summaries](/explore/column-summary)
- [The notebook](/analyze/notebook)
- [SQL](/analyze/sql)
