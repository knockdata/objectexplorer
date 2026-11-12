# The Photos library

The Mac's Photos library as a place in the tree, by year and by album, so a picture can be found,
opened and compared like any file. Read only: nothing in the library is ever changed.

**+** in the side bar's header, **Add a location**, offers **Photos Library** on a Mac, under
**Local Folder…**. The first time, macOS asks whether ObjectExplorer may see your photos; refused,
before or then, **System Settings → Privacy & Security → Photos** opens, where it is allowed, and
the tree says why it is empty.

## What it holds

| Folder             | What is in it                                                         |
|--------------------|-----------------------------------------------------------------------|
| **Years**          | a folder a year, newest first                                         |
| **Years/2024**     | that year's pictures, oldest first, each named as the camera named it |
| **Albums**         | your own albums, by their titles                                      |
| **Albums/Holiday** | an album's pictures                                                   |

A picture opens as any picture does — see [images](/formats/images). One whose original is only in
iCloud shows the small picture Photos keeps on this Mac in the grid, but cannot be opened: it is
never downloaded. Copying, moving, renaming and deleting are refused.

The browser page `objectexplorer` serves from a terminal on a Mac offers it too, when the page comes
from that Mac.

## Duplicate pictures

Right-click any folder — the library, a folder on your disk, a bucket — and pick **Find Duplicate
Pictures**. Every picture under it is read once: the same file kept twice is found, and so is the
same picture saved smaller, recompressed or saved again. The **Duplicate Pictures** panel lists
each group, and a click opens a picture. A picture in a year and in an album counts once, and one
only in iCloud is compared by its small picture, never downloaded. Nothing is changed or removed.

Next: [Google Drive](/storage/gdrive).
