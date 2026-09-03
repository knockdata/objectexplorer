# Cloud Logging

A Google Cloud project can be switched live, and ObjectExplorer tails Cloud Logging into a local
store: the tail belongs to the app, not to the window, so it keeps collecting while you are elsewhere
and is still there after a restart. The tree under the project is the one the logs describe —
resource type, resource, then the single service.

Log files that a sink already exported to a bucket open the same way. Point at one NDJSON object, or
at the whole `YYYY/MM/DD` prefix, and the viewer walks it newest first. Cloud Logging entries and
OpenTelemetry records both read as the same rows.

## The viewer

- **A timeline you can grab** — one bar per slot, grey for ordinary lines, orange for warnings, red
  for errors, so a burst of errors is a red block. Drag to pick a range, click a bar for that slot,
  zoom and step window by window.
- **Two trees over the same lines** — *source* answers "which service wrote this", *trace* answers
  "what happened during this request", drawn as a waterfall of spans by duration.
- **Filter as you read** — severity chips and text search narrow the rows, never the shape of the
  timeline you are aiming at.

Next: [every format](/formats/).
