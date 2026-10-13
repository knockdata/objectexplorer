# 3D models

`glb` `gltf` `fbx` `blend` `obj` `mtl`, and Unity's `unity` `prefab` `asset` `mesh` `mat` `anim`
`controller`

<AppDemo open="folder/demo/model/factory.glb" image="/screenshot/format-model.png" alt="factory.glb in the model view: a low-poly industrial yard, with the model toolbar above it" />

A model opens as the model: its meshes, its materials and its textures, drawn in place. No Blender,
no game engine and no importer — the file is read as it is, the way the program that wrote it wrote
it.

## The toolbar

| Control           | What it does                                                                                                                       |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **inspect**       | click a face to see which face it is, with its corners numbered                                                                    |
| **vertex**        | show every vertex                                                                                                                  |
| **vertex normal** | show the normal each vertex carries                                                                                                |
| **texture**       | the images the model is painted with, on or off                                                                                    |
| the shading list  | lit, normal, uv, checker, depth, wireframe or vertex colour                                                                        |
| **box**           | the bounding box                                                                                                                   |
| **stats**         | vertices, triangles, faces, pieces and draw calls, nodes, meshes, materials, textures, bones, clips, and an estimate of GPU memory |
| **pipeline**      | the view's own shader, drawn as a [shader diagram](/formats/shaders)                                                               |
| **material**      | a card of the picked face's material                                                                                               |
| **skeleton**      | a rigged model's bones                                                                                                             |

A click on a face numbers its corners the way the file numbers them.

In the **pipeline** sketch, click a variable of the fragment shader and the model switches to the
shading that shows it; click it again to go back to lit.

## Animation

A file that carries clips gets a player: play, the clip, the time, and **rest**, which puts the
model back in the pose it was bound in. A file with clips and no mesh — an animation on its own —
plays them on its skeleton.

## Wavefront obj

An `obj` opens as its model when it has a face to draw, and as its text otherwise. An obj carries no
unit, so its size is given in the file's own numbers, and the line above it counts the `v` lines as
well as the faces and triangles.

The `mtl` it names opens as a card for each material: its colours as swatches with their numbers,
its shininess, opacity and lighting model, and each image a `map_` line names drawn small beside it
— or "not found". Its text is a click away.

## Unity

A Unity text asset opens as its model where it has one, with its objects as a table and its text a
click away. A `.asset` or `.mesh` that holds a mesh is drawn as it. A prefab names its model in
another file of the project, by that file's guid, so the view looks for it through the `.meta` files
beside the prefab. When that file is not there, it says so, and **structure** mode shows everything
the prefab does say.

## Moving around

Drag to rotate, hold Shift to pan, use the wheel to zoom, and double-click to start
over. The arrow keys turn it, `1` `3` `7` look from the front, the side and the top, `F` fits and
`R` resets. Every control is on [moving around a view](/reference/view-controls).

Next: [textures](/formats/textures).
