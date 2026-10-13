# Charts

<script setup>
// the notebook cells the frame opens on, each "<type>:<code>"
const cells = [
	`table:SELECT country, count(*) AS stations FROM 'nl_train_stations.parquet' GROUP BY country ORDER BY stations DESC`,
	`chart:Plot.plot({
	width, height,
	marginLeft: 60,
	grid: true,
	marks: [Plot.barY(rows, {x: "country", y: "stations", sort: {x: "-y"}, tip: true})],
})`,
]
</script>

<AppDemo open="folder/demo/table/nl_train_stations.parquet" :cells="cells" height="640px" image="/screenshot/notebook-chart.png" alt="A chart cell: stations per country, drawn from the rows above" />

A chart cell writes its own first draft. The [column statistics](/explore/column-summary) say which
column is a date, which is a category, which is a measure and which is an id that counts up once per
row — and the strip under the code offers the charts those columns actually support, named in plain
words.

Click one and its source is written into the editor and drawn. After that it is source, and it is
yours: change it and run the cell, and it draws what the source says.

```js
Plot.plot({
	width, height,
	marginLeft: 60,
	grid: true,
	marks: [Plot.barY(rows, {x: "country", y: "count", tip: true})]
})
```

`rows` is what the cell above produced. The source is written the way
[Observable Plot](https://observablehq.com/plot) writes it, and the app draws the part of Plot that
charts of a table need: bars (`barY`, `barX`, grouped with `groupX` by count, mean or sum, sorted by
height), histograms (`rectY` over `binX`), lines over a date, dots, box plots, rules and arrows. The
last line must be the `Plot.plot(…)`.

Suggestions are named after your columns, not after chart types — *count by country*, *average
geo_lat by type*, *spread of geo_lng*, *geo_lat over date* — because the question is what you have,
not which mark implements it.

Next: [models](/analyze/model).
