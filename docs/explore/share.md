# Sharing a table

<img src="/screenshot/share.png" alt="The share dialog: every column with None, Mask, Hash and FPE, and a preview of three rows">

One share icon, one dialog, and a link that opens the rows — or a model you just trained — in the app
at objectexplorer.com/app, on a machine with none of your storage, none of your accounts and nothing
installed.

The icon is where the thing is: in the side toolbar of anything showing rows, and in a cell's own
toolbar. A folder listing has none — a list of names is not something to hand somebody, and the
object under it is.

## Decide column by column

The [PII rules](/agents/pii) in Settings → PII protect two audiences with one set of rules: the
person who opens a share link, and an agent calling over MCP. Every column opens on whatever those
rules already say about it, so a column you decided once is never shared plainly by accident. A
column no rule names opens on **None** — the value as it is. Beside each one: **None**, **Mask**,
**Hash** or **FPE**.

| Method   | What it does                                                                                         |
|----------|------------------------------------------------------------------------------------------------------|
| **None** | the value as it is — also how you take one column back out of a rule                                 |
| **Mask** | covers a range of characters with `*` — one slider, a handle at each end                             |
| **Hash** | 16 hex characters of keyed SHA-256, so equal values stay equal and the column still joins and counts |
| **FPE**  | format-preserving: a digit becomes a digit and a letter a letter of the same case                    |

A rule that says **drop** opens as **Hash** here: a share has no way to leave a column out.

The free-text rules from Settings → PII hold over every share too, whatever you pick per column — an
email address inside a note column is replaced even though no column is called `email`.

What the share does to a column is decided by the same code an [agent's answer](/agents/pii) goes
through, in the app's own server — the browser holds no cipher, so the preview below is the server's
answer. The two audiences differ in three places:

|                | A share link                                    | An agent over MCP                                 |
|----------------|-------------------------------------------------|---------------------------------------------------|
| **Per column** | you can change any column, for this share alone | the rules as written, with no way to ask for less |
| **Drop**       | opens as **Hash**                               | the column is left out                            |
| **Key**        | one made for this share when the dialog opens   | one per install, `~/.objectexplorer/mcp/key`      |

The share's key never enters the link — **Copy key** is the only way it leaves your browser, and it
is the key that share's Hash and FPE columns were made with, and nothing else. Because the keys
differ, the same email hashed in two shares, or in a share and an agent's answer, comes back as two
different values.

The preview under the columns is the app's own grid, showing three rows sampled from the start, the
middle and the end of the table — each one as it is and then as it goes, so what you are about to
send is read rather than imagined.

## How long it lives

A link lives for **1D**, **1W**, **1M**, **3M** or **1Y**, and **Read and burn** deletes it the
moment somebody opens it. Small shares travel whole inside the link's fragment, which no server ever
sees; bigger ones — and every burn — are stored under a name made of their expiry and their own
digest, and swept when that expiry passes.

**Copy URL**, or **Email**, which opens your own mail app with the link in it.

## Sharing a model

A trained model shares as a model. The payload carries LightGBM's own text format, so the receiver
can predict with it in the app, or load it in Python with `lgb.Booster(model_str=…)` — without a
single training row going with it.

Next: [the notebook](/analyze/notebook).
