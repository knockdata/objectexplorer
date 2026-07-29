# Release process

## Cut a release
```
git tag vX.Y.Z
git push origin vX.Y.Z
```
Pushing the tag triggers `.github/workflows/release.yml`. `.github/set-version.sh` stamps `X.Y.Z` into `package.json` before each platform builds. (Manual alternative: `gh workflow run release.yml -f version=X.Y.Z`.)

## What gets built
| job     | output                                          | notes                                    |
|---------|--------------------------------------------------|-------------------------------------------|
| mac     | `dist/*.dmg` (x64, arm64)                        | signed + notarized when secrets present   |
| windows | `dist/*.exe` (x64, arm64, nsis)                  | signed with Azure Trusted Signing         |
| windows | `dist/*.msi` (x64, arm64, msiWrapped)            | signed with Azure Trusted Signing         |
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

Windows: run `ObjectExplorer-X.Y.Z-x64.exe` (or `-arm64.exe`) directly. It installs per-user into
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

## Windows signing

Unsigned Electron binaries get quarantined by Windows Defender: 0.2.1 installed a folder holding
every `.pak`, `.bin` and `.dat` file but not one `.exe` or `.dll`, leaving a Start-menu shortcut
pointing at a missing `ObjectExplorer.exe`. Everything shipped as an executable is therefore signed
with [Azure Trusted Signing](https://learn.microsoft.com/en-us/azure/trusted-signing/).

Authentication uses Azure's `EnvironmentCredential`, which reads three repo secrets:
`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`. The service principal behind them
needs the **Trusted Signing Certificate Profile Signer** role on the account, otherwise the build
fails with an authorization error from `Invoke-TrustedSigning`.

The four account values are not secret and are passed on the command line in `release.yml`:

| `azureSignOptions` key   | value                                                             |
|--------------------------|-------------------------------------------------------------------|
| `endpoint`               | `https://neu.codesigning.azure.net/`                              |
| `codeSigningAccountName` | `knockdata`                                                       |
| `certificateProfileName` | `KnockData`                                                       |
| `publisherName`          | `CN=KnockData, O=KnockData, STREET=..., L=Stockholm, C=SE, ...`   |

`build.win.signExts` adds `.dll` to what gets signed — electron-builder signs only the main `.exe`
by default, and Defender took the DLLs too.

The windows job runs electron-builder **twice** on purpose. Setting `azureSignOptions` swaps in
`WindowsSignAzureManager` for the whole run, and its `computePublisherName()` ignores
`appx.publisher` and returns the Trusted Signing certificate subject — which would write the wrong
`Identity/Publisher` into the Store manifest. The option cannot be turned back off from the CLI
either (`-c.win.*` values are not coerced, so `-c.win.azureSignOptions=null` arrives as the string
`"null"`). So the nsis/msiWrapped step gets the signing options and the appx step does not.

Local `npm run build:win` never signs, since the options only exist in the workflow.

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
