# Sprite sheets

<AppDemo open="folder/demo/sprite/medievalRTS_spritesheet@2.xml" image="/screenshot/sprite-sheet.png" alt="A texture atlas with every sprite's bounding box overlaid and named" />

Open the XML of a texture atlas — its root a `TextureAtlas`, a `SpriteSheet`, `Sprites` or an
`ImageMap` — and ObjectExplorer draws it: the sheet it names at its own size, with a shaded box over
every sprite, aligned to the real pixels. A sheet larger than the pane scrolls.

Hover a box and it clears to show the sprite under it, with its name — no importing the sheet into
an engine to find out which tile is `medievalTile_04`.

An `.xml` is told for an atlas by its first lines, not its name. Any other opens as its text, or as
its diagram when it holds a draw.io one.

Next: [CAD](/formats/cad).
