# CAD

`step` `stp` `sldprt` `sldasm` `slddrw` `catpart` `dwg`

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

A STEP file with nothing the reader can tessellate says so, and its **text** is a click away.

## Moving around

Drag to rotate, hold Shift to pan, use the wheel to zoom, and double-click to start
over. The number keys look from the front, the side and the top. Every control is on
[moving around a view](/reference/view-controls).

## Drawings

<img src="/screenshot/format-dwg.png" alt="An AutoCAD DWG drawing: lines, arcs and text on a dark sheet">

A **DWG** opens as the drawing: its lines, arcs, circles, polylines, splines, hatches, text and
dimensions, flat, on one sheet, with blocks placed where they are inserted.
Drag to pan, use the wheel to zoom on the pointer, and double-click to fit the whole sheet again.
The line above it counts the entities and the layers, names the four commonest kinds of entity, and
gives the drawing's span in its own units.

The DWG versions R2004, R2010, R2013 and R2018 are read — what most drawings are saved as today. An
R2007 file, or one from R2000 and before, says so rather than drawing half of it.

## Inside the file

A SolidWorks file is a zip in disguise, a CATIA part is a container of streams, and a DWG is a set of
sections. Each can be [browsed as a folder](/explore/archives): step into it from the list and every
stream is an entry you can open one at a time, in [hex](/explore/hex) if nothing else reads it.

A SolidWorks assembly (`sldasm`) or drawing (`slddrw`) holds no display mesh of its own. The view
says so, and the streams it is made of are one click away.

**Structure** mode on a DWG shows the byte layout of its sections.

Next: [3D models](/formats/models).
