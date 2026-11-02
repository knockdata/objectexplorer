# Programs and libraries

`exe` `dll` `sys` `efi` `so` `dylib` `o` `a` `lib` `wasm` `class` `pyc`, and a program with no
extension at all

<img src="/screenshot/format-program.png" alt="A Windows program in structure mode: its DOS header, PE header, optional header, section table and each section with its offset and size">

What a compiler and a linker write opens laid out as its structure: the headers, the sections and
what each holds, at their offsets in the file — no `objdump`, `otool` or `dumpbin`, and on any
platform, whichever one the file was built for. Which kind of file it is, its bytes decide, so a
program with no extension opens the same way.

| File                                              | What it shows                                                                                                                 |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Windows `exe` `dll` `sys` `efi`, and COFF objects | the machine and flags, the sections, the DLLs it imports from, its exports, its version strings; a .NET assembly's references |
| Linux ELF: programs, `so`, `o`, core dumps        | the machine and type, the sections and segments, the interpreter, the libraries it needs, its symbols                         |
| Apple Mach-O: programs, `dylib`, bundles, `o`     | the processor, load commands, segments and sections, linked libraries, symbols; each architecture of a universal file         |
| static and import libraries, `a` `lib`            | its members and what each exports; for an import library, the DLL each function comes from                                    |
| WebAssembly `wasm`                                | its sections, types, imports, exports, functions by name, and data                                                            |
| Java `class`                                      | the class, its fields and methods written as Java writes them, and its constant pool                                          |
| Python 3 `pyc`                                    | the Python version it was compiled for, and its code objects with their names and constants                                   |

Each opens on **structure**, then as JSON and as a table of the same fields; [hex](/explore/hex) is
always there. Names are given as the format gives them — `NX_COMPAT`, `EXECINSTR`, `LC_SEGMENT_64`
— and a list longer than 20,000 names stops there and says so.

It is the file's layout, not its code: nothing is disassembled or decompiled, and a signature is
noted, not checked. A `.jar`, `.apk` or `.whl` is a zip, and its classes open this way from inside
it — see [archives](/explore/archives).

## Developer files

What a developer's tools write opens as a **table**, each told by its contents whatever it is called,
so a `.json` that is a source map or a `.yaml` of Kubernetes objects opens as one. Every table is
read by [SQL](/analyze/sql) too.

| File                                                     | Files                                                   | A row for                                                            |
|----------------------------------------------------------|---------------------------------------------------------|----------------------------------------------------------------------|
| an Apple crash report                                    | `ips` `crash`                                           | each frame of each thread, the crashed thread marked                 |
| a source map                                             | `map`                                                   | each mapping, from generated line and column to the source's         |
| a CPU profile from Node or Chrome, Chrome's trace events | `cpuprofile`, `json`                                    | each stack; it opens as a [flame graph](/formats/flame-graphs) first |
| a package manager's lockfile                             | `package-lock.json` `yarn.lock` `Cargo.lock` `go.sum` … | each package: name, version, source, checksum                        |
| a SARIF log                                              | `sarif`                                                 | each result: tool, rule, level, message, file and line               |
| JUnit test results                                       | an `xml`                                                | each test case: suite, class, name, time and outcome                 |
| a Terraform state, version 4                             | `tfstate`                                               | each resource                                                        |
| Kubernetes manifests                                     | a `yaml`                                                | each object: kind, name, namespace, labels and images                |
| a diff or a patch                                        | `diff` `patch`                                          | each file changed: its path, status and lines added and deleted      |

A diff opens drawn, the way a code review shows one: the files changed on top, then each file's
hunks, the lines taken out in red and the ones put in in green, with their old and new line numbers.
A patch mailed by `git format-patch` shows its subject, author, date and message first.

A lockfile is npm's, yarn's, pnpm's, Cargo's, Poetry's, uv's, Bundler's (`Gemfile.lock`) or Go's.
SARIF (the Static Analysis Results Interchange Format) is what code scanners write their findings
in. A cut-short lockfile, SARIF log or Terraform state is read up to its last whole entry.

Next: [disk images and packages](/formats/disks).
