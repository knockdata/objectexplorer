# Lab and life science

Genomics `fasta` `fastq` `bed` `gff3` `gtf` `vcf` `bcf` `sam` `bam` `cram`, lab files `gb` `gbk`
`embl` `fcs` `ab1` `dna` `bigwig` `bigbed`, microscopy `ome.tif` `czi` `nd2` `lif`, mass spectra
`mzml`, and molecules `pdb` `ent` `cif` `mmcif` `mol` `sdf` `mol2` `xyz`

<img src="/screenshot/format-lab.png" alt="Crambin, a small protein from the Protein Data Bank, drawn ball and stick: carbon grey, oxygen red, nitrogen blue, sulphur yellow; 327 atoms and 337 bonds counted over it">

Sequences, traces, cell counts, microscope stacks and molecules open as what they hold, read on your
machine: no Python, no plug-in. Which reader a file needs, its first bytes decide.

## Genomics

Every one of these opens as a table, a row per record, its text a click away:

| File                                 | A row for each, with                                       |
|--------------------------------------|------------------------------------------------------------|
| FASTA `fasta` `fa` `fna` `faa`       | sequence: identifier, description, length, sequence        |
| FASTQ `fastq` `fq`                   | read, with its quality and the mean quality                |
| BED `bed`                            | region, in UCSC's column names, BED3 to BED12              |
| GFF3 and GTF `gff3` `gff` `gtf`      | feature: the nine columns, and a column for each attribute |
| VCF `vcf`, and BCF, its binary `bcf` | variant: the `#CHROM` columns and one per sample           |
| SAM `sam`, BAM `bam`, CRAM `cram`    | alignment: the eleven fields and a column per optional tag |

VCF is the Variant Call Format, SAM the Sequence Alignment Map (BAM is its binary, CRAM the same
compressed against the reference), GFF the General Feature Format, GTF the Gene Transfer Format and
BED the Browser Extensible Data of UCSC's (the University of California, Santa Cruz's) genome
browser. A record that is broken still shows as a row, with a last column saying what is wrong. A
BAM's or a CRAM's **structure** mode lays out its header, references and compressed blocks. A `.vcf`
that is a contact card opens as one — see [records and trees](/formats/tabular#records-and-trees).

CRAM 3.0 is read. A CRAM compressed with a method of CRAM 3.1 says which; a read whose bases are
kept only as differences from a reference sequence the file does not hold shows `*` for them, and
its problem column names that reference.

## Lab files

GenBank and EMBL (the European Molecular Biology Laboratory) entries, flow cytometry files (FCS, the
Flow Cytometry Standard), Sanger traces in ABIF (Applied Biosystems' Interchange Format), SnapGene's
plasmid maps, and the bigWig and bigBed tracks of UCSC's genome browser are files of several tables:

| File                                            | Its tables                                           |
|-------------------------------------------------|------------------------------------------------------|
| GenBank `gb` `gbk` `genbank` `gbff` `gpff` `gp` | records, features                                    |
| EMBL `embl`                                     | records, features                                    |
| FCS 2.0 to 3.2 `fcs` `lmd`                      | events, parameters, keywords                         |
| Sanger trace `ab1` `abi` `abif` `fsa`           | bases, traces, tags                                  |
| SnapGene `dna`                                  | sequence, features, primers                          |
| bigWig and bigBed `bigwig` `bb` `bigbed`        | intervals or entries, a zoom level each, chromosomes |

A file of these opens as the list of its tables, as an [SQLite file](/formats/databases) does (a
Sanger trace drawn first, below), and its notebook queries one by its name after the file's path:
`SELECT * FROM 'runs/sample.fcs/events'`.

A GenBank or EMBL feature carries its record, its type, its location as written and its first and
last base. A flow cytometry file's events are a column a parameter, by its name (`FSC`, `SSC`, `FL1`
…), as the instrument stored them.

A Sanger trace opens drawn in **Signals**: its four traces a lane each, the bases called at their
places, counted in scans rather than seconds — the first 500 scans, then more with the window's
lengths and the slider, as a [recording](/formats/medical#recordings) is moved.

A bigWig named `.bw`, the name of an SGI (Silicon Graphics) picture, is told by its bytes and opens
as the track it is.

## Microscopy

| File                          | From                                    |
|-------------------------------|-----------------------------------------|
| OME-TIFF `ome.tif` `ome.tiff` | the Open Microscopy Environment's tools |
| CZI (Carl Zeiss Image) `czi`  | Zeiss                                   |
| ND2 `nd2`                     | Nikon                                   |
| LIF (Leica Image File) `lif`  | Leica                                   |

A microscope's stack opens slice by slice, the way a [volume](/formats/science#images-and-volumes)
does, with a card of its facts beside it: its size, its axes, its channels, how far apart its pixels
are. The row over the slider shows **All** the channels together, each in its own colour, or one
alone over its own range. A slider for each further axis is named after it — slice, time, position,
wavelength — and **Axial**, **Coronal** and **Sagittal** appear when the stack has depth. The
**Table** holds its planes, its header and the metadata the microscope wrote.

An OME-TIFF is told from a plain TIFF by the description it carries. A CZI's planes compressed with
JPEG, LZW or JPEG XR are named, not drawn; an ND2 of Nikon's oldest kind, which is a JPEG 2000 file,
opens as that picture.

## Mass spectra

An mzML file, a mass spectrometer's run, opens as its table: a row a spectrum, with its id, its
level, its scan time, its polarity, its kind and its base peak. A file older than mzML 1.0 is
refused, and says so.

## Molecules

| File                                                                    | What is drawn                             |
|-------------------------------------------------------------------------|-------------------------------------------|
| Protein Data Bank (PDB) `pdb` `ent` `brk`, mmCIF `cif` `mmcif` `mcif`   | its first model                           |
| a crystal's CIF (Crystallographic Information File) `cif`               | its unit cell, filled out by its symmetry |
| MDL's molfile `mol`, and a structure-data file (SDF) of them `sdf` `sd` | every record side by side, up to 400      |
| Tripos MOL2 `mol2` `ml2`                                                | every molecule side by side, up to 400    |
| XYZ and extended XYZ `xyz` `extxyz`                                     | its first frame                           |

A molecule opens drawn ball and stick, in 3D: an element a colour, a double or a triple bond two or
three thinner sticks, and the counts of its atoms, bonds and models over it. Drag to turn it,
`Shift`-drag to move it, the wheel to zoom, a double click to reset — the same view as a [3D
model](/formats/models). Bonds the file does not list are found from how close the atoms stand.

Its text is next, then its atoms as a table, a row an atom; an SDF's table is a row a record, with
its name, atoms, bonds, formula and weight, and a column for each data item it carries. A `.pdb`
that is a Palm ebook opens as an [ebook](/formats/ebooks); the bytes tell them apart.

Next: [medical and health](/formats/medical).
