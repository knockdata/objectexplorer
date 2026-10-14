# The command line

ObjectExplorer is one program, `objectexplorer`, and its command line has two halves:

- **Starting it.** `objectexplorer` with `name=value` arguments, or none, starts a server and opens
  the app in your browser, or the desktop window with `window=true`.
- **Commands.** Everything you set in **Settings** can be set from a terminal too, with `oe`, a
  short name for the same program. Started with a command, it does that one thing and exits; it
  never opens a window.

```sh
oe settings set theme light
oe signin aws --file ~/keys/accessKeys.csv
oe mcp install claude
```

A window that is already open follows the change within a second.

## Starting it

```sh
objectexplorer                                    # a server on http://127.0.0.1:9421, and the browser opened on it
objectexplorer ~/data                             # the same, with ~/data opened
objectexplorer open=false                         # without opening the browser
objectexplorer http_port=8080 host=0.0.0.0        # reachable from other machines, with sign-in
objectexplorer window=true ~/data                 # the desktop window, from a terminal
objectexplorer connect=https://oe.example.com     # a window connected to a server
objectexplorer --version
```

`npx @knockdata/objectexplorer` passes its arguments on as they are, so everything here works the
same through npx.

| Argument     | Default                         | What it does                                                                                      |
|--------------|---------------------------------|---------------------------------------------------------------------------------------------------|
| `http_port=` | `9421`                          | the port; `0` takes any free one                                                                  |
| `host=`      | `127.0.0.1`                     | where it listens; `0.0.0.0` lets other machines in, and then they must sign in                    |
| `open=`      | `true`                          | `false` does not open the browser                                                                 |
| `window=`    | as started                      | `true` the desktop window, `false` the command line                                               |
| `folder=`    |                                 | a folder for the tree on the first run; give it once per folder                                   |
| `connect=`   |                                 | the window as a client of that server                                                             |
| `token=`     |                                 | the session the server knows this window by; kept in the keychain after                           |
| `mode=`      | `full`                          | `instant`: one read-only folder, nothing signed in — see [instant mode](/reference/instant-mode)  |
| `cloud=`     | `on`                            | `off`: no cloud storage is offered or can be added                                                |
| `record=`    | a new file                      | where this window's session is recorded; `false` records nothing                                  |
| `replay=`    |                                 | a recording played back into the window — see [recording a session](/reference/session-recording) |
| `config=`    | `~/.objectexplorer/server.json` | a server's settings, as JSON                                                                      |

A server takes more: `https_port=`, `tls=`, `domain=`, `public=`, `licence=`, `base=` and `data=`,
all on [running your own server](/self-hosting/).

A word with no `=` is a folder or a file to open. An argument it does not know is refused, with the
list.

How it starts when nothing says: opened from Finder, the Start menu or the Linux application menu, it
is the window; started from a terminal, by npx or by Homebrew's service, it is the command line.

## Where `oe` comes from

| How you installed ObjectExplorer | `oe` is                                           |
|----------------------------------|---------------------------------------------------|
| Homebrew (`objectexplorer`)      | on your PATH beside `objectexplorer`              |
| The macOS or Linux tarball       | a link to `objectexplorer` in the same folder     |
| The Windows zip                  | `oe.exe` and `oe.com` beside `ObjectExplorer.exe` |
| npm                              | on your PATH beside `objectexplorer`              |
| The desktop app                  | wherever **Shell Command: Install 'oe'** put it   |

The desktop app puts `oe` on your PATH from the command palette (⇧⌘P): **Shell Command: Install 'oe'
command in PATH**. On macOS that is a link in `/usr/local/bin`, after your password when the folder
needs it; on Linux a link in `~/.local/bin`, which must be on your PATH; on Windows the app's own
folder, which holds `oe.exe`, is added to your PATH. A file named `oe` that is not ObjectExplorer's
is left alone, and the install says so. **Shell Command: Uninstall 'oe' command from PATH** takes it
away again.

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
| `server.roots`               | Admin        | the folders and buckets other machines may reach           |
| `server.remote_python`       | Admin        | `true`, `false`: other machines may run Python cells       |
| `server.remote_web`          | Admin        | `true`, `false`: other machines may fetch writing sources  |

A list value takes several words, `oe settings set off s3 azure`, and none clears it:
`oe settings set hidden`. A relative folder is taken from where you are. A JSON value is one
quoted word, or a file: `oe settings set pii.columns --file rules.json`.

`list` prints a line a setting, a list or JSON value as JSON; `get` prints a list one item a line.
Add `--json` to either for JSON.

## Actions

Some panes have buttons rather than values. Each button is a command.

| Command                                   | What it does                                                                                                          |
|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `oe folder add <path …>`                  | add folders or buckets (`s3://name`) to the tree; `remove` takes them out                                             |
| `oe signin aws`                           | an access key: the IAM console's accessKeys.csv, or the key ID and the secret                                         |
| `oe signin google`                        | a service account's JSON key; `--browser` signs in with Google instead                                                |
| `oe signin microsoft`                     | a storage account's connection string or SAS URL; `--browser` signs in with Microsoft instead                         |
| `oe signin s3 <name> --endpoint <url>`    | a custom S3 store (MinIO, R2 …): its access key and secret; `--anonymous` keeps none, `--description` says what it is |
| `oe python venv create <name> [version]`  | a new Python environment; `delete <name>` and `list` too                                                              |
| `oe cache clear`                          | delete the local copies of cloud objects                                                                              |
| `oe mcp install claude`                   | connect Claude Code; `codex` for Codex; `--off` disconnects                                                           |
| `oe writing add <url>`                    | a writing source; `remove <url>`, `list`, and `reindex [url]`, which waits until it is done                           |
| `oe pii reveal '<PERSON_17>'`             | the real value of a pseudonym, after your login; `reveals` lists every ask (below)                                    |
| `oe plan status`                          | your plan; `signin` (Google, in the browser) and `signout` too                                                        |
| `oe licence <file or token>`              | install a licence                                                                                                     |
| `oe check`                                | this copy, the version in use, what is installed and the latest release; changes nothing                              |
| `oe upgrade [version]`                    | install a version beside the others and make it the one in use — see [updating](/reference/updating)                  |
| `oe rollback [version]`                   | make an installed version the one in use again                                                                        |
| `oe versions`                             | every installed version, the one in use marked `*`                                                                    |
| `oe version`                              | this copy's version, alone on a line                                                                                  |
| `oe sso show [domain=<name>]`             | how people sign in to this machine's server, and the addresses to register — see [sign-in](/self-hosting/#sign-in)    |
| `oe sso oidc issuer=<url> client_id=<id>` | OIDC sign-in, the client secret read from `--file` or the input — see [OIDC](/self-hosting/sign-in-oidc)              |
| `oe sso saml metadata=<url or file>`      | SAML sign-in — see [SAML](/self-hosting/sign-in-saml)                                                                 |

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

## Revealing a pseudonym

```sh
oe pii reveal '<PERSON_17>'
oe pii reveals
```

`oe pii reveal` is **Settings → PII → Reveal** on the command line: the system asks for your login
first (Touch ID or the password on macOS), then the real value is printed. Quote the token, or the
shell reads `<` and `>` as redirections. Every ask, answered or not, is a line in
`~/.objectexplorer/mcp/reveal.ndjson`, marked as asked from the command line, without the value;
`oe pii reveals` lists them, newest first: when, the token, who asked, the user, what the login
said, and whether the token was found. Windows and Linux cannot ask for the login yet, so there
nothing is revealed. `--json` prints JSON.

## Reading as an agent

An agent with a shell can read through `oe` instead of speaking MCP. Each command is one call through
the [MCP door](/agents/connect) of the running app, with the agent's own token, so what it gets is
exactly what the same call over MCP would get: the same roots, deny rules and
[PII rules](/agents/pii), the same budget, and a line in the same [session log](/agents/sessions).
The app keeps every credential; `oe` holds only the token.

```sh
export OE_TOKEN=7f2a1c4e9b8d3a6f5e0c2b7d4a9f1e83   # Settings → MCP → Tokens
oe ls                                    # the roots this agent may reach
oe ls reference/data                     # a folder: uri, type, size
oe stat reference/data/stations.csv
oe schema reference/data/stations.csv
oe cat reference/data/stations.csv --rows 0:100
oe search reference/docs 'invoice'
oe get reference/data/stations.csv -o stations.csv
```

| Command                     | MCP tool                   | Prints                                                   |
|-----------------------------|----------------------------|----------------------------------------------------------|
| `oe ls [uri]`               | `listRoots`, `listObjects` | a root a line, or a folder's objects: uri, type, size    |
| `oe stat <uri>`             | `describeObject`           | kind, type, size, time, content type and columns         |
| `oe schema <uri>`           | `columnSummary`            | a table's columns as CSV, measured after the PII rules   |
| `oe cat <uri> [--rows a:b]` | `getObject`                | a table as CSV, text as text, a tree as JSON             |
| `oe search <uri> <pattern>` | `searchText`               | `uri:line:text`, as grep prints, the text sanitized      |
| `oe get <uri> [-o file]`    | `getObject`, page by page  | nothing: the whole sanitized copy is written to the file |

The app must be open with MCP turned on, and each tool must be ticked for the agent. A URI is the
one an agent uses over MCP: `root/key` for a folder of the window, `s3://bucket/key` and so on.
`cat` reads one page (the rule file's `rowsPerCall` rows, or 500 lines); `--rows a:b` picks rows, or
lines, a to b - 1. `get` reads every page, and with no `-o` names the file after the object, adding
`.csv`, `.json` or `.txt` when what came back is that rather than the original format.

Data goes to the output and `note:` lines to the error stream: how many objects a listing hid, that
more rows follow and the command that reads them. `--json` prints one envelope instead, failures
too:

```json
{ "data": { …the tool's answer… }, "notes": ["…"], "status": "ok", "next": ["oe cat reference/data/stations.csv --rows 1000:", "oe get reference/data/stations.csv"] }
```

`status` is `ok`, `denied`, `budget`, `too large`, `not found`, `closed` or `failed`, as the exit code.

## What comes back

What you asked for goes to the output, and anything said about it goes to the error stream, so a pipe
only carries data. The exit code says how it went:

| Code | Meaning                                                                 |
|------|-------------------------------------------------------------------------|
| 0    | done                                                                    |
| 1    | it failed: a key refused, a file that does not read                     |
| 2    | the command was written wrong; usage follows                            |
| 3    | denied by a rule (an agent's read), or the login not confirmed (reveal) |
| 5    | the agent's budget is spent: calls a minute, bytes a session or a day   |
| 6    | over a size limit: `bytesPerCall`, `maxObjectBytes`                     |
| 7    | no such setting, file, piece, object or token                           |
| 8    | the MCP door is closed, or `OE_TOKEN` is not a token this app made      |

`oe help` lists the commands, and `oe help <command>` (or `--help` after any command) explains one.
