# Box

ObjectExplorer reads Box through the folder the Box Drive app keeps on your disk. Add that folder
as a [local folder](/storage/local) and it is a root like any other: previewed, queried and searched
in place.

There is no Box sign-in inside ObjectExplorer yet, so nothing here holds a Box token and
nothing talks to the Box API — the Box Drive app does that, as it already does for Finder or
Explorer.

## Where the folder is

| System  | Folder                                               |
|---------|------------------------------------------------------|
| macOS   | the `Box…` folder in `~/Library/CloudStorage`        |
| Windows | the folder the Box Drive app registered with Windows |

Pick it with the native folder picker in **Settings → Local folder**.

## Files that are not on this disk

The Box Drive app can keep a file online only, leaving a placeholder that takes no space. The
**On disk** column shows the difference: the bytes a file really holds on this machine, or a cloud
icon when Box is holding them. Click the icon to download that one file.

Opening a placeholder makes Box download the whole file, however little of it a view needs. So a
placeholder of 5 MB or more is not opened silently: the pane says Box is holding it, with a
**Download** button and its size. A smaller one just opens.

See [streaming folders](/storage/local#streaming-folders) for how the app tells the two apart.

Next: [the tree and the list](/explore/tree).
