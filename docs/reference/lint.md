# Lint

**Lint** is an activity for people working on ObjectExplorer's own source. It is hidden in the
released app, shows in a build made from the source, and `dev=true` shows it in any build
(`dev=false` hides it). It runs on macOS only.

It is a static checker for C code that owns memory: it finds leaks, double frees, use after free,
and pointers into a memory arena that outlive the arena. It needs the source checkout, Homebrew's
LLVM, Graphviz and uv.

## Running it

1. **Run lint** builds what the checker needs and checks the code. The panel shows each command and
   what it prints while it runs, and keeps the commands, the time of each stage and the verdict
   afterwards.
2. Every finding is listed by check, with counts: new ones as they are, reviewed ones in green,
   trusted ones grey.
3. A finding opens as a tab: its path on the call graph beside the code of each step, three lines
   around its line. The allocation is green, each transfer blue, the conflict red. A step clicked in
   the graph scrolls its code into view and the other way round. **Expand** shows the whole file in
   an editor, and `⌘S` saves it.
4. **Mark safe** asks for a reason and a status — false positive, accepted, or won't fix — and
   records it, so the finding turns green at once and is not counted as new again.
5. **Run again** checks everything again, after an edit too.

Next: [where your data lives](/reference/data-locations).
