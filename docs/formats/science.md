# Science and machine learning

`npy` `npz` `safetensors` `gguf` `fits` `mat` `nii` `nrrd` `zarr` `grib` `mtx`, and genomics:
`fasta` `fastq` `bed` `gff3` `gtf` `vcf` `sam` `bam`

<img src="/screenshot/format-science.png" alt="A GGUF model opened as a table: its metadata first, then every tensor with its type, shape, element count, bytes and offset">

Arrays, model weights, sky images, brain scans, weather grids and sequencing reads open as what they
hold, read on your machine — no Python, no notebook to set up first. Which reader a file needs, its
first bytes decide.

## Arrays and model weights

| File                           | Opens as                                                                                    |
|--------------------------------|---------------------------------------------------------------------------------------------|
| NumPy `npy`                    | its elements as rows, a page at a time at any size; a picture first when it is one          |
| NumPy `npz`                    | a folder of its arrays, each opening as an `npy`                                            |
| `safetensors`                  | a table of its metadata and tensors: name, type, shape, elements, bytes and offset          |
| llama.cpp's `gguf`             | the same table: the model's settings, then every tensor, quantized ones named by their type |
| MATLAB `mat` (version 4 and 5) | a sheet a variable: numbers, text, sparse matrices, cells and structs                       |
| Matrix Market `mtx`            | a row per entry — row, column, value — or the dense grid                                    |

A 2-D NumPy array is a row per row and a column per column; a structured one, a column per field.
An array shaped like a picture — height × width × 1, 3 or 4 bytes — opens as that picture, its
rows next. An `npy` also opens in a [notebook](/analyze/notebook), for SQL over its elements.

A `safetensors` or `gguf` file is read only as far as its header: the weights are never loaded, so
a model of many gigabytes opens at once. A shard of a split model says which one it is — "2 of 5".
A long metadata list, like a tokenizer's vocabulary, shows its count and first values.

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
slider steps through each further axis — the slice, then the time. `←` `→` step a slice, `↑` `↓`
the time, `PageUp` `PageDown` a tenth of the way, `Home` `End` the first and the last. Every slice
uses the same grey range, so two slices compare.

A FITS file is a series of header-and-data units (HDUs); a table among them — binary or ASCII — is
a sheet with a column per field. GRIB editions 1 and 2 are read, simple packing and JPEG 2000 among
their encodings; the file's other messages are listed in its facts.

## Genomics

Every one of these opens as a table, a row per record, its text a click away:

| File                            | A row for each, with                                       |
|---------------------------------|------------------------------------------------------------|
| FASTA `fasta` `fa` `fna` `faa`  | sequence: identifier, description, length, sequence        |
| FASTQ `fastq` `fq`              | read, with its quality and the mean quality                |
| BED `bed`                       | region, in UCSC's column names, BED3 to BED12              |
| GFF3 and GTF `gff3` `gff` `gtf` | feature: the nine columns, and a column for each attribute |
| VCF `vcf`                       | variant: the `#CHROM` columns and one per sample           |
| SAM `sam`, BAM `bam`            | alignment: the eleven fields and a column per optional tag |

A record that is broken still shows as a row, with a last column saying what is wrong. A BAM's
**structure** mode lays out its header, references and compressed blocks. A `.vcf` that is a
contact card opens as one — see [records and trees](/formats/tabular#records-and-trees).

HDF5 and NetCDF files open in a notebook, a row for each dataset — see
[HDF5 and NetCDF](/formats/tabular#hdf5-and-netcdf).

Next: [databases](/formats/databases).
