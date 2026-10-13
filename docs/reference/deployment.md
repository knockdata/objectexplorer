# Deployments and start settings

ObjectExplorer is one binary, and it behaves the same however you got it: the desktop app, npm,
Homebrew, a tarball on a server. What differs is how it is started, and what its plan allows.

Every setting is written as `name=value` after the command, in any order, or kept in a config file
as JSON. Type your server's domain, and the commands on this page use it.

<DomainInput />

```sh
objectexplorer host=0.0.0.0 http_port=9421
```

## The shapes

| Shape              | How you get it                                                               | Who it is for            | Updates                                                    | Licence                      |
|--------------------|------------------------------------------------------------------------------|--------------------------|------------------------------------------------------------|------------------------------|
| The desktop window | the [desktop app](/getting-started#download)                                 | you, on your own machine | **Check for Updates**, see [updating](/reference/updating) | your plan                    |
| The command line   | `objectexplorer` in a terminal, npx, Homebrew                                | you, in your own browser | **Check for Updates**, npm or Homebrew                     | your plan                    |
| A server           | the same binary, started with `host=` and a sign-in                          | a team, on a server      | only on the server, by its owner                           | a licence, or a 14-day trial |
| Instant            | [objectexplorer.com/app](https://objectexplorer.com/app/), or `mode=instant` | anyone, to try it        | we update ours                                             | none                         |

[Instant mode](/reference/instant-mode) serves one read-only folder, has no sign-in and no
credentials, and keeps every folder a visitor picks in their own browser.

## Who may do what

One rule decides what a page of another machine may change: **anything that adds a credential or
runs code is configured only on the server's own machine, or on its command line.** That covers:

- cloud and drive sign-ins, and the folders and buckets in the tree;
- Python environments and packages, and the cloud command-line tools;
- the agent door: its tokens, its rules and what agents read;
- **Settings → Admin**: the licence, the sign-in and the audit log;
- installing an update.

A request counts as local only when it comes from this machine (loopback) **and** carries no
`X-Forwarded-For`, `Forwarded` or `X-Real-IP` header. So a reverse proxy on the same machine does not
make every visitor local. An ssh tunnel does, on purpose: it is how you configure a server from your
own laptop.

```sh
ssh -L 9421:127.0.0.1:9421 oe.example.com
# then open http://127.0.0.1:9421 on your laptop: the page is local to the server
```

Everyone else signs in, and uses what the owner set up, as the plan allows. There are no admin
roles: who signed in decides whose session it is, not what it may configure. A page of another
machine:

- sees only the folders and buckets the owner shared with it ([below](#what-other-machines-may-reach));
- runs Python cells only when the owner turned that on;
- adds and fetches [writing](/analyze/writing) sources only when the owner turned that on.

The parts it may not use are not shown on its page.

## Scenarios

Each scenario runs from nothing to a working server. They share the last steps:
[sign-in](#sign-in) and [running as a service](#running-as-a-service).

### On your own machine

Nothing to set. Only this machine can reach it, and it opens your browser:

```sh
objectexplorer
```

A folder after the command is opened in the tree: `objectexplorer ~/data`.

### A server the internet can reach

The machine has a public address, and port 80 reaches it. The certificate comes from Let's Encrypt
through the [web check](#certificates).

1. Point `oe.example.com` (an A or AAAA record) at the machine.
2. Set up [sign-in](#sign-in).
3. Start it:

   ```sh
   objectexplorer \
   	host=0.0.0.0 \
   	http_port=80 \
   	https_port=443 \
   	domain=oe.example.com \
   	tls=auto
   ```

   Port 80 answers Let's Encrypt and sends every other request to https.
4. [Run it as a service](#running-as-a-service).

Behind a home or office router, forward 80 to 8080 and 443 to 8443, and start with
`http_port=8080 https_port=8443` instead.

### A server on a private network

The internet cannot reach the machine, so Let's Encrypt's web check cannot either. Use
[your own certificate](#with-your-own-certificate), from your company CA.

Or get one from Let's Encrypt anyway, through one DNS record:
[dns-01](#a-server-the-internet-cannot-reach-dns-01).

### Behind a load balancer or reverse proxy

The load balancer ends TLS and forwards plain http to the machine. The server needs no certificate:

```sh
objectexplorer \
	host=0.0.0.0 \
	http_port=9421 \
	domain=oe.example.com
```

Point `oe.example.com` at the load balancer. Sign-in needs the address people see, so `domain=` is
the load balancer's name. Every request through the proxy carries a forwarding header, so none of
them is local: configure the server on the machine itself, or through an ssh tunnel. Then
[sign-in](#sign-in) and [running as a service](#running-as-a-service).

### With your own certificate

A certificate from your company CA, or bought from anyone, as PEM files:

```sh
objectexplorer \
	host=0.0.0.0 \
	https_port=443 \
	domain=oe.example.com \
	tls=/etc/ssl/oe/fullchain.pem,/etc/ssl/oe/privkey.pem
```

The server reads the files when it starts, so restart it after you renew the certificate.

::: warning Other machines can reach it
`host=0.0.0.0`, or any address other than `127.0.0.1`, lets other machines reach this copy. Without
a sign-in it refuses to start, unless you add `public=true`: then nothing asks them to sign in, and
they use whatever the owner shared. Only do that on a network you control.
:::

## Sign-in {#sign-in}

A server signs people in when its config has any of these:

| Key      | Who gets in                                                                                           |
|----------|-------------------------------------------------------------------------------------------------------|
| `oidc`   | anyone your identity provider lets in, by OpenID Connect — see [OIDC](/reference/authentication-oidc) |
| `saml`   | anyone your identity provider lets in, by SAML 2.0 — see [SAML](/reference/authentication-saml)       |
| `tokens` | a desktop window or a script holding one of the fixed tokens you wrote down                           |

`oe sso` writes `oidc` and `saml` into the config for you, and keeps the OIDC client secret in the
system keychain rather than in the file. The server reads the sign-in when it starts.

```sh
oe sso show domain=oe.example.com     # what is saved, and the addresses to register
```

Fixed tokens are written into the config by hand, each with the email it stands for:

```json
{
	"tokens": { "7f2a1c4e9b8d3a6f5e0c2b7d4a9f1e83": { "email": "build@example.com" } }
}
```

A window connects with one: `objectexplorer connect=https://oe.example.com token=<token>`, and keeps
the token in the keychain, so later connects need none. After a browser sign-in, the page shows the
session's token, ready for the same command.

A session lasts until the person signs out, is idle for 8 hours, or 12 hours have passed since
signing in. Restarting the server ends every session.

## The config file

Everything the command line takes, and what it cannot, is kept in one JSON file: `config=<file>`, or
else `~/.objectexplorer/server.json` when it exists. An argument on the command line wins over the
file.

```json
{
	"host": "0.0.0.0",
	"http_port": 80,
	"https_port": 443,
	"domain": "oe.example.com",
	"aliases": ["www.oe.example.com"],
	"tls": "auto",
	"acme": { "email": "admin@example.com" },
	"oidc": { "issuer": "https://integrator-1234567.okta.com", "client_id": "…", "client_secret": "…", "label": "Okta" },
	"roots": ["/data/shared", "s3://lake"],
	"remote_python": false,
	"remote_web": false,
	"audit": { "gcp_project": "my-project" }
}
```

| Key                                    | What it holds                                                                                            |
|----------------------------------------|----------------------------------------------------------------------------------------------------------|
| the arguments                          | `mode`, `host`, `http_port`, `https_port`, `domain`, `tls`, `cloud`, `public`, `licence`, `base`, `data` |
| `aliases`                              | other names of `domain`: answered with a redirect to it, and on the certificate                          |
| `acme`                                 | how `tls=auto` gets its certificate ([below](#certificates))                                             |
| `oidc`, `saml`, `tokens`               | the [sign-in](#sign-in)                                                                                  |
| `roots`, `remote_python`, `remote_web` | [what other machines may reach](#what-other-machines-may-reach)                                          |
| `audit`                                | the [audit log](#the-audit-log)'s Cloud Logging project                                                  |
| `enterprise`                           | `true`: an enterprise server before it has a licence, on its [trial](#the-trial)                         |

## Start settings

| Setting      | Values                                | Default                         | What it does                                                                                                                  |
|--------------|---------------------------------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `host`       | `127.0.0.1`, `0.0.0.0`, or an address | `127.0.0.1`                     | where it listens; `127.0.0.1` is this machine only                                                                            |
| `http_port`  | a number                              | `9421`                          | the plain listener; with `tls` it answers Let's Encrypt and sends the rest to https                                           |
| `https_port` | a number                              |                                 | the TLS listener, needed with `tls`                                                                                           |
| `tls`        | `auto`, or `<chain.pem>,<key.pem>`    |                                 | https with a certificate from Let's Encrypt, or with your own                                                                 |
| `domain`     | a name, like `oe.example.com`         |                                 | the name people use to reach it; the certificate's name; a licence for a domain counts only here                              |
| `public`     | `true`                                | `false`                         | serve other machines without sign-in                                                                                          |
| `licence`    | a licence file, or its text           |                                 | installed before the server starts; one that does not verify stops the start                                                  |
| `mode`       | `full`, `instant`                     | `full`                          | `instant`: one read-only folder, see [instant mode](/reference/instant-mode)                                                  |
| `cloud`      | `on`, `off`                           | `on`                            | `off`: storage is the disk only; no cloud can be added                                                                        |
| `base`       | a folder                              | the built-in app                | read only: `web/` the app, `site/` a static site at `/` (the app then at `/app/`), `demo/` instant mode's folder, `learning/` |
| `data`       | a folder                              |                                 | the objectexplorer.com host's own folder; other servers leave it out                                                          |
| `open`       | `true`, `false`                       | `true`                          | open the browser when it starts                                                                                               |
| `config`     | a JSON file                           | `~/.objectexplorer/server.json` | everything else                                                                                                               |

The window's own settings, `window=`, `connect=`, `record=` and the rest, are on
[the command line](/reference/command-line#starting-it).

The server refuses to start, with a message, when the settings cannot work: `tls` without
`https_port`, `tls=auto` without `domain`, a host other machines can reach without a sign-in or
`public=true`, or a licence that does not verify.

## Certificates

| How           | Settings                              | The machine must be reachable from the internet | Renewing                          |
|---------------|---------------------------------------|-------------------------------------------------|-----------------------------------|
| Your own      | `tls=<chain>,<key>` and `https_port`  | no                                              | yours; restart after replacing it |
| Let's Encrypt | `tls=auto`, `domain` and `https_port` | yes, on port 80                                 | by the server, while it runs      |

With `tls=auto`, Let's Encrypt fetches a file from `http://<domain>/.well-known/acme-challenge/`. The
domain must point at the machine, and port 80 of the internet must reach `http_port`: the server
listens there, or the router forwards 80 to it. The certificate is fetched at the first start and
kept in `~/.objectexplorer/certs/<domain>/`. A start that finds one that has not run out serves it
without asking. The server looks a minute after it starts and every 12 hours after, renews 30 days
before the end, and swaps the new certificate in without a restart.

### A server the internet cannot reach: dns-01

Nothing of the internet needs to reach the machine; the domain may point at an address of your
private network. Add one DNS record, once:

```
_acme-challenge.data.example.com  CNAME  data.example.com.acme.objectexplorer.com
```

Then install a licence issued for `data.example.com` and add `"acme": { "challenge": "dns-01" }`
beside `"tls": "auto"` in the config file. At each issue the server puts Let's Encrypt's check
value on objectexplorer.com with its licence (the licence proves the domain is yours), waits up to
two minutes until public DNS sees it, lets Let's Encrypt look, and removes it again. Renewal works
as above. Until the record exists, the server waits and prints the record to add.

Refused at start: dns-01 without a licence for the domain, and dns-01 with `aliases` (one name
only).

The `acme` key of the config tunes it:

| `acme` key  | Default                   | What it does                                                                     |
|-------------|---------------------------|----------------------------------------------------------------------------------|
| `email`     |                           | the contact Let's Encrypt writes to before a certificate runs out                |
| `directory` | `production`              | `staging` uses Let's Encrypt's test CA, whose certificates browsers do not trust |
| `http_port` | the server's `http_port`  | where the check is answered                                                      |
| `folder`    | `~/.objectexplorer/certs` | where certificates are kept                                                      |
| `challenge` | `http-01`                 | `dns-01`: through the CNAME above, for a server the internet cannot reach        |
| `licence`   | the licence installed     | dns-01's proof that the domain is yours: a licence issued for `domain`           |

What leaves the server: the domain name, to Let's Encrypt; with dns-01 also the check value and
the licence, to objectexplorer.com. The certificate's private key is made on the server and never
leaves it.

## What other machines may reach

A page of another machine sees only the folders and buckets in `roots`, and nothing else on the
server: every path it names is checked, links followed, so `..` and a link pointing out of a root
lead nowhere. With no roots, it reaches nothing. The server's own page sees everything.

Set it on the server, in **Settings → Admin → Other machines**: a tick for each folder of the tree,
and **Run Python cells** and **Add and fetch web sources**. Or on its command line:

```sh
oe settings set server.roots /data/shared s3://lake
oe settings set server.remote_python true
oe settings set server.remote_web false
```

Both write the config file, and a running server reads it again when it changes.

## Settings → Account and Admin

**Settings → Account** shows who you are signed in to this server as, and how (OpenID Connect, SAML
or a token), with **Sign out**, and the plan with the account it was signed up with.

**Settings → Admin** is on the server's own page only. It shows the server's version, licence and
certificate; its sign-in, with the addresses to register at the identity provider; what other
machines may reach; and the audit log, a day at a time, newest first.

## The trial

A server whose licence is an enterprise one is an enterprise server. Before it has one, `"enterprise":
true` in its config runs a 14-day trial from the first time it starts.

- **Days 1 to 7:** only **Settings → Plan** says how many days are left.
- **Days 8 to 14:** a banner at the top of the window, a little more urgent each day. Closing it
  hides it until the next day.
- **After day 14:** everything keeps working. The banner says the server is unlicensed, and it
  cannot be closed.

## Installing a licence

On the server, as the account that runs it:

```sh
oe licence /path/to/licence.txt
```

The text of the licence works too, in place of the path, and so does `licence=` at start. The licence
is checked before it is written. A licence issued for one domain counts only on a server started with
that `domain=`.

## The audit log

A server that signs people in, or an enterprise one, writes one line per event to
`~/.objectexplorer/audit/<date>.ndjson`: sign-ins (and failed ones, with the reason), sign-outs,
uploads, copies and deletes (a rename is a copy and a delete), agent calls, changes to its
configuration (including the account that ran `oe sso`), updates, rollbacks and licences.

```json
{"ts":"2026-09-25T09:12:03.411Z","actor":{"email":"rock@example.com"},"ip":"10.0.0.7","action":"file.copy","target":"s3://sales/2026/q3.parquet","outcome":"ok","detail":{"to":"s3://sales/2026/q3-final.parquet"}}
```

On Google Cloud, `"audit": { "gcp_project": "<project>" }` in the config sends every entry to Cloud
Logging as well, in the log `objectexplorer-audit`, with the machine's own Google credentials. The
local file is always written first, and an entry Cloud Logging refused stays there.

## Updating a server {#updating-an-enterprise-server}

A server that signs people in never updates itself, and **Check for Updates** in its window only
shows the commands. Each version is installed beside the others, so going back is one command.

| Command             | What it does                                                                      |
|---------------------|-----------------------------------------------------------------------------------|
| `oe check`          | this copy, the version in use, what is installed and the latest release           |
| `oe upgrade`        | downloads the latest release, checks its sha256, installs it and makes it current |
| `oe upgrade 0.9.1`  | the same, for one version                                                         |
| `oe rollback`       | back to the newest installed version older than the one in use                    |
| `oe rollback 0.9.0` | back to that version, which must be installed                                     |
| `oe versions`       | every installed version, the one in use marked `*`                                |

Versions go in `~/.objectexplorer/versions/<version>/`, and `~/.objectexplorer/current` points at
the one in use. Point your service at `current`, so that after `upgrade` or `rollback` a restart is
all it takes:

```sh
oe upgrade && sudo systemctl restart objectexplorer
```

An upgrade, a rollback and a licence are lines in the audit log, with the account that ran them.

## Running as a service

On Linux with systemd, as an account of its own named `objectexplorer`:

1. Install the first version, as that account. This makes `~/.objectexplorer/current`:

   ```sh
   sudo -u objectexplorer -i ./objectexplorer upgrade
   ```

   (`./objectexplorer` is the binary from the Linux tarball, run once from wherever you unpacked it.)

2. Save the sign-in and the licence the same way, as that account, so the service starts with no
   secret on its command line:

   ```sh
   sudo -u objectexplorer -i ~/.objectexplorer/current/objectexplorer sso oidc \
   	issuer=https://integrator-1234567.okta.com client_id=<client id> label=Okta --file secret.txt
   sudo -u objectexplorer -i ~/.objectexplorer/current/objectexplorer licence /path/to/licence.txt
   ```

3. Write the service, with the settings of your scenario after the binary:

   ```ini
   # /etc/systemd/system/objectexplorer.service
   [Service]
   User=objectexplorer
   # ports below 1024, like 443 and 80, without running as root
   AmbientCapabilities=CAP_NET_BIND_SERVICE
   ExecStart=/home/objectexplorer/.objectexplorer/current/objectexplorer \
   	open=false \
   	host=0.0.0.0 \
   	http_port=80 \
   	https_port=443 \
   	domain=oe.example.com \
   	tls=auto
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

4. Start it, and have it start with the machine:

   ```sh
   sudo systemctl enable --now objectexplorer
   ```

On a Mac, `brew services start objectexplorer` runs the Homebrew copy the same way, as your own
account, with `open=false`; settings go in `~/.objectexplorer/server.json`.

Next: [troubleshooting](/reference/troubleshooting).
