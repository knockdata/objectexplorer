# Updating

New versions are published as [GitHub releases](https://github.com/knockdata/objectexplorer/releases),
and that is where the app looks for them. Where GitHub cannot be reached, objectexplorer.com passes
the same releases on, and the app asks it next; a download goes on from there too. The check
carries nothing about you. Once you allowed it, the desktop app also tells objectexplorer.com, at
most once a day, which version this install runs: a key fingerprint made on this computer, the
version and the platform. It asks before the first time, and the tick **Tell objectexplorer.com once
a day which version this install runs** in **Settings → Check for Updates** changes your answer.
These are among the few requests ObjectExplorer makes that are not to your
own storage — [your data stays here](/privacy#what-does-leave-and-when) lists them all.

## A newer version is offered

Once a day, when the app starts or its window comes back to the front, it asks whether there is a
newer version. When there is, a box says **A new version is available**, with the first lines of
what is new in it and **Full release notes**, and three buttons:

| Button                | What it does                                                    |
|-----------------------|-----------------------------------------------------------------|
| **Skip This Version** | that version is never offered again; a later one is             |
| **Remind Me Later**   | offered again at the next day's check                           |
| **Update…**           | opens **Settings → Check for Updates**, which installs it       |

**Help: Check for Updates** in the command palette asks at once, whatever the day and even for a
version you skipped. A copy built from source, or a server whose owner updates it, is never offered
one.

## In the app

**Settings → Check for Updates** asks for the latest release when you open it. When there is a
newer version, **Update to 0.9.24** downloads it into
`~/.objectexplorer/work/update`, checks its sha256 against the release's own list, and only then puts it
where the next start finds it. Nothing changes while you work. The button then turns into
**Restart to Finish**: the app closes and opens again on the new version, on the same port, and a
browser page waits for it and reloads.

How the new version is put in place depends on how you installed this copy:

| Installed from                            | What **Update** does                                                                                                                                                 |
|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| the macOS `.dmg`, dragged to Applications | replaces the app                                                                                                                                                     |
| the app opened straight from the `.dmg`   | puts the new version in `/Applications`, or in `~/Applications` when you cannot write `/Applications`; **Choose Folder…** picks another; Restart opens it from there |
| a `.tar.gz`, or the Windows `.zip`        | downloads the new binary and puts it in place of this one                                                                                                            |
| `npm install -g`, or a project            | runs npm to install the new version                                                                                                                                  |
| `npx`                                     | installs it under `~/.objectexplorer/update`, and runs from there                                                                                                    |
| Homebrew                                  | shows the command: `brew upgrade objectexplorer`, or `brew upgrade --cask objectexplorer-app`                                                                        |
| the Windows `.msix`                       | downloads the new `.msix`; on restart App Installer opens it and replaces this copy                                                                                  |
| a server                                  | shows the commands: [updating a server](#a-server)                                                                                                                   |

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
