# Updating

The app checks the npm registry for the newest published version. That check is the only request
ObjectExplorer makes that is not to your own storage, and it carries nothing about you.

## In the app

**Settings → Check for Updates**. When there is one, **Update** downloads it and turns into
**Restart**; the app comes back on the version it just installed rather than the one it was started
from.

Updates land in `~/.objectexplorer/.app`, beside the versions the app already has, so a restart is
all it takes and nothing is overwritten in place.

## The other ways

- **npx** — `npx @knockdata/objectexplorer` always resolves the latest published version.
- **Downloads** — the [download links](/getting-started#download) always point at the newest build,
  and every previous build stays on the
  [releases page](https://github.com/knockdata/objectexplorer/releases).
- **Windows Store** — updates arrive the way any Store app's do.

## What changed

Every version's notes are in the [changelog](/changelog).

Next: [troubleshooting](/reference/troubleshooting).
