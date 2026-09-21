# The tree and the list

<img src="/screenshot/tree-providers.png" alt="The tree with local and cloud roots, and a folder listing beside it">

The sidebar holds every [root](/storage/connect) you added — local folders and cloud buckets in one
tree, in the order you added them. The pane beside it lists whatever is selected.

## The columns

| Column       | What it says                                                                                                                                                |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Name**     | with the icon of the format, not of the extension                                                                                                           |
| **Size**     | the object's size; a folder shows Σ until its size has been walked                                                                                          |
| **On disk**  | how much of it is on this machine: a cloud object's [cached](/explore/cache) copy, or a [streaming folder](/storage/local#streaming-folders)'s placeholder  |
| **Modified** | the provider's own timestamp                                                                                                                                |
| **Cost/mo**  | what keeping this object at its storage class costs per month, for cloud rows                                                                               |
| **Class**    | the storage class, when the folder holds more than one                                                                                                      |
| **Note**     | the one thing worth knowing about the bill: a retention hold, days left of a minimum storage duration, or a small object billed at the class's minimum size |
| **Activity** | a sparkline of how this object's size has moved over the visits the app remembers                                                                           |

A column with nothing to say in this folder is left out: a local folder has no cost, class or note,
and an ordinary one no **On disk**.

Every listed object also carries a record of its own — first seen, how many times it was opened, its
storage class — which the info button shows.

## The grid

<img src="/screenshot/story-image-grid.png" alt="A folder of images in the grid view, every tile a thumbnail of the picture">

The **Grid** icon in the toolbar, beside the list icon, shows a folder as tiles instead of rows.
Each tile is a preview of what the object is:

| Object                        | Its tile                               |
|-------------------------------|----------------------------------------|
| an image                      | the picture                            |
| a video                       | its first frame                        |
| a PDF                         | its first page                         |
| a table                       | its first rows                         |
| a text file                   | its first lines                        |
| a drawing, a diagram, a model | a small render of the view it opens in |
| anything else                 | the icon of its format                 |

Tiles come in five sizes, 64 to 256 pixels; the magnifier icons step between them, and so do
`⇧⌘+` and `⇧⌘−`. Two arrows sort by name, up or down.

Drag a tile to put it where you want it. That layout is kept for the folder, until you sort it
again. `F2` renames and `⌘Z` undoes, as in the list, and `Esc` clears the selection.

## Reading a folder again

Cloud listings are cached for eight hours, so stepping back into a prefix you were just in does not
pay for another listing. The refresh button asks the provider again, past that cache: the pane goes
blank while the request is out, so the answer on screen is visibly the answer to the click rather
than what was already there.

## Hidden and deleted rows

Two toggles decide what the list shows beyond the obvious:

- **Hidden** — dot-files and the folders a platform hides.
- **Deleted** — a name this folder had before and does not have now. Nothing is marked deleted until
  a folder that knew the name lists it again without it, so the mark means "it went", not "it was
  never here".

## Keyboard

Arrow keys walk every row; **→** enters a folder and **←** steps out; **Enter** opens what is
selected. The full list is on [keyboard shortcuts](/reference/shortcuts).

Next: [where the storage went](/explore/usage).
