# PII rules

**Settings → PII.** What never leaves this machine as it stands.

These rules are not only about agents. They hold wherever data leaves: what an agent is handed
through MCP, and what a [share link](/explore/share) carries. Someone who decides once that `email`
is never shared plainly has decided it everywhere.

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

A starting file ships four of each — email, personal number, US SSN, international phone — because a
file with only column rules looks like it works right up until the day it does not.

## Four methods

| Method   | What comes back                                     | Keeps           |
|----------|-----------------------------------------------------|-----------------|
| **FPE**  | a different value of the same shape                 | format, joins, counts |
| **Hash** | 16 hex characters, keyed SHA-256                    | joins, counts   |
| **Mask** | a range of characters hidden, the rest kept         | shape           |
| **Drop** | the value never leaves — the column is not in the result at all | nothing |

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

Every rule shows its own sample, rewritten as you change it. What the sample shows is what the agent
gets.

## Where the key lives

One key per install, generated on first use, kept in `~/.objectexplorer` — never in the rule file
and never on the wire. So an encrypted value is stable across sessions on this machine, and means
nothing on any other.

## What an agent is told

Every column a rule rewrote is marked `encrypted: true` — in `describeObject`, in `columnSummary`
and beside `query` results. An agent holding a customer id that is not the customer id has to be
told, or it will hand it to a person as a real one.

`columnSummary` is measured **after** the rules, never before. The top values of the real column
would be precisely the leak the rules exist to stop.

## What a column rule cannot do

It cannot touch raw bytes, and it cannot touch a line of a text file that has no column name. That
is why the tools that would return either are not in the set an agent can call today — and why, when
they arrive, they arrive carrying an [approve rule](/agents/connect#_5-tick-the-roots) instead.

Next: [sessions, replay and audit](/agents/sessions).
