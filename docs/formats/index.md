# Every format

More than 130 file extensions have a reader of their own, and every format below opens as itself
rather than as bytes.

| Kind                                           | Formats                                                                                                                                                                                                       |
|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Parquet                                        | <img src="/format/parquet.svg" width="18"> `parquet` — schema, rows, [column summaries](/explore/column-summary)                                                                                              |
| [Data lake](/analyze/lake)                     | <img src="/format/table.svg" width="18"> `delta` `iceberg` `hudi`, Hive and date partitions — a folder read as one table                                                                                      |
| [Tabular](/formats/tabular)                    | `csv` `tsv` `json` `jsonl` `ndjson` `yaml` `yml` <img src="/format/avro.svg" width="18"> `avro` <img src="/format/orc.svg" width="18"> `orc` <img src="/format/arrow.svg" width="18"> `arrow` `feather` `ipc` |
| [Scientific](/formats/tabular#hdf5-and-netcdf) | `h5` `hdf5` `he5` (HDF5) `nc` `nc4` `cdf` (NetCDF) — the datasets a file holds                                                                                                                                |
| [Statistics](/formats/statistics)              | <img src="/format/sas.svg" width="18"> `xpt` `sas7bdat` (SAS) <img src="/format/ibm.svg" width="18"> `sav` (SPSS)                                                                                             |
| [Databases](/formats/databases)                | <img src="/format/sqlite.svg" width="18"> `db` `sqlite` `sqlite3` `duckdb` — browsed as tables                                                                                                                |
| [Spreadsheets](/formats/documents)             | <img src="/format/excel.svg" width="18"> `xlsx` `xltx`                                                                                                                                                        |
| [Presentations](/formats/documents)            | <img src="/format/powerpoint.svg" width="18"> `pptx` `potx` `ppsx` `ppt` `pot` `pps` <img src="/format/keynote.svg" width="18"> `key`                                                                         |
| [Documents](/formats/documents)                | <img src="/format/word.svg" width="18"> `docx` `dotx` <img src="/format/evernote.svg" width="18"> `evernote`                                                                                                  |
| [PDF](/formats/pdf)                            | <img src="/format/file.svg" width="18"> `pdf` — our own reader: select, find, bookmarks, thumbnails, notes                                                                                                    |
| [Text and code](/formats/text)                 | <img src="/format/text.svg" width="18"> `md` `markdown` `txt` `html` `xml` `xsl` `js` `py`, and every source file, syntax highlighted                                                                         |
| [Notebooks](/formats/text#jupyter-notebooks)   | <img src="/format/jupyter.svg" width="18"> `ipynb` — cells with their outputs, live in a local folder                                                                                                         |
| [Logs](/analyze/logging)                       | <img src="/format/log.svg" width="18"> Cloud Logging and OpenTelemetry, live or exported                                                                                                                      |
| [Drawings](/formats/diagrams)                  | <img src="/format/excalidraw.svg" width="18"> `excalidraw` — edited, and saved back                                                                                                                           |
| [Diagrams](/formats/diagrams#mermaid)          | <img src="/format/mermaid.svg" width="18"> `mmd` `mermaid`, rendered                                                                                                                                          |
| [Images](/formats/images)                      | <img src="/format/image.svg" width="18"> `png` `jpg` `jpeg` `webp` `svg` `ico` — with EXIF, GPS and embedded text                                                                                             |
| [Audio](/formats/media)                        | <img src="/format/music.svg" width="18"> `mp3` `wav` `m4a` `aiff` `aif` `flac` `bwf` `3gpp` — played in place, frames and chunks in structure mode                                                            |
| [Video](/formats/media)                        | <img src="/format/film.svg" width="18"> `mp4` `m4v` — played in place, no download first                                                                                                                      |
| [Ebooks](/formats/ebooks)                      | <img src="/format/book.svg" width="18"> `epub` `mobi` `prc` `azw` `azw3` `fb2` `fbz` `cbz` `cbt` `cbr` — read as a book                                                                                       |
| [Sprite sheets](/formats/sprite-sheets)        | TextureAtlas and SpriteSheet XML, drawn over the atlas image                                                                                                                                                  |
| [CAD](/formats/cad)                            | `step` `stp` `sldprt` `sldasm` `slddrw` `catpart` `dwg`                                                                                                                                                       |
| [3D models](/formats/models)                   | `glb` `gltf` `fbx` `blend` `obj` `mtl`, Unity `unity` `prefab` `asset` `mesh` `mat` `anim` `controller`                                                                                                       |
| [Textures](/formats/textures)                  | `dds` `ktx2` `hdr` `pic` `exr`                                                                                                                                                                                |
| [Shaders](/formats/shaders)                    | `wgsl` `glsl` `vert` `frag` `vsh` `fsh` `comp` `geom` `tesc` `tese` `gdshader`, and `hlsl` `fx` `shader` as a diagram                                                                                         |
| [Apple](/formats/apple)                        | <img src="/format/apple.svg" width="18"> `plist` `provisionprofile` `.DS_Store`                                                                                                                               |
| [Anki](/formats/anki)                          | `apkg` — the deck as flashcards                                                                                                                                                                               |
| [Flame graphs](/formats/flame-graphs)          | `folded` `collapsed` — folded stack profiles                                                                                                                                                                  |
| [Archives](/explore/archives)                  | <img src="/format/archive.svg" width="18"> `zip` `jar` `war` `ear` `apk` `ipa` `dmg` `apkg`, and the office and CAD files, browsed as folders                                                                 |
| [Everything else](/explore/hex)                | <img src="/format/hex-mode.svg" width="18"> hex, always available                                                                                                                                             |

Other images, audio and video — `gif`, `avif`, `ogg`, `webm`, `mov` and the like — are handed to the
webview to show or play, so whether one opens is the webview's call; `tiff` and `heic` show only
where it can draw them. `psd`, `stl`, `usdz`, `7z`, `rar`, `tar` and `gz` have no reader here.

Every one of these parsers runs on your machine. Nothing is sent anywhere to be rendered — see
[your data stays here](/privacy).

Next: [tabular](/formats/tabular).
