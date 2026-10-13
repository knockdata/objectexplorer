# Cloud Logging

A Google Cloud project can be tailed live, and ObjectExplorer copies its Cloud Logging entries into a
local log file: the tail belongs to the app, not to the window, so it keeps collecting while you are
elsewhere and starts again after a restart.

Run **Cloud Logging: Tail a Project Live** from the command palette and type the project id. A filter
in the Logging query language can follow it — `acme-prod severity>=ERROR` keeps only the errors. The
tail reads the last hour first, then asks for what is newer every 10 seconds, and writes it to
`~/.objectexplorer/logs/<project>.log`. **Cloud Logging: Open a Live Tail** opens one you started
before. It signs in with your Google Cloud sign-in, and only on the machine the app runs on.

The viewer shows the project as live, with a **stop** button. Stopping ends the tail and keeps what it
gathered. The tree under the project is the one the logs describe — resource type, resource, then the
single stream.

Any `.log` file opens in the same viewer: Cloud Logging entries, an OpenTelemetry export, JSON lines,
or a plain text log.

Log files that a sink already exported to a bucket open the same way. Click one NDJSON object, or any
level of the export — the log id, a year, a month or a `YYYY/MM/DD` day — and the viewer walks it
newest first, showing the lines as each file arrives. It reads at most 20 files or 50,000 lines, so a
year of retention is not downloaded. Cloud Logging entries and OpenTelemetry records both read as the
same rows.

## The viewer

- **A timeline you can grab** — one bar per slot, grey for ordinary lines, orange for warnings, red
  for errors, so a burst of errors is a red block. Drag to pick a range, click a bar for that slot,
  zoom and step window by window.
- **Two trees over the same lines** — *source* answers "which service wrote this", *trace* answers
  "what happened during this request", drawn as a waterfall of spans by duration.
- **Filter as you read** — severity chips and text search narrow the rows, never the shape of the
  timeline you are aiming at.

Next: [writing](/analyze/writing).
