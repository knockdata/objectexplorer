# Science and machine learning

`npy` `npz` `safetensors` `gguf` `fits` `mat` `nii` `nrrd` `zarr` `grib` `mtx`, physics and earth
science tables `root` `hdf` `vot`, and measurement logs `tdms` `mf4` `mdf` `blf` `asc` `sgy` `segy`

<img src="/screenshot/format-science.png" alt="A GGUF model opened as a table: its metadata first, then every tensor with its type, shape, element count, bytes and offset">

Arrays, model weights, sky images, brain scans, weather grids, particle physics trees and a test
bench's channels open as what they hold, read on your machine — no Python, no notebook to set up
first. Which reader a file needs, its first bytes decide.

## Arrays and model weights

| File                           | Opens as                                                                                    |
|--------------------------------|---------------------------------------------------------------------------------------------|
| NumPy `npy`                    | its elements as rows, a page at a time at any size; a picture first when it is one          |
| NumPy `npz`                    | a folder of its arrays, each opening as an `npy`                                            |
| `safetensors`                  | a table of its metadata and tensors: name, type, shape, elements, bytes and offset          |
| llama.cpp's `gguf`             | the same table: the model's settings, then every tensor, quantized ones named by their type |
| MATLAB `mat` (version 4 and 5) | a sheet a variable: numbers, text, sparse matrices, cells and structs                       |
| Matrix Market `mtx`            | a row per entry — row, column, value — or the dense grid                                    |

A 2-D NumPy array is a row per row and a column per column; a structured one, a column per field. An
array shaped like a picture — height × width × 1, 3 or 4 bytes — opens as that picture, its rows
next. An `npy` also opens in a [notebook](/analyze/notebook), for SQL over its elements.

A `safetensors` or `gguf` file is read only as far as its header: the weights are never loaded, so a
model of many gigabytes opens at once. A shard of a split model says which one it is — "2 of 5". A
long metadata list, like a tokenizer's vocabulary, shows its count and first values.

A MATLAB 7.3 file is HDF5 underneath and is not read as a `mat`; it says so.

## Images and volumes

| File                            | Opens as                                                                      |
|---------------------------------|-------------------------------------------------------------------------------|
| FITS `fits` `fit` `fts`         | its first image, with the header cards beside it; every part (HDU) as a sheet |
| NIfTI `nii` `nii.gz`            | the scan, slice by slice; the voxels and the header as tables                 |
| NRRD `nrrd` `nhdr`              | the same, the data read from the file the header names beside it              |
| Zarr `zarr` (version 2, zipped) | the array, slice by slice                                                     |
| GRIB `grib` `grb` `grib2`       | its first parameter, longitude by latitude, a slice for each of its fields    |

A volume opens on its middle slice. **Axial**, **Coronal** and **Sagittal** pick the plane, and a
slider steps through each further axis — the slice, then the time. `←` `→` step a slice, `↑` `↓` the
time, `PageUp` `PageDown` a tenth of the way, `Home` `End` the first and the last. Every slice uses
the same grey range, so two slices compare.

DICOM scans and other brain volumes (Analyze, MINC, FreeSurfer) open the same way — see
[medical](/formats/medical) — and so do microscope stacks — see [lab](/formats/lab#microscopy).

A FITS file is a series of header-and-data units (HDUs); a table among them — binary or ASCII — is a
sheet with a column per field. GRIB editions 1 and 2 are read, simple packing and JPEG 2000 among
their encodings; the file's other messages are listed in its facts.

## Physics, astronomy and earth science tables

| File                                    | Its tables                                 |
|-----------------------------------------|--------------------------------------------|
| CERN's ROOT `root`                      | a tree each, a column a branch             |
| HDF4 `hdf` `h4` `hdf4` `he4`            | its datasets and its Vdata tables, by name |
| an astronomer's VOTable `vot` `votable` | its one table, typed as the file declares  |

A file of one table opens straight on its **Table**; a file of several opens as their list, as an
[SQLite file](/formats/databases) does, and a double click opens one. The
[notebook](/analyze/notebook) queries a table by its name after the file's path: `SELECT * FROM
'run/events.root/events'`.

ROOT (the particle physics framework of CERN, the European laboratory) keeps its data in trees: a
tree's flat branches are read, compressed with zlib, LZ4, XZ or Zstandard; RNTuple, the newer
layout, is not. HDF4 (Hierarchical Data Format 4) is what NASA's earth-observation files of the
1990s and 2000s are written in; its data compressed with Huffman, SZIP or n-bit coding, or kept in
a file beside it, is not read.

HDF5 and NetCDF files open in a notebook, a row for each dataset — see [HDF5 and
NetCDF](/formats/tabular#hdf5-and-netcdf).

## Measurements and logs

| File                                                   | A table for each                                  |
|--------------------------------------------------------|---------------------------------------------------|
| LabVIEW's TDMS `tdms`                                  | group: a column a channel                         |
| ASAM MDF 4 `mf4` and 3 `mdf`, a car's measurement file | channel group: the time, then a column a channel  |
| a CAN bus log, Vector's binary `blf` or text `asc`     | bus (`CAN 1` …): a row a message, its data in hex |
| SEG-Y seismic traces `sgy` `segy`                      | `traces`, `samples` and `text`                    |

A file of several tables opens as their list, one of a single table straight on its **Table**. A
long file is read a batch at a time, not all at once, and a 64-bit integer keeps all its digits.

TDMS (Technical Data Management Streaming) is what LabVIEW test benches write; MDF (Measurement Data
Format) is the car industry's, set by ASAM (the Association for Standardisation of Automation and
Measuring Systems); a CAN (Controller Area Network) log holds the messages a vehicle's bus carried.
A text `.asc` is told from an OpenPGP armoured key by its first lines. SEG-Y's text header is read
whether it is EBCDIC (IBM's old character set) or ASCII.

The recordings of medicine — EEG (the brain's), ECG (the heart's), sleep — are
[medical](/formats/medical#recordings) and are drawn as their signals.

Next: [lab and life science](/formats/lab).
