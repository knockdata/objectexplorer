# Moving around a view

Every view that shows something in three dimensions moves the same way:

- a model: `glb` `gltf` `fbx` `blend` `obj`, or a Unity asset
- a CAD part: `step` `sldprt` `catpart`
- a shader drawn on a shape
- [the usage disc](/explore/usage), where a click picks a pole or one of the objects on it

Drag to look around, hold Shift to pan, use the wheel to zoom, and double-click to start over.

## With the mouse

| Input                                   | What it does                                           |
|-----------------------------------------|--------------------------------------------------------|
| Drag                                    | rotate around the object                               |
| Shift-drag, right-drag, middle-drag     | pan: slide the object across the view                  |
| Wheel, or scroll or pinch on a trackpad | zoom in or out on the point under the pointer          |
| Double-click                            | reset: back to the angle, size and place it opened at  |
| Click without moving                    | pick what is under the pointer; a model marks the face |

Panning moves the camera, never the object. ObjectExplorer only reads the file and never changes it.

## With the keyboard

The keys work once the view has focus: click it, or press `Tab` until the content pane has focus.
While the tree has focus, the arrow keys move through the tree instead.

| Key             | What it does                                                     |
|-----------------|------------------------------------------------------------------|
| `←` `→` `↑` `↓` | rotate, the same as dragging that way                            |
| `⇧` + arrow     | pan                                                              |
| `1`             | look straight at the front                                       |
| `3`             | look straight at the right side                                  |
| `7`             | look straight down at the top                                    |
| `9`             | look from the opposite side: back, left or bottom                |
| `0`             | isometric: the front, the right side and the top at equal slants |
| `F`             | fit: keep the angle, bring the whole object back to view         |
| `R`             | reset, the same as a double-click                                |

`9` turns to the side opposite the one you are looking at: after `1` it shows the back, after `3`
the left side, after `7` the bottom. The number keys follow Blender's numpad, and the row above the
letters works as well as the numpad. A number key changes only the angle, so the zoom and the pan
stay where they are.

## Which way is up

The view turns a part like a turntable, around the vertical. File formats disagree about which axis
is vertical, so each file is stood up the way the program that wrote it meant:

| File                      | Up                                   |
|---------------------------|--------------------------------------|
| `glb` `gltf` `obj`, Unity | Y                                    |
| `fbx`                     | whatever the file says, usually Y    |
| `blend` `catpart`         | Z                                    |
| `sldprt`                  | Y                                    |
| `step`                    | the program that wrote it, see below |

A STEP file has no up of its own. It keeps the axes of the program that exported it, and names
that program in its header if the exporter filled that in. The part stands on Z when the header
names CATIA, NX, Solid Edge, FreeCAD, Open CASCADE, Rhino, AutoCAD, SketchUp, Onshape or KiCad.
Otherwise it stands on Y, as in SolidWorks, Creo and Inventor.

Front, right and top follow the same rule. For a Z-up part, the front is the side you see when you
look along +Y.

## Shaders

A shader drawn on a sphere, cube, plane or torus moves like a model. Double-clicking it also
restarts its clock.

A shader that covers the whole canvas, like a Shadertoy `mainImage`, has no camera to move.
Dragging with the left button moves the pointer the shader reads as `iMouse`, and double-clicking
restarts the clock.

## Flat views

A drawing (`dwg`), a texture (`dds` `ktx2` `hdr` `exr`) and the texture pane beside a model are
flat, so looking around and panning are the same thing:

| Input        | What it does                                  |
|--------------|-----------------------------------------------|
| Drag         | pan                                           |
| Wheel        | zoom in or out on the point under the pointer |
| Double-click | fit the whole picture in the view             |

## Why Shift

On a Mac, Ctrl-click is a right click. On many Linux desktops, Alt-drag moves the whole window.
Shift means nothing to the operating system, so a Shift-drag always reaches the view.

Next: [where your data lives](/reference/data-locations).
