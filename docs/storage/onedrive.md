# OneDrive and SharePoint

ObjectExplorer reads and writes OneDrive through Microsoft Graph, signed in with OAuth. The OneDrive
app does not have to run on this machine: a path such as `onedrive://Reports/q3.csv` goes straight to
your drive, and the files are previewed, copied and moved like objects in a bucket.

## Connecting

There is no OneDrive row in Settings yet — the Microsoft sign-in there is for Azure Blob Storage and
OneLake. A drive is linked on a server — `objectexplorer` started from a terminal, which serves the
app to your browser — and only from that server's own machine:

1. Register an app in Microsoft Entra ID, and add the server's redirect address to it:
   `http://127.0.0.1:9421/oauth/callback`, with the port your server listens on.
2. Put its client ID in the server's config, `server.json` in the app's folder, with its secret if
   it has one:

   ```json
   {
     "storage": { "onedrive": { "client_id": "<application id>" } }
   }
   ```

3. Start the server and open its sign-in page on the same machine, `http://127.0.0.1:9421/server`.
   Under **Drives**, click **link** beside OneDrive / SharePoint and sign in with Microsoft.

The sign-in goes to the `common` tenant unless the entry names a `tenant_id`. Add the drive to the
tree with `oe folder add onedrive://` on the server's machine, or a folder below it. Every client of
the server then reads it, within the roots the owner shares.
The link's refresh token is kept in the system keychain, never in a file, so it survives a restart.

A `storage` section in the server's config holds every provider of that server, so the clouds it
reads go there too; Settings then cannot change them.

## SharePoint

The same provider reads a SharePoint document library instead of your own drive. Name it in the
`onedrive` entry:

| Entry                                               | What `onedrive://` is                      |
|-----------------------------------------------------|--------------------------------------------|
| nothing                                             | your own OneDrive                          |
| `"site": "Marketing"`                               | that site's default library, found by name |
| `"site": "contoso.sharepoint.com:/sites/Marketing"` | that site, by its address                  |
| `"site": "Marketing", "library": "Reports"`         | the site's library named Reports           |
| `"drive": "/drives/<id>"`                           | one drive, by its Graph id                 |

## Large files

A file above 4 MB is uploaded in pieces through an upload session. A piece that fails for a moment
is sent again by itself, and an upload cut off continues from the pieces already sent when the same
file is copied again, until the session Microsoft gave expires. A copy inside the drive is made by
OneDrive itself; no bytes pass through your machine.

A OneDrive folder open in the tree is listed again every few seconds, so a file someone else added
shows up by itself.

Next: [Box](/storage/box).
