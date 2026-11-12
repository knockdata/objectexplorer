# Node.js and Java cells

A notebook can run JavaScript in Node.js and Java beside its SQL and Python, with the packages and
libraries of those languages. In the desktop app and on a server of your own; the page at
objectexplorer.com/app runs no code.

**Node.js** and **Java** are two of the kinds in a cell's toolbar — see [the notebook](/analyze/notebook).

## How they run

Each notebook has a Node.js process and a Java one of its own, started at its first cell of that
kind and kept running beside the app, so what one cell declares the next one sees. A cell runs where
its notebook is, when that is on this disk. What it printed shows under it, then its value or its
error.

- **Node.js**: the last expression of a cell is its value; `console` output shows above it. Running
  a cell again replaces what it declared.
- **Java**: through jshell's own library, a cell cut into statements and declarations run in turn;
  declaring a class again replaces it. The value of a cell's last expression is shown.

They do not read the rows of the cell above, as SQL, Chart and Code cells do: a kernel is a process
of its own, as a Python session is.

## Settings → Notebook Kernels

The **Notebook Kernels** group holds **Python** — see [Python](/analyze/python) — and these two.

**Node.js** shows the `node` and `npm` found on this machine, or a link to download Node.js. Every
JavaScript cell requires and imports from one project's `node_modules`, whichever folder its
notebook is in: type an npm command and press **Install**, and a cell can use the package at once.
The list under it uninstalls one.

**Java** shows the JDK and Maven found (`brew install openjdk@21`, `brew install maven` on a Mac).
Every Java cell runs with one Maven project's dependencies: type `groupId:artifactId:version`, such
as `com.google.code.gson:gson:2.11.0`, and press **Add**; Maven fetches it from Maven Central the
first time, and a Java process running already starts again at its next cell. Without Maven, cells
run with no dependency.

The projects live in [the app's folder](/reference/data-locations), under `data/kernels/`.

Next: [charts](/analyze/charts).
