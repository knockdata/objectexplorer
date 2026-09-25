# Updating

New versions are published to the npm registry, and that is where the app looks for them. The check
carries nothing about you. It is one of the few requests ObjectExplorer makes that are not to your
own storage — [your data stays here](/privacy#what-does-leave-and-when) lists them all.

## In the app

The desktop app checks each time it starts, once its window is up, and downloads a newer version in
the background. It is used from the next start; nothing is swapped while you work.

**Settings → Check for Updates** asks again at any time. When there is a newer version, **Update**
downloads it and turns into **Restart**; the app comes back on the version it just installed rather
than the one it was started from.

Updates land in `~/.objectexplorer/.app`, beside the versions the app already has, so a restart is
all it takes and nothing is overwritten in place.

## The other ways

- **npx** — `npx @knockdata/objectexplorer` always resolves the latest published version.
- **Downloads** — the [download links](/getting-started#download) always point at the newest build,
  and every previous build stays on the
  [releases page](https://github.com/knockdata/objectexplorer/releases).
- **Microsoft Store** — ObjectExplorer is not in the Store yet. Once it is, a Store install updates the
  way any Store app does.
- **An enterprise server** — never updates itself. An admin updates it on the server with
  `npx @knockdata/objectexplorer check` and `npx @knockdata/objectexplorer upgrade`, and can go back with
  `npx @knockdata/objectexplorer rollback`; see
  [updating an enterprise server](/reference/deployment#updating-an-enterprise-server).

## What changed

Every version's notes are in the [changelog](/changelog).

Next: [where the usage numbers come from](/reference/usage-data).
