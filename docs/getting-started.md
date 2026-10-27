# Getting started

ObjectExplorer is one program, `objectexplorer`. Opened from Finder, the Start menu or an
application menu, it is the desktop window. Typed in a terminal, run by npx or by Homebrew, it is the
command line: a server on `http://127.0.0.1:9421` that opens the same app in your browser.

## Download {#download}

Every link below fetches the newest release.

<DownloadTable />

Older versions, and the release notes for each one, are on the
[releases page](https://github.com/knockdata/objectexplorer/releases).

### macOS

Open the `.dmg` and drag ObjectExplorer to the Applications folder beside it, as its window says. The
app is signed with a Developer ID and notarized, so it opens on the first double-click. It needs
macOS 11 Big Sur or later, on Apple silicon or Intel.

The `.tar.gz` is the command line alone, one file `objectexplorer` beside `oe`, its short name. Put
both somewhere on your PATH.

### Windows

Open the signed `.msix` and Windows installs it: a Start menu entry, an icon, and an entry in
*Add or remove programs* that uninstalls cleanly. SmartScreen may still show a notice the first time.

The portable `.zip` runs where you unpack it, with nothing installed: `ObjectExplorer.exe` is the
window, `ObjectExplorer.com` beside it is the command line, and `oe.exe` is the short name.

### Linux

One `.tar.gz` per processor. The binary runs on any distribution with glibc 2.28 or later: Debian 10,
RHEL 8, Ubuntu 20.04 and newer. The window needs Wayland.

```sh
tar -xzf objectexplorer-linux-x64.tar.gz
./objectexplorer                  # the command line: opens the app in your browser
./objectexplorer window=true      # the desktop window
```

To have it in the application menu, for your user alone, with no root and no install script:

```sh
mkdir -p ~/.local/bin ~/.local/share
cp -P objectexplorer oe objectexplorer.install.json ~/.local/bin/
cp -R share/. ~/.local/share/
```

The menu entry runs `objectexplorer window=true`, so `~/.local/bin` must be on your PATH. To remove
it, delete those files again. The `README.txt` in the archive says the same.

## Homebrew

On macOS and Linux:

```sh
brew install knockdata/tap/objectexplorer              # the command line, and oe
brew install --cask knockdata/tap/objectexplorer-app   # the desktop app (macOS)
```

To keep the command line running in the background, started with the machine:

```sh
brew services start objectexplorer
```

It then serves the app on `http://127.0.0.1:9421` without opening a browser. Homebrew updates both:
`brew upgrade`.

## Run it with npx

No install at all, if you already have Node on your machine:

```sh
npx @knockdata/objectexplorer
```

npm fetches the one binary built for your machine, and npx starts it with the arguments as you gave
them. It starts a local server, opens a browser tab, and shows the folder you ran it from. Every
argument is optional, and written `name=value`:

```sh
npx @knockdata/objectexplorer ~/data http_port=9500 open=false
```

The rest are on [the command line](/reference/command-line#starting-it). If PowerShell refuses to run
`npx`, see [troubleshooting](/reference/troubleshooting).

## Or open it in a browser

[objectexplorer.com/app](https://objectexplorer.com/app) runs the same app with nothing installed,
in [instant mode](/reference/instant-mode). It reads what you give it, a local folder you pick or a
share link somebody sent you, and parses it in your browser rather than on a server.

What needs a machine of your own stays in the desktop app and the command line: cloud connections,
the MCP door for agents, Python, the writing tool's sources, and Check for Updates. The browser
version leaves those panes out rather than showing one that can only fail.

In the browser, the download icon above the account icon, at the bottom of the activity bar, is
**Download app**: every installer, with your computer's platform already open. The desktop app has
no such icon; it is already installed.

## Signing in

The account icon at the bottom of the activity bar, above the settings gear, is where you sign in:
with Google, or with an email address. The first sign-in turns on Pro for seven days, and any limit
you run into, such as a fourth bucket of one provider on the Free plan, offers the same sign-in.

Once signed in, the icon's menu shows your name and email, and **Plan…**, which opens
Settings → Plan. **Sign out** forgets your name and picture on this machine; your plan stays as it
is.

At objectexplorer.com/app the sign-in is kept in your browser: the week of Pro counts there, and
signing out, or clearing the site's data, ends it.

## First run

1. On macOS and Windows, Settings opens once on **OS Extension**, where you choose what the app adds
   to the Finder's or File Explorer's menu — see [Finder, File Explorer and file
   managers](/reference/os-integration). Close it and the tour starts.
2. A short tour opens the demo's train stations, a Parquet file, as rows, and shows you how to
   filter them by a bar and download them as an Excel workbook. Then it lights up the activity bar,
   the tree, **Add a folder**, the tabs, search and settings, one card at a time. The **?** at the
   bottom of the activity bar shows it again; see [the tour and what is new](/reference/tour).
3. The tree holds the demo folder, a small sample of every kind of file, and the folder you started
   from. The empty pane says what the app is for — "Open any file to see it as itself: a table as
   rows, a model in 3D. Then download it in another format." — with **Add a Folder…** and
   **Open the Demo** under it, and the files you opened last once there are some.
4. **+** in the sidebar's header, or **Add a Folder…**, adds a folder: **Local Folder…** picks one on
   this machine, and a cloud's entry opens its pane in **Settings** — see
   [connecting storage](/storage/connect).
5. Click a file and it opens as itself: a table as rows, a picture as a picture. **Download** in its
   toolbar saves it as it is, or in another format — see
   [download in another format](/explore/download).

Next: [your data stays here](/privacy).
