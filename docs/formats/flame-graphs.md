# Flame graphs

`folded` `collapsed`

A folded stack profile — one line per distinct stack with its sample count, the format FlameGraph's
`stackcollapse` scripts write — opens as a flame graph.

- **The three hottest functions** are named at the top, and outlined in the flame.
- **A timeline** of the samples, in the order the file lists them, that you can drag across to look
  at one run of them. `Esc` puts the whole profile back.
- **The flame**, root at the bottom or at the top, with idle threads hidden by default so the work is
  not buried under the waiting.
- **The full stack** of whatever the pointer is on, each frame with two percentages: this call site,
  and the same function summed over every call site.

When the file's first line is a `#` comment holding JSON metadata, the profile is read in
milliseconds instead of samples.

Next: [keyboard shortcuts](/reference/shortcuts).
