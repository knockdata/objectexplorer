# Release process

## Cut a release
```
git tag vX.Y.Z
git push origin vX.Y.Z
```
Pushing the tag triggers `.github/workflows/release.yml`. `.github/set-version.sh` stamps `X.Y.Z` into `package.json` before each platform builds. (Manual alternative: `gh workflow run release.yml -f version=X.Y.Z`.)

Windows and Linux each build on a runner of the arch they target — `windows-latest` /
`windows-11-arm`, `ubuntu-latest` / `ubuntu-24.04-arm`. Nothing is cross built. An arm64
Windows installer built on the x64 runner shipped binaries that did not match the machine and
were removed during installation, so if the `windows-11-arm` runner is ever unavailable the
answer is to drop arm64 and ship x64 only, never to cross build it again. Local
`npm run build:win` still passes `--x64 --arm64` on one machine; that is for convenience and
its output is not shippable.

## What gets built
| job     | output                                          | notes                                    |
|---------|--------------------------------------------------|-------------------------------------------|
| mac     | `dist/*.dmg` (x64, arm64)                        | signed + notarized when secrets present   |
| windows | `dist/*.exe` (x64, arm64, nsis)                  | signed with Azure Trusted Signing         |
| windows | `dist/*.msi` (x64 only, msiWrapped)              | signed; arm64 impossible — see below      |
| windows | `dist/*.msix` (x64, arm64)                       | for the Microsoft Store, unsigned on purpose |
| linux   | `dist/*.AppImage` (x64, arm64)                   |                                            |
| release | GitHub Release "ObjectExplorer vX.Y.Z"           | bundles all artifacts, auto-generated notes |

## Watch a run
```
gh run watch --repo knockdata/objectexplorer
gh run view <run-id> --log-failed   # on failure
```

## Fetch and test the result yourself
```
gh release download vX.Y.Z --repo knockdata/objectexplorer -D ./release-test
# or, before the release job has run:
gh run download <run-id> --repo knockdata/objectexplorer -D ./release-test
```

Mac:
```
hdiutil attach ObjectExplorer-*.dmg
cp -R "/Volumes/ObjectExplorer/ObjectExplorer.app" /Applications/
hdiutil detach "/Volumes/ObjectExplorer"
spctl -a -vv /Applications/ObjectExplorer.app   # expect: accepted / source=Notarized Developer ID
open /Applications/ObjectExplorer.app
```

Windows: **install the file whose arch matches the machine.** Both installers use the same
appId and the same `%LOCALAPPDATA%\Programs\ObjectExplorer` directory, so one silently
replaces the other and nothing warns you. v0.2.4 produced no `-arm64.msi` at all — an ARM
machine reaching for the only MSI got the x64 build and ran it under emulation. Open
**Help → About ObjectExplorer** first: the Architecture line states what is actually running,
and says so explicitly when an x64 build is running emulated on ARM.

Run `ObjectExplorer-X.Y.Z-x64.exe` (or `-arm64.exe`) directly. It installs per-user into
`%LOCALAPPDATA%\Programs\ObjectExplorer`. Confirm the signature survived:
```
Get-AuthenticodeSignature "$env:LOCALAPPDATA\Programs\ObjectExplorer\ObjectExplorer.exe"
```
`Status` must be `Valid`. If binaries are missing from that folder, Defender ate them —
`Get-MpThreatDetection | Select-Object -Last 10` shows what it quarantined.

An `.msix` is a zip, so its manifest can be checked without a Windows machine:
```
unzip -p ObjectExplorer-X.Y.Z-x64.msix AppxManifest.xml
```

Linux:
```
chmod +x ObjectExplorer-*.AppImage
./ObjectExplorer-*.AppImage
```

## Clean up a test release
```
git push --delete origin vX.Y.Z
git tag -d vX.Y.Z
gh release delete vX.Y.Z --repo knockdata/objectexplorer --yes
```

## Troubleshooting a Windows install

Run the diagnose script on the failing machine and read the output before changing anything:

```
powershell -ExecutionPolicy Bypass -File scripts\diagnose-windows.ps1
```

It prints the real vs emulated architecture, the install directory checked against
`resources\package-files.json` (written at build time by `scripts/afterPack.cjs`), every
binary's signature status, Defender's recent detections, and the tail of `app.log`. A missing
`ObjectExplorer.exe`, or any file listed under **MISSING**, means something removed it after
installation — normally Defender; see the signing section below.

The app performs the same manifest check itself at startup and writes the result to
`app.log`, so `install integrity:` there says the same thing without running anything.

### The GPU decides itself

A VM with no real GPU used to give a white window on every launch until someone found
`disable-gpu` by hand. The app now answers the question before Chromium starts, in `gpu.js`:

1. `Get-CimInstance Win32_VideoController` names the display adapters. If **every** adapter is
   a software one — `Microsoft Basic Render Driver`, `VMware SVGA`, `Hyper-V`, and the rest of
   the list in `gpu.js` — hardware acceleration is switched off before the app is ready. A
   machine that shows a real GPU next to an RDP or Citrix mirror adapter stays accelerated.
2. A marker is written just before the window is created and cleared the moment it paints. Any
   launch that dies in between leaves the marker behind, and **every launch after that one is
   software rendered**, whatever the adapter said.

Both the decision and its reason are in `app.log` (`gpu: disabled - ...`) and on the
**Rendering** line of **Help → About**. The state lives in
`%USERPROFILE%\.objectexplorer\gpu-state.json`:

```powershell
type "$env:USERPROFILE\.objectexplorer\gpu-state.json"
del  "$env:USERPROFILE\.objectexplorer\gpu-state.json"   # re-probe: the VM got a GPU, or the crash is fixed
```

To override without deleting anything: `gpu=on` forces hardware acceleration back on,
`disableGpu=true` (or `disable-gpu` in `switches.txt`) forces it off. Both beat the probe.

Software rendering needs `vk_swiftshader.dll` shipped, which is why
`REMOVE_SWIFTSHADER` in `scripts/afterPack.cjs` must stay `false`.

### Chromium switches without rebuilding

Chromium reads native `--flags` straight off the process command line, so an installed build
can be tested from PowerShell without touching anything. When a renderer crashes, run these
one at a time; the first that starts cleanly names the cause:

```powershell
$exe = "$env:LOCALAPPDATA\Programs\ObjectExplorer\ObjectExplorer.exe"
& $exe --disable-features=RendererCodeIntegrity   # try first — a DLL injected into the renderer, the classic 0xC0000005 on VMs
& $exe --no-sandbox                               # the sandbox cannot start under this VM or security software
& $exe --disable-gpu                              # the GPU path
& $exe --disable-gpu-sandbox                      # the GPU process sandbox specifically
& $exe --in-process-gpu                           # removes the GPU process entirely
& $exe --disable-software-rasterizer              # rules SwiftShader in or out
```

Native flags are invisible to the app (About and `app.log` list them under argv only), and a
Start-menu launch takes no arguments at all. To make the winning switch permanent, write it to
`%USERPROFILE%\.objectexplorer\switches.txt` — one per line, `name` or `name=value`, `#` for
comments:

```powershell
Set-Content "$env:USERPROFILE\.objectexplorer\switches.txt" "disable-features=RendererCodeIntegrity"
```

Everything applied from switches.txt is listed in `app.log` and in
**Help → About ObjectExplorer**. The same list also works as `switches=a,b=c` on the command
line.

`app.log` decodes crash codes, so `exitCode: 1073741819` reads as
`0xC0000005 STATUS_ACCESS_VIOLATION` with the switch to try named alongside it.

### Exe files removed on a test machine

If binaries disappear from the install directory even though the release is signed, Defender
took them on a heuristic. Name the detection first:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\diagnose-windows.ps1
```

The **Windows Defender** section lists recent detections. To keep testing on that machine:

```powershell
Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\Programs\ObjectExplorer"
```

The real fix is reporting the false positive: submit the flagged installer or exe at
<https://www.microsoft.com/wdsi/filesubmission> as a software developer. Files signed with
Azure Trusted Signing are normally cleared quickly.

### There is no arm64 MSI, and there cannot be one

**On ARM take `ObjectExplorer-X.Y.Z-arm64.exe` or the `.msix`.** `build.win.target` lists
`msiWrapped` as x64 only and the release job skips the MSI step on the arm64 runner. This is
not a configuration choice — it is an electron-builder bug, and the shape of it matters
because the broken output looks correct:

- `MsiTarget` rewrites `arm64` to `x64` before generating the wxs, because the bundled wix 4
  cannot target arm64 ([electron-builder#6077](https://github.com/electron-userland/electron-builder/issues/6077)).
  For a plain MSI that only picks `ProgramFiles64Folder`, which is harmless.
- `MsiWrappedTarget` inherits that rewritten arch and uses it to resolve **which NSIS exe to
  wrap**, so an arm64 MSI asks for `ObjectExplorer-X.Y.Z-x64.exe`.

When both arches were built in one invocation on the x64 runner, that file existed — so the
arm64 MSI quietly wrapped the **x64** installer and named itself `-arm64.msi`. On a native
arm64 runner the x64 exe is absent and wix fails loudly with
`LGHT0103 : The system cannot find the file ...-x64.exe`. The error is the honest outcome; the
earlier success was the bug. If a future electron-builder passes the real arch to
`MsiWrappedTarget.writeManifest`, add `arm64` back and check that the wxs references
`-arm64.exe`.

Every Windows installer shares an appId and install directory, so a wrong-arch one silently
replaces a correct install with no warning. **Help → About** states the architecture actually
running and says so explicitly when an x64 build is running emulated on ARM.

## Windows signing

Unsigned Electron binaries get quarantined by Windows Defender: 0.2.1 installed a folder holding
every `.pak`, `.bin` and `.dat` file but not one `.exe` or `.dll`, leaving a Start-menu shortcut
pointing at a missing `ObjectExplorer.exe`. Everything shipped as an executable is therefore signed
with [Azure Trusted Signing](https://learn.microsoft.com/en-us/azure/trusted-signing/).

Authentication uses Azure's `EnvironmentCredential`, which reads three repo secrets:
`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`. The service principal behind them
needs the **Trusted Signing Certificate Profile Signer** role on the account, otherwise the build
fails with an authorization error from `Invoke-TrustedSigning`.

The four account values are not secret and live in `electron-builder.cjs`: `endpoint`,
`codeSigningAccountName`, `certificateProfileName` and the certificate's `publisherName`.

`build.win.signExts` adds `.dll` to what gets signed — electron-builder signs only the main `.exe`
by default, and Defender took the DLLs too.

The windows job runs electron-builder **twice** on purpose. Setting `azureSignOptions` swaps in
`WindowsSignAzureManager` for the whole run, and its `computePublisherName()` ignores
`appx.publisher` and returns the Trusted Signing certificate subject — which would write the wrong
`Identity/Publisher` into the Store manifest. So the nsis/msiWrapped step runs with
`SIGN_WINDOWS=true` and the appx step runs without it.

That switch needs `electron-builder.cjs` because neither alternative works: package.json cannot
express a conditional, and repeated `-c.win.azureSignOptions.*` command-line arguments come back
from yargs as a mix of objects and strings, with each string turned into an `extends` path that
electron-builder then fails to open. Both Windows steps therefore pass
`--config electron-builder.cjs`; every other job reads package.json, which `electron-builder.cjs`
re-exports unchanged.

Local `npm run build:win` never signs — it reads package.json, and `SIGN_WINDOWS` is unset anyway.

## Microsoft Store

The Store build is driven entirely by the `build.appx` block in `package.json`. Three of its
values come from Partner Center; they are filled in already, and if a Store submission is ever
rejected on identity, re-check them at [Partner Center](https://partner.microsoft.com/dashboard) →
your product → **Product management** → **Product identity**:

| Partner Center field                    | `build.appx` key            | Looks like                                |
|-----------------------------------------|-----------------------------|-------------------------------------------|
| Package/Identity/Name                   | `identityName`              | `12345KnockData.ObjectExplorer`           |
| Package/Identity/Publisher              | `publisher`                 | `CN=1F2E3D4C-5B6A-7890-ABCD-EF1234567890` |
| Package/Properties/PublisherDisplayName | `publisherDisplayName`      | `KnockData`                               |

`displayName` must match the name reserved in Partner Center exactly, or certification rejects
the submission.

No signing certificate and no Azure/Entra credentials are needed: the CI job builds the `.msix`
unsigned and Partner Center re-signs it with Microsoft's certificate on upload.

### Submit
1. `./release.sh` (or push a `vX.Y.Z` tag), wait for the release.
2. `gh release download vX.Y.Z --repo knockdata/objectexplorer -p '*.msix' -D ./release-test`
3. Partner Center → your product → **Packages** → upload both the x64 and the arm64 `.msix`
   into the same submission → **Submit to the Store**.

The manifest version is `X.Y.Z.0` (electron-builder appends the 4th component, which the Store
requires to be `0`). Each submission must have a higher version than the last, which happens
automatically because `.github/set-version.sh` stamps the tag into `package.json`.

### Tile assets
`build/appx/*.png` are the Store tiles, generated from `build/icon.png` by
`scripts/make-appx-assets.sh` and committed. Regenerate and commit them whenever the icon
changes — the Windows runner cannot generate them, and electron-builder silently substitutes
Microsoft's placeholder tiles for any that are missing.

## Mac signing secrets
`BUILD_CERTIFICATE_BASE64` must be a **"Developer ID Application"** certificate (not "Apple Distribution"/"Mac App Distribution" — those are for App Store submissions and fail notarization).

To (re)generate:
```
openssl req -new -newkey rsa:2048 -nodes \
  -keyout DeveloperIDApplication.key \
  -out DeveloperIDApplication.csr \
  -subj "/emailAddress=you@example.com/CN=Your Name or Org/C=SE"
```
Upload the `.csr` at [Apple Developer → Certificates](https://developer.apple.com/account/resources/certificates/list) → **Developer ID Application**, download the issued `.cer`, then:
```
openssl x509 -in developerID_application.cer -inform DER -out developerID_application.pem -outform PEM
openssl pkcs12 -export \
  -inkey DeveloperIDApplication.key \
  -in developerID_application.pem \
  -out DeveloperIDApplication.p12 \
  -password pass:YOUR_P12_PASSWORD
base64 -i DeveloperIDApplication.p12 | pbcopy
```
Paste into the `BUILD_CERTIFICATE_BASE64` secret; set `P12_PASSWORD` to the password used above. `KEYCHAIN_PASSWORD` can be any value — it only protects the temporary CI keychain for the duration of the build.

Notarization itself uses an App Store Connect API key (`APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_PRIVATE_KEY`) — unrelated to the signing certificate above.
