# Flame graphs

`folded` `collapsed`

A folded stack profile — one line per distinct stack with its sample count, the format FlameGraph's
`stackcollapse` scripts write — opens as a flame graph.

- **The three hottest functions** are named at the top, and outlined in the flame.
- **A timeline** of the samples, in the order the file lists them, that you can drag across to look
  at one run of them. `Esc` puts the whole profile back.
- **The flame**, root at the bottom or at the top, with idle threads hidden by default so the work is
  not buried under the waiting.
- **The full stack** of whatever the pointer is on, or of the frame you clicked, each frame with two
  percentages: its share of the samples, and the share spent in it alone.

When the file's first line is a `#` comment holding JSON metadata — the sample rate and the runs —
the profile is read in milliseconds instead of samples.

Next: [keyboard shortcuts](/reference/shortcuts).
