# Domain and certificate

People reach your server by a name, like `oe.example.com`, over https. This page sets up the name
and gets the certificate that https needs. Type your server's domain, and the commands and records
on this page use it.

<DomainInput />

## Why a certificate

https keeps what travels between a browser and your server private. For it, the server shows the
browser a **certificate**: a small file that says "this is `oe.example.com`", signed by an authority
the browser trusts. Without one, the browser warns everyone away from the page, and sign-in does not
work.

ObjectExplorer gets a certificate for you, free, from **Let's Encrypt**, and renews it before it
runs out. Before Let's Encrypt signs one, it must check that you control the domain. It asks the
server to put a value it chose somewhere only the domain's owner can, and then looks for it there.
There are two places it can look, and they are the two ways on this page:

- **http-01**: on the server itself, at `http://oe.example.com/.well-known/acme-challenge/…`.
  Let's Encrypt connects to your machine from the internet to read it.
- **dns-01**: in the domain's DNS records. Let's Encrypt reads a DNS record, and never connects to
  your machine.

You can also bring [your own certificate files](#your-own-certificate-files), from your company's
authority or bought anywhere. Then Let's Encrypt is not involved at all.

## Which one do I need

| Your server                                                                     | Use                                                                                                       |
|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| The internet can reach port 80 of the machine (directly, or through a router)   | [http-01](#http-01-the-internet-can-reach-the-machine)                                                    |
| It is behind a firewall, on a private network, and the internet cannot reach it | [dns-01](#dns-01-the-machine-is-behind-a-firewall)                                                        |
| Your company gives you certificate files                                        | [your own certificate files](#your-own-certificate-files)                                                 |
| A load balancer or reverse proxy in front of it handles https                   | none on the server — see [behind a load balancer](/self-hosting/#behind-a-load-balancer-or-reverse-proxy) |

When in doubt: if people outside your company could open the server's page, http-01. If only people
inside the company network can, dns-01.

## http-01: the internet can reach the machine

### 1. Point the domain at the machine

At your DNS provider, add an **A record** (an IPv4 address) or an **AAAA record** (an IPv6 address)
for `oe.example.com`, with the machine's public address as its value.

```
oe.example.com  A  203.0.113.10
```

### 2. Open the ports

Let's Encrypt connects to port 80. People connect to port 443, the https port. Both must reach the
server.

- On a machine with a public address, allow 80 and 443 in its firewall, and start the server with
  `http_port=80 https_port=443`.
- Behind a home or office router, forward the router's ports to the machine. For example, forward
  80 to 8080 and 443 to 8443, and start the server with `http_port=8080 https_port=8443`. Ports
  above 1024 need no special rights on the machine.

### 3. Start it

```sh
objectexplorer \
	host=0.0.0.0 \
	http_port=80 \
	https_port=443 \
	domain=oe.example.com \
	tls=auto
```

`tls=auto` asks for a certificate from Let's Encrypt. The server must also have a
[sign-in](/self-hosting/#sign-in) before other machines may reach it.

Port 80 then does two things: it answers Let's Encrypt, and it sends every other visitor on to
https.

### Where the certificate is kept

It is fetched at the first start and kept in `~/.objectexplorer/certs/oe.example.com/`: `chain.pem`
the certificate, `key.pem` its private key, and `account.key` the Let's Encrypt account that got
it. With `data=<folder>`, it is `<folder>/certs/oe.example.com/`. A later start that finds a
certificate that has not run out uses it, without asking Let's Encrypt again.

### Renewal

Nothing to do. While it runs, the server looks a minute after it starts and every 12 hours after.
30 days before the certificate ends, it gets a new one and swaps it in without a restart.
Connections already open keep the old one until they close. Add an `email` to be warned by Let's
Encrypt if renewal ever fails:

```json
{
	"tls": "auto",
	"domain": "oe.example.com",
	"acme": { "email": "admin@example.com" }
}
```

## dns-01: the machine is behind a firewall

Nothing of the internet needs to reach the machine. The domain may point at an address of your
private network, like `10.0.0.5`. Let's Encrypt checks a DNS record instead, and ObjectExplorer
writes that record for you on objectexplorer.com. You add one record, once, that points there.

### 1. Point the domain at the machine

Add an A record for `oe.example.com` with the machine's address on your network, so people inside
can reach it:

```
oe.example.com  A  10.0.0.5
```

### 2. Add the CNAME

At your DNS provider, add one **CNAME** record. A CNAME says "for this name, look at that other
name". This one sends Let's Encrypt's look-up to objectexplorer.com:

```
_acme-challenge.oe.example.com  CNAME  oe.example.com.acme.objectexplorer.com
```

The rule is the same for every domain: `_acme-challenge.<domain>` points at
`<domain>.acme.objectexplorer.com`. You add it once; it serves every renewal after.

### 3. Install a licence for the domain

The CNAME alone does not prove that the domain is yours: anybody can guess its name. So
objectexplorer.com writes the value only for a server holding a licence issued for that domain.
Ask for the licence with the domain in it, then install it on the server, as the account that runs
it:

```sh
oe licence /path/to/licence.txt
```

See [installing a licence](/self-hosting/#installing-a-licence).

### 4. Turn on dns-01 in the config

There is no start argument for it. In the [config file](/self-hosting/#the-config-file),
`~/.objectexplorer/server.json`, add `"acme": { "challenge": "dns-01" }` beside `"tls": "auto"`:

```json
{
	"host": "0.0.0.0",
	"http_port": 80,
	"https_port": 443,
	"domain": "oe.example.com",
	"tls": "auto",
	"acme": { "challenge": "dns-01", "email": "admin@example.com" }
}
```

### 5. Start it

```sh
objectexplorer
```

At each issue, the server sends Let's Encrypt's check value to objectexplorer.com with its licence.
It waits, up to two minutes, until public DNS shows the value, lets Let's Encrypt look, and then has
the value removed again. Until the CNAME exists, the server waits, looks every minute, and prints
the record to add every ten minutes.

The certificate is kept and renewed [as with http-01](#where-the-certificate-is-kept).

The server refuses to start with dns-01 and no licence issued for the domain, and with dns-01 and
`aliases`: dns-01 covers one name only.

### What leaves the server

- To Let's Encrypt: the domain name.
- To objectexplorer.com: the domain, the check value and the licence.

The certificate's private key is made on the server and never leaves it.

## Your own certificate files

A certificate from your company's authority, or bought from anyone, as two PEM files: the
certificate chain and its private key.

```sh
objectexplorer \
	host=0.0.0.0 \
	https_port=443 \
	domain=oe.example.com \
	tls=/etc/ssl/oe/fullchain.pem,/etc/ssl/oe/privkey.pem
```

`tls=<chain>,<key>`: the chain first, the key second. The server reads the files once, when it
starts, so restart it after you renew the certificate.

## The acme key

The `acme` key of the config file tunes how `tls=auto` gets its certificate. Every key is optional.

| `acme` key  | Default                   | What it does                                                                     |
|-------------|---------------------------|----------------------------------------------------------------------------------|
| `email`     |                           | the contact Let's Encrypt writes to before a certificate runs out                |
| `directory` | `production`              | `staging` uses Let's Encrypt's test CA, whose certificates browsers do not trust |
| `http_port` | the server's `http_port`  | where the http-01 check is answered                                              |
| `folder`    | `~/.objectexplorer/certs` | where certificates are kept; `<data>/certs` with `data=`                         |
| `challenge` | `http-01`                 | `dns-01`: through the CNAME above, for a server the internet cannot reach        |
| `licence`   | the licence installed     | dns-01's proof that the domain is yours: a licence issued for `domain`           |

`aliases`, beside `domain` at the top of the config, adds more names to the certificate, like
`www.oe.example.com`. Each one is answered with a redirect to `domain`. http-01 only.

## When it does not start

The server stops with a message when:

- `tls` is given without `https_port`;
- `tls=auto` is given without `domain`;
- dns-01 has no licence issued for the domain, or has `aliases`.

Next: [sign-in with OIDC](/self-hosting/sign-in-oidc).
