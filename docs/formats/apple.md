# Apple files

`plist` `bplist` `provisionprofile` `.DS_Store` `livp`

A property list opens as a table of its keys and values, whether it is XML, the binary form macOS
writes, or the older OpenStep text. A `.provisionprofile` is a signed plist, and opens the same way:
the app id, the entitlements, the devices and the dates are rows you can read.

A `.DS_Store` is not a plist. It is a small database of what Finder remembers about a folder — icon
positions, view settings, Spotlight comments — and it opens as a table of those records, each code
spelled out in words.
**Structure** mode shows how its blocks are laid out.

A Live Photo exported as `.livp` opens as its still picture, with its EXIF. Its movie is inside it,
and opens as a video of its own — see [images](/formats/images#photos-and-modern-formats).

Pages, Numbers and Keynote files are on [documents](/formats/documents).

Next: [certificates and keys](/formats/certificates).
