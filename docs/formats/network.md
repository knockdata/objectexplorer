# Packet captures

Network captures `pcap` `pcapng` — a recording of what a network card saw, made by tcpdump,
Wireshark, a router or a phone's debugging tool. Both the classic libpcap format (either byte order,
microsecond or nanosecond times) and pcapng (several interfaces, several sections) are read, whatever
the link underneath: Ethernet, loopback, Linux's "cooked" capture, or raw IP.

A capture is thousands of packets, and what a person wants to know is what happened. A single
`curl example.com` is nineteen packets: a name looked up, a connection made, a secure handshake, a
request, an answer, a goodbye. So a capture opens on its **Sessions**, each one a few plain lines,
and the packets are one click under each line.

<img src="/screenshot/format-capture-sessions.jpg" alt="A capture's sessions: four rows named example.com, www.google.com, a local name and a gateway address, with filter chips above them and a trace of the selected session on the right">

Everything stays on your machine, like every other [format](/formats/): the capture is read
in place and nothing is sent anywhere.

## The modes of a capture

| Mode         | What it shows                                                                                          |
|--------------|--------------------------------------------------------------------------------------------------------|
| **Sessions** | the capture opens here: what happened, session by session, with filters, and a session's trace beside |
| **Table**    | the packets, a row each: time, addresses, ports, protocol, bytes, a summary in words                    |
| **Query**    | [SQL](/analyze/sql) over every table below                                                              |
| **Structure** | each packet as its layers, a layer at a time, down to its bytes                                      |
| **Hex**      | the file's own bytes                                                                                    |

## Sessions

A session is one thing a person or a program did. It is told like this:

- a name looked up (DNS, the Domain Name System, which turns a name into an address), together with
  every connection made to an address that answer gave, within the time the answer may be kept;
- else a connection, named by the server name its secure handshake announced (TLS, Transport Layer
  Security, the encryption under https; or QUIC, the protocol under HTTP/3), else by its address;
- else the packets that belong together without a connection: a broadcast, an address request.

Each session has a **kind** — `web`, `lookup` (a name nothing connected to), `local` (the network's
own announcements: mDNS, multicast DNS, and SSDP, device discovery), `address` (ARP, the Address
Resolution Protocol, and DHCP, the Dynamic Host Configuration Protocol that hands out addresses),
`mail`, or `other` — its two ends, its size, when it began and how long it lasted.

### The trace

Select a session and its **trace** opens beside the list: its **steps**, in the order they happened.

| Step       | What it says                                                                         |
|------------|--------------------------------------------------------------------------------------|
| `lookup`   | "looked up example.com → 93.184.215.14", how many queries and answers                |
| `connect`  | "connected to 93.184.215.14:443": the three-way handshake of TCP, the connection protocol |
| `secure`   | "TLS 1.3 to example.com, offers h2 and http/1.1": version, server name, what the client offered and what was chosen |
| `exchange` | "request 90 B → response 1.2 KB", or for plain web traffic the method, path and status |
| `close`    | how the connection ended                                                             |

<img src="/screenshot/format-capture-trace.jpg" alt="A session's trace: a lookup, a connection, a TLS handshake opened on its five packets, and below it the first of them opened on its layers and bytes">

Each step has its time and a bar on the session's own timeline, so the slow part shows at a glance.
A chevron opens a step's packets, each in its protocol's words ("ClientHello, server name
example.com"); a packet opens its layers (Ethernet, IP, TCP, TLS), and a layer its bytes. The whole
trace is reachable from the keyboard: Right goes in, Left comes back.

A segment split over several packets is put back together before it is read, so a server's answer
cut in two shows as one message.

### Filters

Above the list, **chips** narrow the sessions, each with the count it would leave:

- **Kind**: Web, Lookups, Local, Addresses, Mail, Other
- **Protocol**: DNS, mDNS, TLS, HTTP, QUIC, TCP, UDP, ARP, ICMP, DHCP
- **Problem**: No Answer, Reset, Sent Again, Failed Lookup, Slow, Refused
- a **host** field: a name, an address, a range such as `10.0.0.0/8`, or a port
- a **time strip**: drag over it to keep one stretch of the capture; Escape gives all of it back

Chips of one row add (DNS or TLS), chips of different rows narrow (TLS and Reset). A chip that would
leave nothing is dimmed, never hidden. The filter is shown under the chips as the SQL that gives the
same sessions; **Copy SQL** puts it on the clipboard to paste into a notebook.

### The problems it finds

| Problem         | It means                                                                              |
|-----------------|---------------------------------------------------------------------------------------|
| `no answer`     | a lookup, a connection request or an address request nobody answered                  |
| `reset`         | a connection refused or cut off                                                       |
| `retransmitted` | a request or a segment that had to be sent again                                      |
| `failed lookup` | no such name, or the name server failed                                               |
| `slow`          | a lookup over 200 ms, a connect or a handshake over a second, an answer over two     |
| `refused`       | a TLS alert, an HTTP status of 400 or more, an ICMP (Internet Control Message Protocol) error such as "port unreachable" |

A problem is written in red on its session and on the step it belongs to, in words ("reset by the
server after the ClientHello"), and an ICMP error is tied to the connection it was about.

## Tables for SQL

A capture is a file of tables. The notebook names one after the file's path and `!/`:

```sql
SELECT * FROM 'office.pcap!/sessions'
```

The bare name, `'office.pcap'`, is the packets table, as it always was.

| Table         | A row is                                                   | Its columns                                                                                                            |
|---------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `sessions`    | a session                                                  | session_id, name, kind, client, server, port, began, lasted, bytes, packets, protocols, problem                        |
| `steps`       | a step of a session                                        | step_id, session_id, kind, words, detail, began, lasted, first_packet, last_packet, packets, bytes, problem             |
| `connections` | the packets of one address pair and port pair, both ways   | connection_id, session_id, protocol, client, client_port, server, server_port, state, packets, bytes, retransmitted     |
| `packets`     | a packet                                                   | number, time, interface, captured, wire, source, destination, protocol, source port, destination port, payload, connection_id, step_id, summary |
| `dns`         | a DNS question or answer (UDP, and mDNS)                   | packet, id, response, name, type, answer, lifetime, result, waited                                                     |
| `tls`         | a TLS handshake                                            | packet, connection_id, session_id, version, server_name, offered, chosen, cipher, alert                                 |
| `http`        | an HTTP/1 request or response                              | packet, connection_id, request, method, host, path, status, reason, content_type, size, waited                          |
| `quic`        | a QUIC connection's first packet                           | packet, connection_id, session_id, version, server_name, offered                                                        |
| `arp`         | an ARP question or answer                                  | packet, connection_id, kind, type, words                                                                                |
| `icmp`        | an ICMP message                                            | packet, connection_id, kind, type, code, words                                                                          |
| `dhcp`        | a DHCP message                                             | packet, connection_id, kind, type, words                                                                                |
| `problems`    | a problem found                                            | session_id, step_id, packet, kind, words                                                                                |

`began` is a date and time (UTC); `lasted` and `waited` are milliseconds. `session_id`,
`connection_id` and `step_id` join the tables together, and `packet` is a packet's number in the
packets table. A table the capture has no rows for — `http` in a capture of encrypted traffic only —
is not offered.

A few questions:

```sql
-- which names did this capture look up, and what came back?
SELECT name, answer, waited FROM 'office.pcap!/dns' WHERE answer <> '' ORDER BY waited DESC

-- the servers it spoke TLS with, and how much each took
SELECT server_name, count(*) AS handshakes, sum(s.bytes) AS bytes
FROM 'office.pcap!/tls' t JOIN 'office.pcap!/sessions' s USING (session_id)
GROUP BY server_name ORDER BY bytes DESC

-- the slowest steps of all
SELECT s.name, st.words, st.lasted
FROM 'office.pcap!/steps' st JOIN 'office.pcap!/sessions' s USING (session_id)
ORDER BY st.lasted DESC LIMIT 10

-- every problem, with its session's name
SELECT s.name, p.kind, p.words
FROM 'office.pcap!/problems' p JOIN 'office.pcap!/sessions' s USING (session_id)

-- web requests that failed
SELECT method, host, path, status, reason FROM 'office.pcap!/http' WHERE status >= 400
```

The same [column summaries](/explore/column-summary) as any table work on each of these.

## What it does not do

- **It does not decrypt.** Behind TLS or QUIC the exchange shows sizes and times, not the words:
  what a handshake announces in clear (the server name, the versions, the alert) is read, nothing
  after it.
- QUIC is read for its first packet (version 1), where the server name is; the rest of a QUIC
  connection is counted, not opened.
- HTTP is read in its first version, text over TCP. HTTP/2 and HTTP/3 show as encrypted connections.
- DNS is read over UDP; DNS over TCP is counted as a connection.
- The packets table keeps the first 200 000 packets of a capture; the sessions, steps and
  connections are counted over the whole file.
- A session is one lookup with its connections, not a whole page load: a page that asks for ten
  names shows as ten sessions.

Next: [records and finance](/formats/records).
