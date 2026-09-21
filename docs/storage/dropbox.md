# Dropbox

ObjectExplorer reads Dropbox through the folder the Dropbox app keeps on your disk. Add that folder
as a [local folder](/storage/local) and it is a root like any other: previewed, queried and searched
in place.

There is no Dropbox sign-in inside ObjectExplorer yet, so nothing here holds a Dropbox token and
nothing talks to the Dropbox API — the Dropbox app does that, as it already does for Finder or
Explorer.

## Where the folder is

| System  | Folder                                             |
|---------|----------------------------------------------------|
| macOS   | the `Dropbox…` folder in `~/Library/CloudStorage`  |
| Windows | the folder the Dropbox app registered with Windows |

Pick it with the native folder picker in **Settings → Local folder**.

## Files that are not on this disk

The Dropbox app can keep a file online only, leaving a placeholder that takes no space. The
**On disk** column shows the difference: the bytes a file really holds on this machine, or a cloud
icon when Dropbox is holding them. Click the icon to download that one file.

Opening a placeholder makes Dropbox download the whole file, however little of it a view needs. So a
placeholder of 5 MB or more is not opened silently: the pane says Dropbox is holding it, with a
**Download** button and its size. A smaller one just opens.

See [streaming folders](/storage/local#streaming-folders) for how the app tells the two apart.

Next: [OneDrive](/storage/onedrive).
