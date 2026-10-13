# Google Drive

ObjectExplorer reads and writes Google Drive through the Drive API, signed in with OAuth. The Google
Drive app does not have to run on this machine: a path such as `gdrive://Reports/q3.csv` goes
straight to your drive, and the files are previewed, copied and moved like objects in a bucket.

## Connecting

There is no Google Drive row in Settings yet — the Google sign-in there is for Cloud Storage. A
drive is linked on a server — `objectexplorer` started from a terminal, which serves the app to your
browser — and only from that server's own machine:

1. Create an OAuth client in the Google Cloud console, and add the server's redirect address to it:
   `http://127.0.0.1:9421/oauth/callback`, with the port your server listens on.
2. Put its client ID and secret in the server's config, `server.json` in the app's folder, with a
   file to keep the link in:

   ```json
   {
     "storage": { "gdrive": { "client_id": "<client id>", "client_secret": "<client secret>" } },
     "oauth": { "tokens_file": "/home/me/.objectexplorer/drive-tokens.json" }
   }
   ```

3. Start the server and open its sign-in page on the same machine, `http://127.0.0.1:9421/server`.
   Under **Drives**, click **link** beside Google Drive and sign in with Google.

Add it to the tree with `oe folder add gdrive://` on the server's machine, or a folder below it.
Every client of the server then reads it, within the roots the owner shares. Without a tokens file,
the link lasts until the server stops.

For a machine with no person in front of it, leave out the client ID: the entry `"gdrive": {}` reads
as the service account in `GOOGLE_APPLICATION_CREDENTIALS`, with nothing to link.

A `storage` section in the server's config holds every provider of that server, so the clouds it
reads go there too; Settings then cannot change them.

## What is in the drive

`gdrive://` holds the items of My Drive, and two folders beside them: **Shared drives**, the
shared drives you are a member of, and **Shared with me**.

Google Docs, Sheets and Slides have no file of their own. They are listed as `.docx`, `.xlsx` and
`.pptx` and read through Google's export, so they open as Word, Excel and PowerPoint files do.

Drive lets two items in one folder share a name. Both are listed, each with its id, so each can
still be opened.

## Large files

A file above 5 MB is uploaded through a resumable session. A part that fails for a moment is sent
again by itself, and an upload cut off continues from the parts already sent when the same file is
copied again, for up to a week. A copy inside the drive is made by Drive itself; no bytes pass
through your machine.

A Drive folder open in the tree is listed again every few seconds, so a file someone else added
shows up by itself.

Next: [Dropbox](/storage/dropbox).
