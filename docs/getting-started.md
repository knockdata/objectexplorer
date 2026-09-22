# Getting started

## Download {#download}

Every link below fetches the installer from the newest release.

<DownloadTable />

Older versions, and the release notes for each one, are on the
[releases page](https://github.com/knockdata/objectexplorer/releases).

### macOS

Open the `.dmg` and drag ObjectExplorer to Applications. The app is signed with a Developer ID and
notarized, so it opens on the first double-click.

### Windows

The download is a signed `.msix`. Double-click it and Windows does the rest — a Start menu entry, an
icon, and an entry in *Add or remove programs* that uninstalls cleanly. It is signed with the
company's certificate; SmartScreen may still show a notice the first time.

ObjectExplorer is not in the [Microsoft Store](https://apps.microsoft.com/detail/9PMCD8HJPCXH) yet.

### Linux

One AppImage:

```sh
chmod +x ObjectExplorer-linux-x64.AppImage
./ObjectExplorer-linux-x64.AppImage
```

The window is drawn with the WebKitGTK your distribution ships, and ObjectExplorer opens in your
default browser on a machine that has none. To get the native window, install it:

```sh
sudo apt install libwebkit2gtk-4.1-0        # Debian, Ubuntu
sudo dnf install webkit2gtk4.1              # Fedora, RHEL
sudo pacman -S webkit2gtk-4.1               # Arch
sudo zypper install libwebkit2gtk-4_1-0     # openSUSE
```

On an older release without a 4.1 package, the 4.0 one (`libwebkit2gtk-4.0-37`, `webkit2gtk3`)
works too.

## Run it with npx

No install at all, if you already have Node 20+ on your machine:

```sh
npx @knockdata/objectexplorer
```

It starts a local server, opens a browser tab, and shows the folder you ran it from. Both arguments
are optional:

```sh
npx @knockdata/objectexplorer ~/data port=9421
```

If PowerShell refuses to run `npx`, see [troubleshooting](/reference/troubleshooting).

## Or open it in a browser

[objectexplorer.com/app](https://objectexplorer.com/app) runs the same app with nothing installed.
It reads what you give it — a local folder you pick, or a share link somebody sent you — and the
parsers still run in your browser rather than on a server.

What needs a machine of your own stays in the desktop app and `npx`: cloud connections, the MCP
gateway for agents, the writing tool's sources, and Settings → About and Check for Updates. The
browser version leaves those panes out rather than showing one that can only fail.

## First run

1. The tree starts with a **demo** folder of sample objects: parquet, Delta, Iceberg, Hudi, SPSS,
   SAS, csv, json.
2. Press **+** in the sidebar header, or open **Settings → Connections**, to add your own storage —
   see [connecting storage](/storage/connect).
3. Double-click a table and it opens as a [notebook](/analyze/notebook), already queried and
   plotted.

Next: [your data stays here](/privacy).
