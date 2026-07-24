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
| windows | `dist/*.exe` (x64, arm64, nsis)                  |                                            |
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

Windows: run `ObjectExplorer-Setup-X.Y.Z-x64.exe` (or `-arm64.exe`) directly.

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
