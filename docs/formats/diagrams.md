# Drawings and diagrams

`excalidraw`, Mermaid's `mmd` `mermaid`, draw.io's `drawio` `dio`, Visio's `vsdx` `vsd` `vssx`
`vstx`, OpenDocument's `odg`, and maps as `geojson` `topojson` `gpx` `kml` `kmz` `shp`

## Excalidraw

An `.excalidraw` file opens in a full drawing editor, hand-drawn look and all: shapes, arrows, text,
frames, and a laser pointer to present with. Undo and redo are `⌘Z` and `⇧⌘Z`.

**Present** steps through the frames one at a time, with anything sequenced inside a frame playing
in order; the bar it shows goes back, forward and out again.

In a local folder, `⌘S` — or a click on the save state at the bottom left — writes the drawing back
into the file. Edits not saved yet are kept while you look at another tab.

## Mermaid

A Mermaid file opens as the diagram it describes, drawn by the app's own renderer rather than a
script fetched from somewhere. Fifteen kinds are drawn: flowchart, state, sequence, class, ER,
Gantt, git graph, journey, mind map, pie, quadrant, Sankey, timeline, XY chart and block.

## draw.io

A `.drawio` file opens as its diagram, drawn by the same painter as an Excalidraw scene, to look at
rather than to edit. An `.xml` that holds a draw.io diagram is told by what is in it, and opens drawn
too. The text is a click away.

## Visio and OpenDocument drawings

A Visio drawing — the `.vsdx` of today or the older binary `.vsd`, a stencil or a template — and an
OpenDocument drawing (`.odg`) open as a picture of their first page, with its shapes, connectors and
text. The words of every page are read for [search](/explore/search).

## Maps

A GeoJSON or TopoJSON file, a GPS track (`.gpx`), a Google Earth file (`.kml`, `.kmz`) or a
shapefile opens as its shapes, drawn: points, lines and areas, at the file's own coordinates. No map
service is called. The text of the ones that are text is a click away. A shapefile's `.shp` is drawn
on its own; its attributes in the `.dbf` beside it open as a [table](/formats/databases).

Next: [images](/formats/images).
