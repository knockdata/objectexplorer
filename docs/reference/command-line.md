# The command line

Everything you set in **Settings** can be set from a terminal too. The command is `oe`, a short name
for ObjectExplorer itself: the same program, so there is nothing else to install. Started with a
command, it does that one thing and exits; it never opens a window.

```sh
oe settings set theme light
oe signin aws --file ~/keys/accessKeys.csv
oe mcp install claude
```

A window that is already open follows the change within a second.

## Where `oe` comes from

| How you installed ObjectExplorer | `oe` is                                           |
|----------------------------------|---------------------------------------------------|
| Homebrew (`objectexplorer`)      | on your PATH beside `objectexplorer`              |
| The macOS or Linux tarball       | a link to `objectexplorer` in the same folder     |
| The Windows zip                  | `oe.exe` and `oe.com` beside `ObjectExplorer.exe` |
| npm                              | on your PATH beside `objectexplorer`              |

`objectexplorer` takes the same commands when a command comes first: `objectexplorer settings list`.

## Settings

Every value a settings pane shows has a name. `oe settings list` prints them all with their values;
`get` prints one, `set` changes one.

```sh
oe settings list
oe settings get cache.limit
oe settings set cache.limit 20
oe settings set mcp.limits.rowsPerCall 500
```

| Name                         | Pane         | Values                                                     |
|------------------------------|--------------|------------------------------------------------------------|
| `theme`                      | General      | `dark`, `light`                                            |
| `folders`                    | Local folder | the folders and buckets in the tree                        |
| `hidden`                     | Local folder | folders kept out of the tree                               |
| `off`                        | Sign-ins     | services turned off: `gcs`, `s3`, `azure`, `onelake`       |
| `cache.limit`                | Cache        | whole gigabytes, 1 or more                                 |
| `writing.show_passages`      | Writing tool | `true`, `false`                                            |
| `writing.show_phrases`       | Writing tool | `true`, `false`                                            |
| `writing.show_flags`         | Writing tool | `true`, `false`                                            |
| `mcp.enabled`                | MCP          | `true`, `false`                                            |
| `mcp.follow`                 | MCP          | `true`, `false`                                            |
| `mcp.debounceMs`             | MCP          | 10 to 2000                                                 |
| `mcp.keepDays`               | MCP          | 1, 7, 30, 90, 365, or 0 to keep every session              |
| `mcp.tools`                  | MCP          | the tools agents may call                                  |
| `mcp.deny`                   | MCP          | the patterns no agent may read                             |
| `mcp.roots`, `mcp.approve`   | MCP          | JSON, as in [the MCP rule file](/reference/mcp-rules)      |
| `mcp.limits.<limit>`         | MCP          | each limit of the rule file: a number, or a size as `64MB` |
| `pii.columns`, `pii.text`    | PII          | JSON: the rules, as in the rule file                       |
| `python.<venv>.spark.cores`  | Python       | a whole number, for each Python environment                |
| `python.<venv>.spark.memory` | Python       | whole gigabytes, for each Python environment               |

A list value takes several words, `oe settings set off s3 azure`, and none clears it:
`oe settings set hidden`. A relative folder is taken from where you are. A JSON value is one
quoted word, or a file: `oe settings set pii.columns --file rules.json`.

`list` prints a line a setting, a list or JSON value as JSON; `get` prints a list one item a line.
Add `--json` to either for JSON.

## Actions

Some panes have buttons rather than values. Each button is a command.

| Command                                  | What it does                                                                                                          |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `oe folder add <path …>`                 | add folders or buckets (`s3://name`) to the tree; `remove` takes them out                                             |
| `oe signin aws`                          | an access key: the IAM console's accessKeys.csv, or the key ID and the secret                                         |
| `oe signin google`                       | a service account's JSON key; `--browser` signs in with Google instead                                                |
| `oe signin microsoft`                    | a storage account's connection string or SAS URL; `--browser` signs in with Microsoft instead                         |
| `oe signin s3 <name> --endpoint <url>`   | a custom S3 store (MinIO, R2 …): its access key and secret; `--anonymous` keeps none, `--description` says what it is |
| `oe python venv create <name> [version]` | a new Python environment; `delete <name>` and `list` too                                                              |
| `oe cache clear`                         | delete the local copies of cloud objects                                                                              |
| `oe mcp install claude`                  | connect Claude Code; `codex` for Codex; `--off` disconnects                                                           |
| `oe writing add <url>`                   | a writing source; `remove <url>`, `list`, and `reindex [url]`, which waits until it is done                           |
| `oe plan status`                         | your plan; `signin` (Google, in the browser) and `signout` too                                                        |
| `oe check`, `oe upgrade`, `oe rollback`  | [updating](/reference/updating)                                                                                       |

A key is checked before it is kept, as the pane checks it: one that is refused is said and not kept.

A secret is never taken from the command line itself, where it would stay in your shell history.
Point `--file` at it, pipe it in, or paste it when asked and end with Ctrl-D. It goes straight to the
system keychain. On Windows, use `--file`.

## 3D models

`oe model` prints what a model is made of, for glTF, FBX, Blender and Wavefront files.

```sh
oe model robot.glb info
oe model robot.glb vertices --piece arm --rows 0:100
oe model robot.glb faces --json
```

| Part        | One row per                                                                                                    |
|-------------|----------------------------------------------------------------------------------------------------------------|
| `info`      | fact about the model: format, name, pieces, vertices, faces, triangles, materials, bones, millimetres per unit |
| `vertices`  | vertex: x, y, z                                                                                                |
| `normals`   | vertex: its normal                                                                                             |
| `uvs`       | vertex: u, v                                                                                                   |
| `colors`    | vertex: r, g, b, its material's colour                                                                         |
| `faces`     | face: its piece and the numbers of its vertices, in order                                                      |
| `pieces`    | piece: name, material, first face, faces, first triangle, triangles                                            |
| `materials` | material: name, colour (r, g, b, a), metallic, roughness, images                                               |
| `skeleton`  | bone: name, parent (-1 at the top), where its head is                                                          |
| `box`       | corner of the box around the model: min and max                                                                |

Rows come out as CSV, ready for a spreadsheet or pandas; `--json` gives JSON instead. `--piece` keeps
one piece and `--rows a:b` the rows a to b - 1, counted from 0 (`a:` to the end, `:b` from the start).
Y is up and the units are the model's own.

A vertex is numbered as the file numbers it: a Wavefront file's own numbers, from 0, and in another
format in the order the model first uses them. `--piece` keeps those numbers, so the faces of a piece
point at the same vertices as the whole model's. A vertex on a seam has more than one normal or uv;
the first is printed.

## What comes back

What you asked for goes to the output, and anything said about it goes to the error stream, so a pipe
only carries data. The exit code says how it went:

| Code | Meaning                                             |
|------|-----------------------------------------------------|
| 0    | done                                                |
| 1    | it failed: a key refused, a file that does not read |
| 2    | the command was written wrong; usage follows        |
| 7    | no such setting, file or piece                      |

`oe help` lists the commands, and `oe help <command>` (or `--help` after any command) explains one.
