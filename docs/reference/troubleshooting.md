# Troubleshooting

## Windows: "npx.ps1 cannot be loaded because running scripts is disabled on this system"

- Right click PowerShell and choose **Run as administrator**
- Run `Get-ExecutionPolicy` — if it says `Restricted`, it needs changing
- Run `Set-ExecutionPolicy RemoteSigned`
- Run `Get-ExecutionPolicy` again — it should now say `RemoteSigned`

`npx` then works in that terminal, and in any new one.

## Windows: SmartScreen shows a notice

The `.msix` is signed with the company's certificate, but a new signature takes a while to build
reputation. Choose **More info → Run anyway**, or install from the
[Microsoft Store](https://apps.microsoft.com/detail/9PMCD8HJPCXH) when it is published there.

## Linux: it opened in my browser instead of a window

The native window is drawn with the WebKitGTK your distribution ships, and ObjectExplorer falls back
to your browser on a machine that has none. Install it:

```sh
sudo apt install libwebkit2gtk-4.1-0        # Debian, Ubuntu
sudo dnf install webkit2gtk4.1              # Fedora, RHEL
sudo pacman -S webkit2gtk-4.1               # Arch
sudo zypper install libwebkit2gtk-4_1-0     # openSUSE
```

On an older release without a 4.1 package, the 4.0 one (`libwebkit2gtk-4.0-37`, `webkit2gtk3`) works
too.

## A bucket lists nothing, or asks me to sign in again

The provider answered, and it said no. Open **Settings → Connections** and the row for that provider
reports which credential source was tried and what each one said — a source that is not configured on
this machine shows as *skipped* rather than *failed*, so the report says which step is missing. See
[Amazon S3](/storage/s3), [Google Cloud Storage](/storage/gcs) or
[Azure Blob Storage](/storage/azure).

## A folder shows objects that are gone, or misses ones that are there

Cloud listings are cached for eight hours. The refresh button asks the provider again, past that
cache — the pane goes blank while the request is out, so the answer on screen is the answer to the
click.

## Something else

`~/.objectexplorer/app.log` has what the app did, in order, including the `about:` block naming
exactly which build is running — that block is also under **Settings → About**. Attach it to an
issue on [GitHub](https://github.com/knockdata/objectexplorer/issues).
