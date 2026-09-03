# Your data stays here

This is the part that matters when you work with data you are not allowed to copy.

ObjectExplorer is an HTTP server bound to `127.0.0.1` plus the OS webview, both inside the same
executable. Every parser — Parquet, SPSS, SAS, PDF, the office formats, the image decoders — runs in
a worker on your own machine.

- Objects are fetched **from your cloud provider to your computer**, and nowhere else. We run no
  backend that sees your data, because there is nothing for it to see.
- Credentials stay local. Nothing is synced — see [where your data lives](/reference/data-locations).
- The only call that is not to your own storage is a version check against the npm registry, so the
  app can tell you an update exists.
- Nothing is uploaded for "processing", no file names are reported anywhere, and no account is
  needed to open a file.

Which also means there is no data-processing agreement to negotiate before anyone can look at a
bucket.

## The two things that do leave

**A share link, when you make one.** [Sharing a table](/explore/share) is the one feature that sends
rows somewhere else, and it never happens on its own: you open the dialog, decide column by column
what goes, and press Copy URL. Small shares travel inside the link's fragment, which no server ever
sees.

**The version check.** One request to the npm registry asking what the latest published version is.
It carries no path, no bucket name and no identifier of you.

## What a cloud provider sees

The same thing it would see if you used its own console: signed requests from your machine, for the
objects you opened. ObjectExplorer adds no proxy, no relay and no third party in between.

Next: [connecting storage](/storage/connect).
