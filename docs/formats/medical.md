# Medical and health

DICOM `dcm` `dicom` and a scan CD's `DICOMDIR`, brain volumes `hdr` `img` `mnc` `mgh` `mgz`,
recordings `edf` `bdf` `hea`, messages `hl7` `x12` `edi` `837` `835` `astm`, records `fhir` `cda`
`ccd` `ccda`, a Garmin `fit`, an Apple Health export, and clinical trial data `odm`

<img src="/screenshot/format-medical.png" alt="An ECG record from PhysioNet drawn in the signal view: two leads, MLII and V5, over ten seconds, each beat's annotation marked across them">

Scans, recordings and health records open as what they hold: the picture, the trace, the page. No
viewer from the scanner's maker, no Python. Most of them are also a table, or a list of tables, that
you query with [SQL](/analyze/sql).

Which kind a file is, its bytes decide, not its name: a slice named `IM0001`, an HL7 message in a
`.txt`, an ECG (a heart's electrical trace) in a plain `.xml` all open as themselves.

## DICOM

DICOM (Digital Imaging and Communications in Medicine) is the format every scanner writes. A DICOM
file opens as its picture, with a card of what it says of itself beside it: the modality, the study,
the patient, the size.

<img src="/screenshot/format-dicom.png" alt="A CT slice of a spine opened from a DICOM file, its facts card beside it: modality CT, the study date, the manufacturer, 128 × 128">

A file of many frames, or a slice whose folder holds the rest of its series, opens as a volume: the
slices of the series in the order they lie in the body, on the middle one. The same keys as a
[volume's](/formats/science#images-and-volumes) step through them, and **Axial**, **Coronal** and
**Sagittal** cut it the other ways. Only the slice's own folder is looked in.

The row over the slider picks the window, the range of values shown from black to white: the windows
the file names, and on a CT (computed tomography) scan the usual **Brain**, **Soft tissue**,
**Lung** and **Bone**. Its level and width are written beside them. Drag over the picture to move
it: across makes it wider or narrower, up and down raise and lower its level.

What a DICOM file holds besides a picture opens as that:

| The file holds           | It opens as                                                     |
|--------------------------|-----------------------------------------------------------------|
| a structured report      | its page: the title, who and when, then its findings as written |
| an encapsulated PDF      | the PDF's pages, in the [PDF reader](/formats/pdf)              |
| an ECG or other waveform | its leads drawn, as a [recording](#recordings) is               |
| a plan, or nothing drawn | its elements' table                                             |

The **Table** of any DICOM file is every element: its tag, its keyword, its type, its length, its
value and the dictionary's name for it. **Structure** lays out the same elements where they lie in
the file.

A scan CD's `DICOMDIR` opens as a folder a patient, inside it a study, inside that a series, each
file opening as the slice it is. Its **Table** is a row a file, under its patient, study and series.

Pictures stored plain, run-length encoded, as JPEG (baseline, extended, lossless and JPEG-LS) or as
JPEG 2000 are decoded. High-Throughput JPEG 2000, JPEG XL and frames stored as video (MPEG-2,
MPEG-4, HEVC or H.265) are not, and the file says so. A colour series is shown a file at a time, not
as a volume.

## Brain volumes

Analyze 7.5 (an `.hdr` with its `.img` beside it), MINC 1 and 2 (`.mnc`, the Montreal Neurological
Institute's format) and FreeSurfer's `.mgh` and `.mgz` open as the brain they hold, slice by slice,
the same way as a [NIfTI](/formats/science#images-and-volumes) file: the middle axial slice first,
**Axial**, **Coronal** and **Sagittal** to change the plane, and a card of the scan's facts. An
`.hdr` that is a Radiance picture opens as one; the bytes tell them apart. The **Table** holds the
voxels and the header.

## Recordings

| File                                                                 | What it records                                              |
|----------------------------------------------------------------------|--------------------------------------------------------------|
| European Data Format, EDF and EDF+ `edf`, BioSemi's BDF `bdf`        | EEG (brain waves), sleep and other signals, with annotations |
| PhysioNet's WaveForm DataBase (WFDB): a `.hea` header, `.dat` `.atr` | ECG and other signals, with beat annotations                 |
| HL7 annotated ECG (aECG), an `.xml`                                  | a 12-lead ECG, its rhythm and its median beat                |
| a DICOM waveform                                                     | an ECG kept in a DICOM file                                  |

A recording opens drawn in **Signals**: a lane a channel, named with its unit, over a window of its
time, the ruler under them and the annotations marked across. An ECG is drawn on its paper's
squares.

The bar picks the window's length — **1 s** to **5 min**, or **All** — and **−** and **+** zoom. The
slider moves the window. `←` `→` move it a tenth, `PageUp` `PageDown` a whole window, `Home` `End`
go to the start and the end, and the wheel moves it (with `⌘` or `Ctrl`, it zooms). A file of
several sample rates, or an aECG's rhythm and median beat, has a choice of them on the bar. A long
recording draws as fast as a short one: only the window shown is read.

A WFDB record opens from its `.hea`, or from the `.dat` or `.atr` beside it. Its **Table** is a
table a sample rate (`256 Hz`: the time, then a column a channel), then `annotations` and
`channels`; the notebook queries them. A file of annotations alone has nothing to draw, says so, and
shows them on its **Table**.

## Messages between hospital systems

| File                                                                       | A table for each                              |
|----------------------------------------------------------------------------|-----------------------------------------------|
| HL7 (Health Level Seven) version 2 `hl7`                                   | segment type: MSH, PID, OBX …                 |
| X12, the claims and remittances insurers exchange, `x12` `edi` `837` `835` | segment id: ISA, CLM, NM1 …                   |
| ASTM E1394 (the American standard lab instruments report in) `astm`        | record type: Header, Patient, Order, Result … |

A message file opens as the list of its tables, as an [SQLite file](/formats/databases) does. A
double click opens one on its **Table**, a row a segment or record, and its notebook queries it by
its name after the file's path: `SELECT * FROM 'lab/results.hl7/OBX'`. An HL7 table's columns are
named as version 2.5.1 names its fields (`patient_name`, `date_time_of_birth`), and a value keeps
its components as written (`EVERYMAN^ADAM`). An HL7 file's **Structure** is its messages, each with
its segments and their titles.

These files often come as `.txt` or `.log`: they open as themselves all the same.

## Health records

A FHIR (Fast Healthcare Interoperability Resources) file, release 4 or 5, in JSON or XML — one
resource or a Bundle of them — opens as a page: a chapter a resource, its narrative as written, its
fields a table where it has none. The contents beside it list the resources. Its tables are next,
one a resource type (`Patient`, `Observation` …), a column a field's path; a JSON file's JSON laid
out after them.

A clinical document — CDA (Clinical Document Architecture) release 2: a C-CDA (Consolidated CDA) or
a CCD (Continuity of Care Document) — opens as its page: its header (patient, author, codes) as a
table, then a chapter a section with its narrative. Its tables are `document`, `sections` and
`entries`.

Both are told by what is inside, so an `.xml` or a `.json` opens as one when it is one.

## Health and fitness data

A Garmin FIT (Flexible and Interoperable Data Transfer) activity, `.fit`, opens on its track, drawn
as a [map](/formats/maps). Its message types are its tables next — `record`, `lap`, `session` … — a
column a field, the positions and times as the device wrote them. A FITS sky image (astronomy's
Flexible Image Transport System) named `.fit` stays a FITS image.

An Apple Health export (the `export.xml` in the zip the Health app writes) opens as the list of its
tables, a kind of element each, in the order they first come: `ExportDate`, `Me`, `Record` … Its
**Table** opens on the one of the most rows.

Clinical trial data in the formats of CDISC (the Clinical Data Interchange Standards Consortium): an
ODM (Operational Data Model) file, Dataset-XML or Define-XML is a table an item group, a column an
item; a Dataset-JSON file is its one table.

Next: [records and finance](/formats/records).
