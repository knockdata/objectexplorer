# Where a file is parsed

The desktop window is one program: every file is read and parsed in it, on your machine.

In a browser, the page decides by where the server is. When the server runs on your own machine —
`objectexplorer` in a terminal, npx, Homebrew — the page and the server are both yours. When it
runs somewhere else — objectexplorer.com, your company's server — the page keeps your own files to
itself.

| The file                               | Server on this machine                                   | Server elsewhere                                                           |
|----------------------------------------|----------------------------------------------------------|----------------------------------------------------------------------------|
| A folder or file you pick              | the server: its own folder dialog, and it reads the file | the page: the browser's picker, the file kept in the page and parsed there |
| A file or folder dragged in            | the page                                                 | the page                                                                   |
| Cloud storage (S3, Azure, GCS, drives) | the server, with the credentials it holds                | the server, with the credentials it holds                                  |
| The demo, in instant mode              | the server                                               | the server                                                                 |

What the page holds shows in the tree under a `browser://` root. It is never sent to the server, and
it is gone with the page. Its pictures are made small by the browser's own decoder.

A server counts a page as on this machine only when the request comes from this machine and passed
through no proxy — the same test that decides
[who may configure it](/self-hosting/#who-may-do-what).

Next: [instant mode](/reference/instant-mode).
