# 3D models

`glb` `gltf` `fbx` `blend` `obj` `mtl` `stl` `ply` `3mf` `usd` `usdz` `dae` `3ds` `x`, and some twenty
older formats

<AppDemo open="folder/demo/model/factory.glb" image="/screenshot/format-model.png" alt="factory.glb in the model view: a low-poly industrial yard, with the model toolbar above it" />

A model opens as the model: its meshes, its materials and its textures, drawn in place. No Blender,
no 3D engine and no importer — the file is read as it is, the way the program that wrote it wrote
it.

| Kind                   | Files                                                                                                                                                                         |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| today's formats        | glTF `glb` `gltf`, FBX (binary and text), Blender `blend` and its backups `blend1` …                                                                                          |
| printing and scanning  | `obj` with its `mtl`, `stl`, `ply`, `3mf`                                                                                                                                     |
| Pixar's USD            | `usd` `usda` `usdc` `usdz`, with the layers it names beside it                                                                                                                |
| older exchange formats | COLLADA `dae`, 3ds Max `3ds` `ase`, DirectX `x`, LightWave `lwo` `lws`, modo `lxo`, AC3D `ac`, `amf`, `nff`, `xgl`, Caligari `cob`, Blitz3D `b3d`, Quick3D `q3o` `q3s`, `m3d` |
| more older formats     | MilkShape `ms3d`, Quake `md2`, Half-Life `mdl`, `mdc`, Unreal `3d`, Irrlicht `irr` `irrmesh`, `iqm`, terrains `ter` `hmp`                                                     |

## The toolbar

| Control          | What it does                                                                                                                       |
|------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Texture**      | the images the model is painted with, on or off                                                                                    |
| the shading list | Lit, Normal, UV, Checker, Depth, Wireframe or Vertex Colour                                                                        |
| **Box**          | the bounding box, with its size                                                                                                    |
| **Stats**        | vertices, triangles, faces, pieces and draw calls, nodes, meshes, materials, textures, bones, clips, and an estimate of GPU memory |
| **Skeleton**     | a rigged model's bones                                                                                                             |
| **Inspect**      | a menu of what shows how the model is made: **Pick a Face**, **Vertex**, **Vertex Normal**, **Pipeline** and **Material**          |
| **Reset View**   | back to the angle and distance it opened at                                                                                        |

With **Pick a Face** on, a click on a face numbers its corners the way the file numbers them.
**Vertex** puts a dot on every corner, **Vertex Normal** a short line where each one faces, and
**Material** a card of each material's colours and textures.

**Pipeline** draws the view's own shader as a [shader diagram](/formats/shaders). Click a variable
of the fragment shader and the model switches to the shading that shows it; click it again to go
back to lit.

## Animation

A file that carries clips gets a player: play, the clip, the time, and **Rest**, which puts the
model back in the pose it was bound in. A file with clips and no mesh — an animation on its own —
plays them on its skeleton.

Skeletons play from glTF, FBX, COLLADA, 3ds, DirectX, LightWave scenes, MilkShape, Half-Life, IQM,
Blitz3D and ASE files. The frame-by-frame animations of Quake, Return to Castle Wolfenstein and
Unreal models play too, each run of frames as a clip of its own — `stand01` to `stand40` is `stand`.

## Wavefront obj

An `obj` opens as its model when it has a face to draw, and as its text otherwise. An obj carries no
unit, so its size is given in the file's own numbers, and the line above it counts the `v` lines as
well as the faces and triangles.

The `mtl` it names opens as a card for each material: its colours as swatches with their numbers,
its shininess, opacity and lighting model, and each image a `map_` line names drawn small beside it
— or "not found". Its text is a click away.

## Moving around

Drag to rotate, hold Shift to pan, use the wheel to zoom, and double-click to start
over. The arrow keys turn it, `1` `3` `7` look from the front, the side and the top, `F` fits and
`R` resets. Every control is on [moving around a view](/reference/view-controls).

Next: [textures](/formats/textures).
