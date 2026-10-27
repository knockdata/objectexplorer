# Local folders

A folder on this machine is a root like any bucket: pick it in **Settings → Local folder** with
**Add Folder…**, or **Local Folder…** under the **+** in the side bar's header, and it appears in
the tree, on any disk or mounted volume. From the command line, `oe folder add ~/data` does the same.

Local roots are what make the [copy and move](/explore/file-management) story complete — a prefix
dragged from S3 onto a local root streams through your machine and lands as files, and the other
direction works the same way. A large upload goes one part at a time, and one cut off halfway
continues from the parts already sent when you copy the same file again.

## A page in your browser

On a page served by another machine, adding a folder opens the browser's own folder picker, and the
folder is kept by that page. In instant mode, at
[objectexplorer.com/app](https://objectexplorer.com/app), there is no limit on these folders.

## Streaming folders

Google Drive, OneDrive, Dropbox, Box and iCloud Drive can each keep a folder on your disk. Such a
folder can be added like any other, and its files open in place. A file the sync app keeps online
only is downloaded by that app when it is opened.

To reach those services without their sync app, see [Google Drive](/storage/gdrive),
[Dropbox](/storage/dropbox), [OneDrive](/storage/onedrive) and [Box](/storage/box).

## Running on a folder

`npx @knockdata/objectexplorer ~/data` opens on that folder and adds it as a root, so the next start
finds it already there.

Next: [Google Drive](/storage/gdrive).
