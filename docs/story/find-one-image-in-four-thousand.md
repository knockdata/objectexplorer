---
title: "Find one image in four thousand?"
answer: "The folder is a grid of pictures."
episode: 8
runtime: null
video: null
poster: null
published: 2026-09-14
description: "A prefix of 4,000 generated images opens as a grid of the images themselves: zoom, walk, and drag the good ones into a folder."
---

A diffusion run wrote 4,000 PNGs to `s3://assets/gen/2026-09-11/`. The good one is in there.

## Today

The console lists 4,000 filenames and no pictures. So: sync the whole prefix to a laptop, open
Finder or an image viewer, scroll, write down the filenames that worked, and delete 4 GB
afterwards — having paid egress on every one of them, including the 3,990 that were wrong.

## Here

The folder opens as a grid of the images themselves. Five zoom steps on `⌘⇧=`, arrows to walk,
`Enter` for full size, `⇧` to take a run of them. Each image is fetched once into the local cache,
so scrolling back through the set is instant and costs nothing the second time.

## And then

Drag the good ones onto a `picked/` folder in the same tree. One gesture, and they are copied —
inside one provider that copy runs server-side and the bytes never come down again.

## In the docs

- [The tree and the list](/explore/tree)
- [Previewing an object](/explore/preview)
- [Copy, move, rename, delete](/explore/file-management)
