# Dropbox

ObjectExplorer reads and writes Dropbox through the Dropbox API, signed in with OAuth. No Dropbox
app has to run on this machine: a path such as `dropbox://Reports/q3.csv` goes straight to your
account, and the files are previewed, copied and moved like objects in a bucket.

## Connecting

There is no Dropbox row in Settings yet. A drive is linked on a server — `objectexplorer` started
from a terminal, which serves the app to your browser — and only from that server's own machine:

1. Create an app in the Dropbox App Console, and add the server's redirect address to it:
   `http://127.0.0.1:9421/oauth/callback`, with the port your server listens on.
2. Put the app's key in the server's config, `server.json` in the app's folder:

   ```json
   {
     "storage": { "dropbox": { "client_id": "<app key>", "client_secret": "<app secret>" } }
   }
   ```

3. Start the server and open its sign-in page on the same machine, `http://127.0.0.1:9421/server`.
   Under **Drives**, click **link** beside Dropbox and approve the app in the browser.

Add it to the tree with `oe folder add dropbox://` on the server's machine, or a folder below it
such as `dropbox://Reports`. Every client of the server then reads that Dropbox account, within the
roots the owner shares. The link's refresh token is kept in the system keychain, never in a file, so it survives a restart.

A `storage` section in the server's config holds every provider of that server, so the clouds it
reads go there too; Settings then cannot change them.

## Large files

A file above 150 MB is uploaded in pieces. A piece that fails for a moment is sent again by itself,
and an upload cut off continues from the pieces already sent when the same file is copied again,
for up to a week.

A Dropbox folder open in the tree is listed again every few seconds, so a file someone else added
shows up by itself.

Next: [OneDrive](/storage/onedrive).
