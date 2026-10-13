# Box

ObjectExplorer reads and writes Box through the Box API, signed in with OAuth. The Box Drive app
does not have to run on this machine: a path such as `box://Reports/q3.csv` goes straight to your
account, and the files are previewed, copied and moved like objects in a bucket.

## Connecting

There is no Box row in Settings yet. A drive is linked on a server — `objectexplorer` started from a
terminal, which serves the app to your browser — and only from that server's own machine:

1. Create an app with OAuth 2.0 user authentication in the Box Developer Console, and add the
   server's redirect address to it: `http://127.0.0.1:9421/oauth/callback`, with the port your
   server listens on.
2. Put the app's client ID and secret in the server's config, `server.json` in the app's folder,
   with a file to keep the link in:

   ```json
   {
     "storage": { "box": { "client_id": "<client id>", "client_secret": "<client secret>" } },
     "oauth": { "tokens_file": "/home/me/.objectexplorer/drive-tokens.json" }
   }
   ```

3. Start the server and open its sign-in page on the same machine, `http://127.0.0.1:9421/server`.
   Under **Drives**, click **link** beside Box and approve the app in the browser.

Add it to the tree with `oe folder add box://` on the server's machine, or a folder below it such
as `box://Reports`. Every client of the server then reads that Box account, within the roots the
owner shares.

Box hands out a new refresh token each time one is used and retires the old one. The server keeps
the newest in the tokens file; without one, the link lasts until the server stops.

A `storage` section in the server's config holds every provider of that server, so the clouds it
reads go there too; Settings then cannot change them.

## Large files

A file above 50 MB is uploaded in parts of the size Box picks, each checked by its SHA-1. A part
that fails for a moment is sent again by itself, and an upload cut off continues from the parts
already sent when the same file is copied again, until Box's upload session expires. Writing a
file that exists makes a new version of it.

Two items with one name in a folder are listed with their id, so each can still be opened.

A Box folder open in the tree is listed again every few seconds, so a file someone else added shows
up by itself.

Next: [the tree and the list](/explore/tree).
