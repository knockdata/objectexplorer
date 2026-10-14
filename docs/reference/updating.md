# Updating

New versions are published as [GitHub releases](https://github.com/knockdata/objectexplorer/releases),
and that is where the app looks for them. The check carries nothing about you. It is one of the few
requests ObjectExplorer makes that are not to your own storage —
[your data stays here](/privacy#what-does-leave-and-when) lists them all.

## In the app

**Settings → Check for Updates** asks GitHub for the latest release when you open it; nothing is
asked before that. When there is a newer version, **Update to 0.9.1** downloads it, checks its
sha256 against the release's own list, and puts it where the next start finds it. Nothing changes
while you work. The button then turns into **Restart to finish**: the app closes and opens again on
the new version, on the same port, and a browser page waits for it and reloads.

How the new version is put in place depends on how you installed this copy:

| Installed from                     | What **Update** does                                                                          |
|------------------------------------|-----------------------------------------------------------------------------------------------|
| the macOS `.dmg` (the `.app`)      | replaces the app                                                                              |
| a `.tar.gz`, or the Windows `.zip` | downloads the new binary and puts it in place of this one                                     |
| `npm install -g`, or a project     | runs npm to install the new version                                                           |
| `npx`                              | installs it under `~/.objectexplorer/update`, and runs from there                             |
| Homebrew                           | shows the command: `brew upgrade objectexplorer`, or `brew upgrade --cask objectexplorer-app` |
| the Windows `.msix`                | downloads the new `.msix`; on restart App Installer opens it and replaces this copy           |
| a server                           | shows the commands: [updating a server](#a-server)                                            |

A copy that came from none of these is told so, and offered nothing.

## The other ways

- **npx** — `npx @knockdata/objectexplorer@latest` always runs the latest published version.
- **Downloads** — the [download links](/getting-started#download) always point at the newest build,
  and every previous build stays on the
  [releases page](https://github.com/knockdata/objectexplorer/releases).

## A server

A server that signs people in never updates itself from a window. Its owner updates it on the
server, with versions installed side by side so going back is one command:

```sh
oe check      # this copy, the version in use, what is installed, the latest
oe upgrade    # install the latest and make it current
oe rollback   # back to the version before
```

See [updating a server](/self-hosting/#updating-an-enterprise-server).

## What changed

Every version's notes are on its [release](https://github.com/knockdata/objectexplorer/releases) and
in the [changelog](/changelog).

Next: [where the usage numbers come from](/reference/usage-data).
