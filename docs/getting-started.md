# Getting started

## Download {#download}

Every link below points at the newest build.

| Platform | Download |
|---|---|
| macOS, Apple Silicon | [ObjectExplorer-mac-arm64.dmg](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-mac-arm64.dmg) |
| macOS, Intel | [ObjectExplorer-mac-x64.dmg](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-mac-x64.dmg) |
| Windows, x64 | [ObjectExplorer-windows-x64.msix](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-windows-x64.msix) |
| Windows, ARM | [ObjectExplorer-windows-arm64.msix](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-windows-arm64.msix) |
| Linux, x64 | [ObjectExplorer-linux-x64.AppImage](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-linux-x64.AppImage) |
| Linux, ARM | [ObjectExplorer-linux-arm64.AppImage](https://github.com/knockdata/objectexplorer/releases/latest/download/ObjectExplorer-linux-arm64.AppImage) |

Older versions, and the release notes for each one, are on the
[releases page](https://github.com/knockdata/objectexplorer/releases).

### macOS

Open the `.dmg` and drag ObjectExplorer to Applications. The app is signed with a Developer ID and
notarized, so it opens on the first double-click.

### Windows

The download is a signed `.msix`. Double-click it and Windows does the rest — a Start menu entry, an
icon, and an entry in *Add or remove programs* that uninstalls cleanly. It is signed with the
company's certificate; SmartScreen may still show a notice the first time.

ObjectExplorer will also be published on the
[Microsoft Store](https://apps.microsoft.com/detail/9PMCD8HJPCXH).

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

## First run

1. The tree starts with a **demo** folder of sample objects: parquet, Delta, Iceberg, Hudi, SPSS,
   SAS, csv, json.
2. Press **+** in the sidebar header, or open **Settings → Connections**, to add your own storage —
   see [connecting storage](/storage/connect).
3. Double-click a table and it opens as a [notebook](/analyze/notebook), already queried and
   plotted.

Next: [connecting storage](/storage/connect).
