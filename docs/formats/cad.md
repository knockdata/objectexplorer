# CAD

`step` `stp` `sldprt` `sldasm` `slddrw` `catpart` `dwg` `dxf`, and NX `prt`, Creo, Inventor `ipt`
`iam` and `jt` files browsed

<AppDemo open="folder/demo/cad/nist_ftc_11_asme1_rb.stp" image="/screenshot/format-cad.png" alt="A STEP part drawn in the CAD view, with its face count and size above it" />

A CAD part opens as the part, not as the text or the zip it is stored in. No CAD program is needed,
and nothing is converted first: the file is read on your machine, like every other one.

## Parts

| Format                  | What is drawn                                                      |
|-------------------------|--------------------------------------------------------------------|
| **STEP** `step` `stp`   | the solid, tessellated from its B-rep surfaces                     |
| **SolidWorks** `sldprt` | the display mesh SolidWorks cached inside the file, 2015 and later |
| **CATIA V5** `catpart`  | the display mesh CATIA cached inside the file                      |

The line above the view says what you are looking at: how many faces, how many triangles, and how
big the part is — in millimetres, or in metres once it is two metres or more.

Which way is up comes from the file. A STEP file written by CATIA, NX, Solid Edge, FreeCAD, Rhino,
AutoCAD, SketchUp, Onshape or KiCad is Z-up, and so is a CATIA part; the rest are Y-up.

A STEP face that sits on a NURBS surface is left out, and a STEP file with nothing the reader can
tessellate says so, its **text** a click away. A SolidWorks file from 2014 or before is not drawn;
it opens on the preview picture it keeps.

## Moving around

Drag to rotate, hold Shift to pan, use the wheel to zoom, and double-click to start
over. The number keys look from the front, the side and the top. Every control is on
[moving around a view](/reference/view-controls).

## Drawings

<img src="/screenshot/format-dwg.png" alt="An AutoCAD DWG drawing: lines, arcs and text on a dark sheet">

A **DWG** opens as the drawing: its lines, arcs, circles, ellipses, polylines, splines, hatches,
text and dimensions, flat, on one sheet, with blocks placed where they are inserted and layers that
are off left out. Drag to pan, use the wheel to zoom on the pointer, and double-click to fit the
whole sheet again. The line above it counts the entities and the layers, names the four commonest
kinds of entity, and gives the drawing's span in its own units.

Every DWG from R13 to the 2018 format is read — R13, R14, R2000, R2004, R2007, R2010, R2013 and
R2018 — which covers what drawings are saved as today. A file from before R13 says so, and shows
its header. A drawing that carries a preview picture shows it in **image** mode too.

A **DXF**, ASCII or binary, from R12 to 2018, is drawn the same way.

## Inside the file

A SolidWorks file is a zip in disguise, a CATIA part is a container of streams, and a DWG is a set of
sections. Each can be [browsed as a folder](/explore/archives): step into it from the list and every
stream is an entry you can open one at a time, in [hex](/explore/hex) if nothing else reads it.

A SolidWorks assembly (`sldasm`) or drawing (`slddrw`) holds no display mesh of its own. The view
says so, and the streams it is made of are one click away.

Siemens NX (`prt`), Creo, Inventor (`ipt` `iam` `idw` `ipn`) and JT (`jt`) files are not drawn yet.
They open as a folder of their streams or sections, and a preview picture among them — an NX or Creo
thumbnail — opens as a picture.

**Structure** mode on a DWG shows the byte layout of its sections.

Next: [3D models](/formats/models).
