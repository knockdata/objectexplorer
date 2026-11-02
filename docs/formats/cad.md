# CAD

`step` `stp` `igs` `iges` `sldprt` `sldasm` `slddrw` `catpart` `3dm` `ifc` `dwg` `dxf`, and NX `prt`,
Creo, Inventor `ipt` `iam` and `jt` files browsed

<AppDemo open="folder/demo/cad/nist_ftc_11_asme1_rb.stp" image="/screenshot/format-cad.png" alt="A STEP part drawn in the CAD view, with its face count and size above it" />

A CAD part opens as the part, not as the text or the zip it is stored in. No CAD program is needed,
and nothing is converted first: the file is read on your machine, like every other one.

## Parts

| Format                  | What is drawn                                                               |
|-------------------------|-----------------------------------------------------------------------------|
| **STEP** `step` `stp`   | the solid, tessellated from its B-rep surfaces, curved NURBS faces included |
| **IGES** `igs` `iges`   | its surfaces and solids, each a piece, in the colour the file gives it      |
| **SolidWorks** `sldprt` | the display mesh SolidWorks cached inside the file, 2015 and later          |
| **CATIA V5** `catpart`  | the display mesh CATIA cached inside the file                               |
| **Rhino** `3dm`         | the meshes Rhino cached for each object, versions 2 to 8                    |
| **IFC** `ifc`           | a building, each of its products in the file's colours                      |

The line above the view says what you are looking at: how many faces, how many triangles, and how
big the part is — in millimetres, or in metres once it is two metres or more.

Which way is up comes from the file. A STEP file written by CATIA, NX, Solid Edge, FreeCAD, Rhino,
AutoCAD, SketchUp, Onshape or KiCad is Z-up, and so is a CATIA part; the rest are Y-up.

A STEP file with nothing the reader can tessellate says so, its **text** a click away. A SolidWorks
file from 2014 or before is not drawn; it opens on the preview picture it keeps.

## IGES

IGES (the Initial Graphics Exchange Specification) is the older neutral format CAD programs still
write. Its ASCII form, versions 1.0 to 5.3, is read: trimmed and bounded surfaces, B-spline, ruled,
revolved and tabulated surfaces, planes, cylinders, cones, spheres and tori, solids and shells, and
the parts a subfigure places. Curves, points and annotations are not drawn.

The **table** has a row for every entity in the file — its number, type, name, level, colour and
label, and whether it was drawn or why not — with the triangles and the area it was drawn with.
A compressed or binary IGES file says so by name, and opens as its text and its bytes.

## Rhino

A Rhino model (`3dm`) draws what Rhino meshed for its display: a surface's or a polysurface's render
mesh, an extrusion's, a mesh. A file saved "small" keeps no mesh, and opens on its preview picture;
a NURBS surface or a SubD with no mesh cached draws nothing. The **table** lists every object — its
name, layer and kind, and its vertices and triangles — and the **image** mode shows the preview, the
version, the unit and how many objects were drawn. A version 1 file is not read; its chunks show in
**structure**.

## Building models

An IFC file (the Industry Foundation Classes, the exchange format of building design: Revit,
ArchiCAD and the like write it), IFC2X3, IFC4 or IFC4X3, opens as the building, each product drawn
as the program modelled it. Openings are not cut out of the walls they sit in, and spaces and
openings are not drawn.

Each kind of product is a table, named as IFC names it — `IfcWall`, `IfcDoor`, `IfcSlab` — a row a
product: its `GlobalId`, `Name`, `Description`, `ObjectType` and `Tag`, the storey or space that
holds it, and a column for each property of its property sets and its type's:

```sql
SELECT Name, "Pset_WallCommon.IsExternal" FROM 'house.ifc!/IfcWall'
```

Which a file is, its header decides: an IFC file named `.stp` still opens as a building.

## Moving around

Drag to rotate, hold Shift to pan, use the wheel to zoom, and double-click to start
over. The number keys look from the front, the side and the top. Every control is on
[moving around a view](/reference/view-controls).

## Measuring

The ruler in the toolbar — or `M` — measures a part or a drawing: click a face for its area, and a
round one for its radius too, exact on a STEP or IGES part; Shift-click a second for the distance
between them; double-click the body for its volume. In a drawing, a click measures the line, the arc
or the outline under it. Every way to measure is on [measuring](/explore/measure).

## Drawings

<img src="/screenshot/format-dwg.png" alt="An AutoCAD DWG drawing: lines, arcs and text on a dark sheet">

A **DWG** opens as the drawing: its lines, arcs, circles, ellipses, polylines, splines, hatches,
text and dimensions, flat, on one sheet, with blocks placed where they are inserted and layers that
are off left out. It opens fitted to the pane: drag to pan, use the wheel to zoom on the pointer, and
double-click to fit the whole sheet again. The line above it counts the entities and the layers,
names the four commonest kinds of entity, and gives the drawing's span in its own units.

Every DWG from R13 to the 2018 format is read — R13, R14, R2000, R2004, R2007, R2010, R2013 and
R2018 — which covers what drawings are saved as today. A file from before R13 says so, and shows
its header. A drawing that carries a preview picture shows it in **image** mode too.

A **DXF**, ASCII or binary, from R12 to 2018, is drawn the same way. A drawing that stands upright in
one plane — a laser meter's measures of a wall — opens facing you, and **Top** and **Face-on** under
its name switch between the two.

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

Next: [circuit boards and schematics](/formats/circuit-boards).
