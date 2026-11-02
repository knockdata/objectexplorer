# Maps

GeoJSON `geojson` `topojson`, GPS tracks `gpx` `tcx` `igc`, Google Earth `kml` `kmz`, shapefiles
`shp` `shx`, GeoPackage `gpkg`, map tiles `mbtiles` `pmtiles`, FlatGeobuf `fgb`, MapInfo `mif`,
OpenStreetMap `osm` `osm.pbf`, GML `gml`, and GeoParquet

<img src="/screenshot/format-maps.png" alt="A PMTiles archive of France drawn from its vector tiles: the coast, the borders and the islands, with a zoom control and the line saying 19 areas between 5° W and 8.6° E">

A map file opens as its shapes, drawn: points, lines and areas, at the file's own coordinates. No
map service is called and nothing is fetched to draw under them; what you see is what the file
holds. **−** and **+** zoom in and out.

The line at the pane's foot says what the map holds and where — "19 areas · 5.0° W–8.6° E,
42.2–51.2° N (WGS 84, the GPS coordinate system)". A map in a projection of its own says its
coordinates are in the file's own units. In a narrow pane the counts stay and the rest is in the
line's tooltip.

The text of the ones written as text is a click away.

## Shapes

| File                                   | What is drawn                    |
|----------------------------------------|----------------------------------|
| GeoJSON `geojson`, TopoJSON `topojson` | its features                     |
| a GPS track `gpx`                      | its tracks, routes and waypoints |
| Google Earth's KML `kml`, zipped `kmz` | its placemarks                   |
| a shapefile `shp`, or its index `shx`  | its shapes                       |

A shapefile's `.shp` is drawn on its own, and its `.shx` draws the `.shp` beside it. The attributes
in the `.dbf` open as a [table](/formats/databases).

## Maps that are tables too

These open on their map, and their features are rows next, on the **Table** and in the
[notebook](/analyze/notebook), a geometry written as text (WKT, the well-known text of geometry):

| File                                                                | A row for each                              |
|---------------------------------------------------------------------|---------------------------------------------|
| FlatGeobuf `fgb`                                                    | feature, with its properties                |
| MapInfo interchange `mif`, its attributes in the `.mid`             | object, with its attributes                 |
| OpenStreetMap extract `osm.pbf`, or its XML `osm`                   | node, way or relation: three tables         |
| GML (Geography Markup Language) `gml`                               | feature, a column a property                |
| GeoParquet, a `.parquet` holding geometries                         | row, as any Parquet file's                  |
| Garmin's Training Center XML (TCX) activity `tcx`                   | track point: time, place, heart rate, speed |
| a glider's flight log, the International Gliding Commission's `igc` | fix: time, place, both altitudes            |

A GeoParquet file is a Parquet file whose footer says which columns are geometries: it opens on its
map, where any other Parquet file opens on its table. An OpenStreetMap extract draws its ways
through their nodes; its nodes, ways and relations are three tables, their tags a JSON column the
grid splits into a column per key. A MapInfo `.mid` opened alone is its text.

A Garmin FIT activity opens on its track the same way, its messages as tables next — see [health and
fitness](/formats/medical#health-and-fitness-data).

## Databases of maps

A GeoPackage (`.gpkg`) and an MBTiles tileset (`.mbtiles`) are SQLite files: each opens on its map
first, then the list of its tables, as any [SQLite file](/formats/databases), each table queryable
with [SQL](/analyze/sql). A GeoPackage's geometries read as text in its tables.

Map tiles — an MBTiles tileset or a PMTiles archive (`.pmtiles`) — are drawn in Web Mercator, the
projection tiles are cut in, at the deepest zoom level of at most 16 tiles, so the map shows the
most detail a picture holds. A vector tile's points, lines and areas are drawn as shapes, a picture
tile (PNG, JPEG, WebP) as the picture where it lies. A PMTiles archive's **Structure** lays out its
header, its directories, its metadata and its tiles.

Next: [images](/formats/images).
