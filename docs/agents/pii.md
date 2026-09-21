# PII rules

**Settings → PII.** What never leaves this machine as it stands.

<img src="/screenshot/pii-rules.png" alt="Settings → PII: four column rules, one each of FPE, Mask, Hash and Drop, and four full-text rules, every rule with a sample as it is and as it goes">

One set of rules protects two audiences: **an agent calling over MCP**, and **a person opening a
[share link](/explore/share)**. Both are data leaving this machine, and both go through the same
code in the app's own server, reading the same two lists from the same file,
`~/.objectexplorer/mcp.yaml`. Someone who decides once that `email` is never shared plainly has
decided it for both. An edit in the pane holds from the next call or the next share — the file is
read again every time, with no restart.

|                           | An agent over MCP                                  | A person with a share link                                   |
|---------------------------|----------------------------------------------------|--------------------------------------------------------------|
| **Which rules**           | both lists, on every call                          | both lists, on every share                                   |
| **Who can loosen one**    | nobody — no call can ask for less                  | the sender, one column at a time, for that one share         |
| **A rule that says drop** | the column is not in the answer at all             | opens as **Hash** — a share cannot leave a column out yet    |
| **The key**               | one per install, in `~/.objectexplorer/mcp/key`    | one per share, made when the dialog opens, never in the link |
| **How it is told**        | every rewritten column is marked `encrypted: true` | a rewritten column reaches the receiver's grid as text       |

Everything else is the same: the four methods below, the 16 hex characters a hash comes back as,
the characters a mask hides, and the full-text rules — which hold over a share even for a column
set to **None**.

## Two lists, because there are two kinds of value

**Tabular** — matched against a **column's name**, anywhere in it. `email` catches `email`,
`emailAddress` and `billingEmail`. Every value in that column goes through the rule, whatever the
value says.

**Full text** — matched against **what a value says**. Only what it matched is replaced; the rest of
the value is left alone. A note field with a customer's address and personal number in it is exactly
the case this is for:

```
mail anna.berg@example.com about 19790224-5678 or call +46 73 987 65 43
mail kxnh.qtay@zbmwuxe.tqf about 84013557-1092 or call +19 04 246 71 88
```

A [starting rule file](/agents/connect#_1-write-a-starting-rule-file) ships four of each — column
rules for email, phone, national id and card or account number, and text rules for an email address,
a personal number, a US SSN and an international phone number — because a file with only column
rules looks like it works right up until the day it does not.

## Four methods

| Method   | What comes back                                                 | Keeps                 |
|----------|-----------------------------------------------------------------|-----------------------|
| **FPE**  | a different value of the same shape                             | format, joins, counts |
| **Hash** | 16 hex characters of keyed SHA-256 (HMAC)                       | joins, counts         |
| **Mask** | a range of characters hidden, the rest kept                     | shape                 |
| **Drop** | the value never leaves — the column is not in the result at all | nothing               |

**Drop** is for an agent. The share dialog offers **None**, **Mask**, **Hash** and **FPE**, and a
column a rule drops opens there as **Hash** — see the table above.

**FPE is the default**, and a rule that names no method gets it. It is the only one that leaves the
data still looking like data: a masked column breaks a join and makes every distinct count `1`, and
a hashed card number is something no analysis can sanity-check — so an agent handed either of them
asks for the raw file instead. Format-preserving encryption keeps the length, the alphabet and the
equality, and gives up nothing real.

Where there is no format to preserve — a float, a timestamp, a blob — the value is hashed instead.
That is the one place a method is decided for you.

**Mask** carries a range, dragged on a two-handle slider: the characters between the handles become
stars and the rest is kept. The range can never close to nothing — a mask that hides no character is
a rule that reads as set and does nothing.

Every rule shows its own sample, rewritten as you change it by the same code a call or a share goes
through. The sample uses this install's key, so it is exactly what an agent gets; a share's Hash
and FPE values read differently, because a share has a key of its own.

## Where the key lives

Hash and FPE are both keyed, and the key is the one place the two audiences part.

**An agent** is answered under one key per install, generated on first use and kept in
`~/.objectexplorer/mcp/key` — never in the rule file and never on the wire. So an encrypted value is
stable across sessions on this machine, and means nothing on any other.

**A share** is encrypted under a key of its own, made when the share dialog opens. It never enters
the link; **Copy key** is the only way it leaves the browser. So a receiver given that key holds that
one share and nothing else, and the same email hashed in two shares, or in a share and an agent's
answer, comes back as two different values that cannot be joined.

## What an agent is told

Every column a rule rewrote is marked `encrypted: true` — in `describeObject`, in `columnSummary`
and beside `query` results. An agent holding a customer id that is not the customer id has to be
told, or it will hand it to a person as a real one.

`columnSummary` is measured **after** the rules, never before. The top values of the real column
would be precisely the leak the rules exist to stop.

## What the rules cannot reach

`getObject` reads a whole object and answers as what it is: rows for a table, which go through the
column rules; text for a document, which goes through the full-text rules; a tree for a drawing, and
a window of bytes for anything else. Those last two go through neither — there is no column to name
and no sentence to find an address in, and scrambling them would only break the file.

That is why a starting rule file leaves `getObject` and `query` off, and why a root holding raw
exports is a place for an [approve rule](/agents/connect#_5-tick-the-roots).

Next: [sessions, replay and audit](/agents/sessions).
