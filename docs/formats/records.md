# Records and finance

Bank statements `ofx` `qfx` `qif` `sta` `mt940`, ISO 20022 statements and payments in `.xml`, books
`gnucash` `beancount` `bean` `ledger` `hledger` `journal`, financial reports `xbrl` and inline XBRL
pages, event logs `evtx` `journal`, bibliographies `bib` `bibtex` `ris` `nbib` `medline` `ciw` `enw`
`refer`

<img src="/screenshot/format-records.png" alt="A Beancount ledger's postings opened as a table: each posting's transaction, date, narration, account, amount and commodity, with a summary over each column">

Files that are lists of records — a transaction, an event, a reference — open as their table, a row
a record, read by the app's own engine. The same [column summaries](/explore/column-summary) and
[SQL](/analyze/sql) as a parquet file work on them: a bank statement and a csv of receipts join in
one query.

A file that holds several kinds of record opens as the list of its tables, as an [SQLite
file](/formats/databases) does. A double click opens one on its **Table**, and the notebook queries
it by its name after the file's path: `SELECT * FROM 'books/home.beancount/postings'`. Opened from
its **Table** mode, such a file shows the table of the most rows.

Which format a file is, its content decides: an ISO 20022 statement named `.xml`, an hledger journal
named `.journal`, a PubMed export named `.txt` all open as themselves. The text of the ones written
as text is a click away.

## Bank statements and payments

ISO 20022 is the international standard for messages between banks and their customers; SWIFT (the
Society for Worldwide Interbank Financial Telecommunication) is the network banks send theirs over.

| File                                                            | A row for each                                 |
|-----------------------------------------------------------------|------------------------------------------------|
| OFX (Open Financial Exchange) `ofx`, Quicken's `qfx`            | transaction, with its account                  |
| Quicken's interchange file `qif`                                | transaction                                    |
| SWIFT MT940, the statement banks send over SWIFT, `sta` `mt940` | statement line, with its statement             |
| ISO 20022 camt.052, camt.053, camt.054 statements, `.xml`       | tables: entries, details, balances, statements |
| ISO 20022 pain.001 payment orders, `.xml`                       | tables: payments, instructions                 |

OFX versions 1 (SGML, XML's forerunner) and 2 (XML) are both read; Microsoft Money writes the same.
An amount is a number, signed as the bank books it, and a date is a date.

## Books and journals

| File                                                     | Its tables                                          |
|----------------------------------------------------------|-----------------------------------------------------|
| GnuCash book `gnucash` (XML, compressed or not)          | splits, transactions, accounts, prices, commodities |
| Beancount ledger `beancount` `bean`                      | postings, transactions, accounts, balances, prices  |
| Ledger and hledger journals `ledger` `hledger` `journal` | postings, transactions, prices                      |

A posting carries its transaction's number, date and description, so the postings table alone
answers most questions. An amount the journal leaves out is filled in, as Ledger and Beancount would
balance it. A GnuCash book saved as SQLite is an SQLite file, and opens as its own tables.

A `.journal` is told by its bytes: a systemd journal opens as its [log entries](#event-logs), an
hledger journal as its tables.

## Financial reports

An XBRL (eXtensible Business Reporting Language) report — `.xbrl`, or an `.xml` whose root says so —
opens as its facts, a row each: the concept, its value, its period, its unit and its dimensions. An
inline XBRL page, the `.htm` a company files with the SEC (the US Securities and Exchange
Commission), opens as the web page it is, its facts on its **Table** next.

## Event logs

| File                                  | A row for each                                             |
|---------------------------------------|------------------------------------------------------------|
| Windows event log `evtx`              | event: provider, event id, level, time, computer, its data |
| systemd journal `journal`, `journal~` | entry, as `journalctl -o json` writes it                   |

A Windows event's own data is a column of JSON, a member a field. A journal's fields are a column
each, and a payload compressed with LZ4, Zstandard or XZ is read. A log cut short reads as far as it
goes.

## Bibliographies

| File                                                                | A row for each                            |
|---------------------------------------------------------------------|-------------------------------------------|
| BibTeX `bib` `bibtex`                                               | entry: its type and key, a column a field |
| RIS (Research Information Systems) `ris`: EndNote, Zotero, Mendeley | reference, a column a tag                 |
| PubMed's MEDLINE format `nbib` `medline`                            | citation, a column a tag                  |
| Web of Science plain text `ciw`                                     | record, a column a tag                    |
| EndNote tagged and Refer `enw` `refer`                              | reference, a column a tag                 |

A tag given more than once, as each author is, keeps its values in one column, joined by `; `.

A browser's history and bookmarks open as tables too — see [mail, chats and personal
files](/formats/mail#browser-history-and-bookmarks).

Next: [databases](/formats/databases).
