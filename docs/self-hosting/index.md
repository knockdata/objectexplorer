# Running your own server

This part is for whoever runs ObjectExplorer for other people: an admin who puts it on a server at a
company, so a team opens it in their browsers and signs in with the company's accounts.

ObjectExplorer is one binary, and it behaves the same however you got it: the desktop app, npm,
Homebrew, a tarball on a server. What differs is how it is started, and what its plan allows.

The steps, in order:

1. Pick the [scenario](#scenarios) that fits your network, below.
2. Give it a [domain and a certificate](/self-hosting/domain-and-certificate), for https.
3. Set up [sign-in](#sign-in), with [OIDC](/self-hosting/sign-in-oidc) or
   [SAML](/self-hosting/sign-in-saml).
4. Install a [licence](#installing-a-licence), or run the [trial](#the-trial).
5. [Run it as a service](#running-as-a-service), so it starts with the machine.

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
by [http-01](/self-hosting/domain-and-certificate#http-01-the-internet-can-reach-the-machine).

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
`http_port=8080 https_port=8443` instead. The details are on
[domain and certificate](/self-hosting/domain-and-certificate).

### A server on a private network

The internet cannot reach the machine, so Let's Encrypt cannot connect to it to check the domain.
Get the certificate from Let's Encrypt anyway, through one DNS record:
[dns-01](/self-hosting/domain-and-certificate#dns-01-the-machine-is-behind-a-firewall). Or use
[your own certificate files](/self-hosting/domain-and-certificate#your-own-certificate-files), from
your company's authority.

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

::: warning Other machines can reach it
`host=0.0.0.0`, or any address other than `127.0.0.1`, lets other machines reach this copy. Without
a sign-in it refuses to start, unless you add `public=true`: then nothing asks them to sign in, and
they use whatever the owner shared. Only do that on a network you control.
:::

## Sign-in {#sign-in}

A server signs people in when its config has any of these:

| Key      | Who gets in                                                                                                    |
|----------|----------------------------------------------------------------------------------------------------------------|
| `oidc`   | anyone your identity provider lets in, by OpenID Connect — see [sign-in with OIDC](/self-hosting/sign-in-oidc) |
| `saml`   | anyone your identity provider lets in, by SAML 2.0 — see [sign-in with SAML](/self-hosting/sign-in-saml)       |
| `tokens` | a desktop window or a script holding one of the fixed tokens you wrote down                                    |

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
else `server.json` in the [data folder](#the-data-folder), `~/.objectexplorer/server.json`, when it
exists. An argument on the command line wins over the
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
| `acme`                                 | how `tls=auto` gets its certificate ([the acme key](/self-hosting/domain-and-certificate#the-acme-key))  |
| `oidc`, `saml`, `tokens`               | the [sign-in](#sign-in)                                                                                  |
| `roots`, `remote_python`, `remote_web` | [what other machines may reach](#what-other-machines-may-reach)                                          |
| `audit`                                | the [audit log](#the-audit-log)'s Cloud Logging project                                                  |
| `enterprise`                           | `true`: an enterprise server before it has a licence, on its [trial](#the-trial)                         |

## Start settings

| Setting      | Values                                | Default              | What it does                                                                                     |
|--------------|---------------------------------------|----------------------|--------------------------------------------------------------------------------------------------|
| `host`       | `127.0.0.1`, `0.0.0.0`, or an address | `127.0.0.1`          | where it listens; `127.0.0.1` is this machine only                                               |
| `http_port`  | a number                              | `9421`               | the plain listener; with `tls` it answers Let's Encrypt and sends the rest to https              |
| `https_port` | a number                              |                      | the TLS listener, needed with `tls`                                                              |
| `tls`        | `auto`, or `<chain.pem>,<key.pem>`    |                      | https with a certificate from Let's Encrypt, or with your own                                    |
| `domain`     | a name, like `oe.example.com`         |                      | the name people use to reach it; the certificate's name; a licence for a domain counts only here |
| `public`     | `true`                                | `false`              | serve other machines without sign-in                                                             |
| `licence`    | a licence file, or its text           |                      | installed before the server starts; one that does not verify stops the start                     |
| `mode`       | `full`, `instant`                     | `full`               | `instant`: one read-only folder, see [instant mode](/reference/instant-mode)                     |
| `cloud`      | `on`, `off`                           | `on`                 | `off`: storage is the disk only; no cloud can be added                                           |
| `base`       | a folder                              | the built-in app     | read only, served as it is — see [the base folder](#the-base-folder)                             |
| `data`       | a folder                              | `~/.objectexplorer`  | where the server writes — see [the data folder](#the-data-folder)                                |
| `open`       | `true`, `false`                       | `true`               | open the browser when it starts                                                                  |
| `config`     | a JSON file                           | `<data>/server.json` | everything else                                                                                  |

The window's own settings, `window=`, `connect=`, `record=` and the rest, are on
[the command line](/reference/command-line#starting-it).

The server refuses to start, with a message, when the settings cannot work: `tls` without
`https_port`, `tls=auto` without `domain`, a host other machines can reach without a sign-in or
`public=true`, or a licence that does not verify. The certificate's own reasons are on
[domain and certificate](/self-hosting/domain-and-certificate#when-it-does-not-start).

## The data folder

Everything the server writes goes in one folder, `~/.objectexplorer` of the account that runs it.
`data=<folder>` moves it, all of it together:

| In the data folder | What it is                                                                            |
|--------------------|---------------------------------------------------------------------------------------|
| `server.json`      | the [config file](#the-config-file), unless `config=` names another                   |
| `licence`          | the [licence](#installing-a-licence)                                                  |
| `certs/<domain>/`  | the [certificate](/self-hosting/domain-and-certificate#where-the-certificate-is-kept) |
| `audit/`           | the [audit log](#the-audit-log)                                                       |
| `explorer.db`      | what the app remembers — see [where your data lives](/reference/data-locations)       |

```sh
objectexplorer data=/srv/objectexplorer
```

## The base folder

`base=<folder>` serves one read-only folder as it is: the file `<folder>/docs/guide.html` is the
page `/docs/guide.html`. Only `/api/` is the server's own. The server never writes into it.

Where the app is:

- `base` has an `app/` folder: the app is at `/app/`, and `base` itself is a site at `/`.
- Otherwise the app is at `/`: `base`'s own `index.html` when it has one, else the app built into
  the binary.

A `demo/` folder in it is what [instant mode](/reference/instant-mode) serves.

Most servers need no `base=`: the app built into the binary is at `/`. Give one when you want a few
static folders served beside the app, like a folder of documents at `/docs/`.

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

Next: [domain and certificate](/self-hosting/domain-and-certificate).
