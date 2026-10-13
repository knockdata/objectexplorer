# Troubleshooting

## Windows: "npx.ps1 cannot be loaded because running scripts is disabled on this system"

- Right click PowerShell and choose **Run as administrator**
- Run `Get-ExecutionPolicy` — if it says `Restricted`, it needs changing
- Run `Set-ExecutionPolicy RemoteSigned`
- Run `Get-ExecutionPolicy` again — it should now say `RemoteSigned`

`npx` then works in that terminal, and in any new one.

## Windows: SmartScreen shows a notice

The `.msix` and the `.exe` files are signed with the company's certificate, but a new signature takes
a while to build reputation. Choose **More info → Run anyway**.

## Linux: no window opens

The window is drawn on Wayland. Under an X11 session, or over ssh, run the command line instead,
`objectexplorer`, and it opens the app in your browser.

## A bucket lists nothing, or asks me to sign in again

The provider answered, and it said no. Open **Settings** and the sign-in for that provider —
**Amazon Web Services**, **Google** or **Microsoft** — reports which credential source was tried and
what each one said; a source that is not configured on this machine is skipped rather than failed,
so the report says which step is missing. See [Amazon S3](/storage/s3),
[Google Cloud Storage](/storage/gcs) or [Azure Blob Storage](/storage/azure).

## A folder shows objects that are gone, or misses ones that are there

Cloud listings are kept for eight hours, and an older one is shown while the folder is listed again
in the background. The refresh icon that shows on a row of the tree under the pointer asks the
provider again at once.

## Something else

**Settings → About** names exactly which build is running and where it keeps its files. Started from
a terminal, `objectexplorer window=true` prints its messages and errors there. Every window session
is also [recorded](/reference/session-recording) on this machine, and a recording can be played back
to show what happened. Attach what you found to an issue on
[GitHub](https://github.com/knockdata/objectexplorer/issues).
