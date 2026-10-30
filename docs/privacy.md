# Your data stays here

This is the part that matters when you work with data you are not allowed to copy.

ObjectExplorer is one native program on your machine. Every reader — Parquet, SPSS, SAS, PDF, the
office formats, the image and media decoders — runs on your own machine, in the app itself. Started
from a terminal, it serves the app to your browser from `127.0.0.1`, which nothing else on your
network can reach.

- Objects are fetched **from your cloud provider to your computer**, and nowhere else. We run no
  backend that sees your data, because there is nothing for it to see.
- Credentials stay local, in the system keychain. Nothing is synced — see
  [where your data lives](/reference/data-locations).
- The calls that are not to your own storage are few, listed below, and none of them carries an
  object unless you send one to us yourself.
- Nothing is uploaded for "processing", no file names are reported on their own, and no account
  is needed to open a file.

Which also means there is no data-processing agreement to negotiate before anyone can look at a
bucket.

## What does leave, and when

**A share link, when you make one.** [Sharing a table](/explore/share) sends rows to whoever opens
the link, and it never happens on its own: you open the dialog, decide column by column what goes —
each column opening on what your [PII rules](/agents/pii) already say — and copy the link. Small shares travel inside the link's fragment, which no server ever sees. A bigger one, and
every read-and-burn link, is stored on objectexplorer.com until it expires.

**What you ask an assistant.** **Ask…** in a file's menu hands the file to the assistant you picked
— Claude, ChatGPT, Gemini, or one that runs on this machine such as Ollama — through that
assistant's own program or address, under its own terms. It happens only when you pick it, and
only to the one you picked.

Everything else the app asks of the outside world is listed here. None of it carries a row of your
data or a path on this machine, except a file you send us yourself.

| Call                                          | When                                                                        |
|-----------------------------------------------|-----------------------------------------------------------------------------|
| GitHub: what is the newest release?           | when you open **Settings → Check for Updates**, and only then               |
| GitHub: the new version itself                | when you press **Update** — see [updating](/reference/updating)             |
| uv: a Python build, and the packages you name | when you make a [Python environment](/analyze/python) or install into one   |
| The web pages you added as style sources      | when you add or reindex one in [the writing tool](/analyze/writing)         |
| objectexplorer.com: your licence              | at start, and in a plan's last three days, only once you have signed up     |
| objectexplorer.com: the demo folder           | at each start of the installed app, fetched again only when it changed      |
| objectexplorer.com: the assistants Ask… knows | at start, at most once an hour                                              |
| objectexplorer.com: a file you send us        | only when you pick a command that sends one, below                          |
| objectexplorer.com: the trial sign-up         | when you first sign in                                                      |
| Google: signing in                            | when you sign in with Google                                                |
| Google: your picture                          | whenever the account icon shows it, after you signed in with Google         |
| Let's Encrypt: a certificate for your domain  | a server started with `tls=auto`, at its first start and before it runs out |

There is no usage reporting and no crash reporting. What the app measures about itself — how long
each file took to open, what its memory was made of — stays in `~/.objectexplorer`.

**A message to Rockie, when you write one.** **Chat with Rockie** in the side bar sends what you
type to us. Each message is encrypted on your machine with our public key before it leaves, the
server keeps only that ciphertext, and only our own machine can open it; the answer comes back to
your app the same way.

**A file you send us, when you choose to.** Three commands send something for a bug report:
**Share Anonymized for Debugging** on a file (an [anonymized copy](/explore/anonymize), never the
file itself), **Help: Share Application Log for Debugging** and **Help: Report Bug with a
Screenshot**. Each is encrypted on your machine with our public key before it leaves, so only we can
read it, and none of them runs on its own.

## What stays on this machine, and you may not expect

**Your window sessions.** The desktop window records each session as it happens: what you clicked,
the keys you pressed, the text you typed, and the messages the app printed. It is kept so a session
can be played back after something went wrong. Only the last 20 are kept, and never more than 50 MB
in all, in `~/.objectexplorer/replay`; nothing of it is sent anywhere. Each file is encrypted with a
key kept in your system's keychain (made the first time, never shown), so what you typed cannot be
read from the file, by another program or from a copy of your disk. To give a session to someone,
for a bug report, `oe replay export <file> <out>` writes a readable copy; it holds what you typed,
so look at it first. Start with `record=false` to record nothing — see
[recording a session](/reference/session-recording). The browser version records nothing.

**The app's log.** The desktop app writes the messages it prints, with the paths of the files it
opened, to `~/.objectexplorer/app.log`, and keeps the one before as `app.log.1` once it passes 8 MB.
It stays here unless you send it to us.

## What an agent sees

An MCP client on this machine is not an exception to any of the above: it reaches storage only
through this app, only at `127.0.0.1`, only in the roots you ticked, and only with PII already
rewritten — by the same [PII rules](/agents/pii) a share link goes through. It never holds a
credential, and every call it made is on your disk in `~/.objectexplorer/mcp/`. The door is shut
until you open it — see [ObjectExplorer for agents](/agents/).

## What a cloud provider sees

The same thing it would see if you used its own console: signed requests from your machine, for the
objects you opened. ObjectExplorer adds no proxy, no relay and no third party in between.

## What this website keeps

**A download.** Every download link goes through objectexplorer.com/download/, which sends you on
to the file on GitHub and keeps a row of it: the time, your address, the file, its version, the
channel you came through (a YouTube link, say) and your id, if you have one (below). The row is
encrypted with our public key as it is written, so the server holds only ciphertext, and only our
own machine reads it.

**A trial sign-up.** It keeps the email you gave and the address it came from, encrypted the same
way, and your id, if you have one.

<a id="partner-links"></a>**Your id.** A link a partner shares carries their code as your id
(`?id=K7QM`). The site keeps it in one cookie, `id`, so a download or a sign-up later credits that
partner, and the links of the page carry it on, so a link you pass on credits them too. It is the
partner's code until you register, when your own id replaces it, and a newer shared link with
another id replaces it at once. The cookie holds nothing about you but that id, is used by this
site alone, and goes when you clear your cookies.

There is no other tracking cookie and no analytics. The server also keeps an ordinary access log
(address, time, page) for security.

## Who is responsible

Knock Data AB (organization number 559229-1867), Sweden, is the controller for the data
described on this page — see [company](/company). Ask [rockie@knockdata.com](mailto:rockie@knockdata.com) to see or
delete what we hold about you.

Next: [connecting storage](/storage/connect).
