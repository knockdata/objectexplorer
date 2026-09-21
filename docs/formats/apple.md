# Apple files

`plist` `provisionprofile` `.DS_Store`

A property list opens as a table of its keys and values, whether it is XML or the binary form macOS
writes. A `.provisionprofile` is a signed plist, and opens the same way: the app id, the
entitlements, the devices and the dates are rows you can read.

A `.DS_Store` is not a plist. It is a small database of what Finder remembers about a folder — icon
positions, view settings, Spotlight comments — and it opens as a table of those records, each code
spelled out in words.
**Structure** mode shows how its blocks are laid out.

Next: [Anki decks](/formats/anki).
