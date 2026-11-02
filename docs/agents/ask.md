# Ask an agent

<img src="/screenshot/ask-side.png" alt="A Parquet table open, and the agent side bar right of it: Gemini's plan ticked off in place, a Read and a Run step with what they answered, and a card asking to allow an edit of notes.md">

Right-click a file or a folder in the tree and pick **Ask…** (or **Ask Claude…**, when only one or
two agents are ticked). A side bar opens right of the panes
with the agent you picked working in that folder (the file's own folder for a file), and the input
starts with the file's name. Type what you want to know and press Enter.

It is your own agent: the command line you installed, signed in as you, with your settings.
ObjectExplorer starts it and shows the conversation; it does not answer for it.

## Who answers

**Settings → Ask** lists who may answer, a tick each:

| Agent         | What runs                                           |
|---------------|-----------------------------------------------------|
| **Claude**    | `claude`, Claude Code's command line                |
| **ChatGPT**   | `codex-acp` when it is installed, else `codex exec` |
| **Gemini**    | `gemini --acp`                                      |
| **Copilot**   | `copilot --acp`, GitHub Copilot's command line      |
| **Ollama**    | the Ollama server at `http://127.0.0.1:11434/v1`    |
| **llama.cpp** | its server at `http://127.0.0.1:8080/v1`            |

<img src="/screenshot/ask-settings.png" alt="Settings → Ask: Claude, Gemini and Copilot ticked and Ready, ChatGPT not found with a Steps line saying how to install codex-acp, Ollama and llama.cpp not answering, and the + Add URL and + Add CLI buttons">

A row says in a word whether its agent is ready: **Ready**, **Not found**, **Not answering**,
**Needs a key**. Those found are ticked at the start; **Detect Again** looks once more. A command line
is looked for on your PATH, then in the folders its installer uses (the ChatGPT app's own `codex`
among them). One that is somewhere else is picked with **Locate…**, run once with `--version` to see
that it runs, and kept. The **?** at the end of a row says what it runs and where it was found.

ChatGPT shows its steps and asks its permissions only through `codex-acp`, an adapter installed
apart. The **Steps** line under its row says whether it was found, and how to install it:

```
npm install -g @agentclientprotocol/codex-acp
```

Without it, `codex exec` answers once per question, in one block at the end.

Two buttons add more:

- **+ Add URL** — a name, the URL of any service that answers the OpenAI chat API (LM Studio, a
  server of your own), and its API key if it needs one. Its row then has the model, picked from
  the ones it lists. The key is kept in the system keychain, never in the settings or a log; a key
  written into the URL is taken out of it and kept there too.
- **+ Add CLI** — a name, the program (its name on the PATH, or picked with **Locate…**) and the
  arguments it takes before the question. It is run in the folder you ask about as
  `<program> <arguments> "<question>"`, its output shown as it prints.

**Remove**, the bin on an added row, takes it away again.

### The menu

With one or two agents ticked, a file's or folder's menu has an item each: **Ask Claude…**,
**Ask Gemini…**. With three or more it has one **Ask…**, which opens a ring of their icons where
the menu was let go; its centre, or Enter, picks the first.

<img src="/screenshot/ask-ring.png" alt="The Ask ring over the tree: Claude, Copilot and Gemini, each with its icon">

### How the steps are shown

Claude, Gemini and Copilot show each step as it happens. Gemini and Copilot, and ChatGPT through
`codex-acp`, do it over ACP (Agent Client Protocol, an open protocol an editor uses to talk to a
coding agent): one process for the whole conversation, which sends its steps and asks before what
needs your permission. A version too old for ACP, and a command line you added, is asked once per
question instead: its answer shows when it ends, and what would change your files is refused.

Ollama, llama.cpp and a URL you added are not agents: they are sent the file's first 64 KB, or a
folder's names, with your first question, and answer as a chat.

## The conversation

Each step is on a line down the left, with the time it ended: what you asked, the agent's text as
it writes it, and each tool it runs with what it was given (**IN**) and what it answered (**OUT**).
Its thinking is a step closed to its first line; a click opens the rest. Its plan is one step,
its items ticked off in place as it works through them.

While the agent works, a line under the last step says what it does now: **Thinking**,
**Running** a tool, or **Waiting for you**.

- **Enter** sends, also while the agent is still working — it answers that next. **Shift+Enter** is
  a new line, and **↑** and **↓** bring back what you asked before.
- The stop button stops the answer; the conversation goes on. **+** starts a new conversation; the
  ✕ or Escape closes the side bar. A click elsewhere never closes it.
- While it is open, a file's or folder's menu has **Append to Claude Session** (or the agent's name),
  which adds that entry to the same conversation.
- Once an answer ends, a file the agent edited is shown again as it is now.
- While Claude runs helpers of its own, their count is in the header, and each one is a row you can
  open to see its own steps.
- In the page `objectexplorer` serves, the pop-out icon moves the side bar to a browser tab of its
  own, the whole width, still following the same conversation.

### Permissions

What the agent asks to be allowed waits as a card above the input: **Allow**, **Always Allow**
(kept in that agent's own settings), or **Deny**, with what to do instead typed in the box above
them. A question Claude asks shows its options, with **Answer** or **Skip**; a plan shows
**Approve** or **Keep Planning**.

### The open tab

Above the input, a chip names the tab you have open. It is told to the agent with each question, so
"what does this column mean?" needs no file name. The eye on the chip leaves it out, or tells it
again. A chat about a text, and Ollama or a URL you added, are not told: they cannot open it.

### The mode

At the right above the input, the mode button shows how freely the agent works. A click lists its
modes, the current one ticked; **Shift+Tab** in the input picks the next. It changes at once, also
while the agent works, and it follows the agent when the agent changes it itself.

| Claude's mode          | What Claude does                                                 |
|------------------------|------------------------------------------------------------------|
| **Auto mode**          | decides what is safe to do, and asks only for what is not        |
| **Ask before edits**   | asks before it edits a file or runs a command                    |
| **Edit automatically** | edits files without asking, and asks before a command            |
| **Plan mode**          | reads and makes a plan, and changes nothing until it is approved |
| **Bypass permissions** | does everything without asking                                   |

Claude starts in **Auto mode**. An ACP agent lists its own modes once its conversation has started
(Gemini's **Default** in the picture above). A chat and an endpoint have no mode.

### A turn cut short

If the app's server stops while Claude answers and starts again, the conversation is still there,
and its last step says **The server restarted: Claude's turn ended here**. What Claude started in
the background (a build) may still be running. Write to go on: the next question resumes the same
conversation.

## What the agent reads

On a folder of your own disk, the agent works in that folder with its own tools and reads every file
as it is. Claude reads the folder without changing it; the line under the header says so. Gemini,
Copilot and ChatGPT ask before each change, as a card.

On a Google Cloud Storage bucket, an S3 or Azure folder, and on a local folder ticked **Agents read
through PII** (Settings → Locations → Local folder), the agent works differently. It starts in an
empty folder of its own, and reaches the files only through the app's MCP (Model Context Protocol)
server, opened for that one conversation, so every value it reads passes the
[PII rules](/agents/pii) first. This works with Settings → MCP turned off, and lets no other agent in.
A local folder holding `.git` (code) starts unticked, any other ticked.

- Claude gets no tool of its own there: no file read, no shell.
- Gemini, Copilot and ChatGPT get the server in their session, but keep their own file tools in
  their empty folder.
- Ollama, llama.cpp and a URL you added are told the entry as the server reads it.
- A command line you added gets the question alone.

The rules are the ones in Settings → PII, kept in the [rule file](/reference/mcp-rules): until one
is written (Settings → MCP → **Write a Starting Rule File**), there is nothing to apply. A file the
agent asks for as it is — a picture to look at, through `getRawFile` — is sent without them.

Everywhere else, Ask is your data going to the agent you picked, and the PII rules are not applied.
Claude, ChatGPT, Gemini and Copilot may send what they read to their company's servers.

The side bar is in the desktop app and in the page `objectexplorer` serves on your machine, not in
the instant page at objectexplorer.com/app.

## Lines of a text file, or any selected text

Right-click lines in a text file and **Ask Claude…** opens the side bar on those lines and the five
before and after them. Select text anywhere the app has no menu of its own, right-click, and **Ask
Claude…** does the same for that text. Both are a chat: Claude answers from the text it was given,
with no tool and nothing else read.

## Duplicated code

The **Code Duplication** activity in the bar on the left finds the same block of code in more than
one place: CSS, JavaScript, JSX and C. A folder's menu has **Find Code Duplication**, and the panel
has **Find in All Folders**. Above the results: the files to include (`*.css` at first), remote
storage to search in full, files to exclude with **Use Ignore Files**, and a slider for the fewest
lines a block must have.

Each block is listed with its copies by file and line. A click opens that copy at its first line.
Right-click a block for **Ask Claude to Refactor…** or **Ask Claude to Merge…**: the side bar opens
with the copies and where each is used, and Claude may change the files in the copies' folder.

**References**, in a text file's toolbar, lists under the caret's line where the code there is used,
in the files of the same folder: a CSS rule's classes and ids in HTML, JavaScript and JSX, and a
JavaScript, JSX or C name wherever it appears.

Next: [agentic tasks](/agents/tasks).
