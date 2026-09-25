# Deployments and start settings

ObjectExplorer is one product that runs in a few different shapes. Two separate choices decide how
a copy behaves:

- **what it is**: the `deployment`. It decides who the copy is for, how it updates, and whether it
  needs a licence.
- **how it is reached**: `host`, `port`, `domain`, `protocol`, `certificate` and `key`. These work
  the same whatever the deployment is.

Every setting is written as `name=value` after the command, in any order. Type your server's
domain, and the commands on this page use it.

<DomainInput />

```sh
npx @knockdata/objectexplorer host=0.0.0.0 port=9421
```

## The command

Every command on these pages is `npx @knockdata/objectexplorer …`. It needs Node.js, and npx
fetches the latest published version each time.

`oe` is the same command, shorter: `oe check` does what `npx @knockdata/objectexplorer check`
does. There are two ways to have it:

- **From npm**: `npm install -g @knockdata/objectexplorer` puts `oe` on your PATH. It then runs the
  version you installed, until you install again.
- **From the desktop app**: open the command palette (⇧⌘P, or Ctrl+Shift+P on Windows and Linux) and
  run **Shell Command: Install 'oe' command in PATH**. `oe` then runs the desktop app's own
  version, with no Node.js needed. **Settings → About** shows where it went, and
  **Shell Command: Uninstall 'oe' command from PATH** removes it.

| platform | where the desktop app puts `oe`                   | what it asks                                  |
|----------|---------------------------------------------------|-----------------------------------------------|
| macOS    | `/usr/local/bin/oe`                               | your password, when that folder needs it      |
| Linux    | `~/.local/bin/oe`                                 | nothing; that folder must be on your PATH     |
| Windows  | `%LOCALAPPDATA%\Microsoft\WindowsApps\oe.cmd`     | nothing; that folder is on every user's PATH  |

A file named `oe` that is not ObjectExplorer's is left alone, and the install says so.

## The deployments

| deployment   | how you get it                                            | who it is for            | updates                                          | licence                      |
|--------------|-----------------------------------------------------------|--------------------------|--------------------------------------------------|------------------------------|
| `desktop`    | the [desktop app](/getting-started#download)              | you, on your own machine | by itself, see [updating](/reference/updating)   | your plan                    |
| `package`    | `npx @knockdata/objectexplorer`; the default              | you, in your own browser | the **Update** button, or npx fetches the latest | your plan                    |
| `enterprise` | `npx @knockdata/objectexplorer deployment=enterprise`     | a team, on a server      | only by an admin, on the server                  | a licence, or a 14-day trial |
| `instant`    | [objectexplorer.com/app](https://objectexplorer.com/app/) | anyone, to try it        | we update it                                     | none                         |

`desktop` and `instant` are set by the app and the website themselves. On the command line you
choose between `package` and `enterprise`.

### package

The copy you run for yourself. It opens your browser when it starts, reads the folders on your
machine and the cloud storage you connect, and updates itself from
**Settings → Check for Updates**.

### enterprise

A server that a team reaches from their own browsers. Compared with `package`:

- it never opens a browser, and never updates itself: an admin updates it on the server (see
  [updating an enterprise server](#updating-an-enterprise-server))
- it needs a licence. Without one it runs a 14-day trial from the first time it starts (see
  [the trial](#the-trial))
- people sign in with your identity provider when it starts with `sso=oidc` or `sso=saml`: see
  [authentication with OIDC](/reference/authentication-oidc) and
  [authentication with SAML](/reference/authentication-saml). Without that, keep it behind
  something that controls who reaches it: a VPN, a firewall rule, or a load balancer with its own
  sign-in
- with sign-in, **Settings → Account** shows who is signed in, and an admin's
  **Settings → Admin** shows how the server is set up: its version, licence, sign-in and
  certificate
- it writes an [audit log](#the-audit-log)

### instant

The copy on [objectexplorer.com/app](https://objectexplorer.com/app/). It shows the demo data only:
it has no cloud connections, it cannot read the machine it runs on, and "add folder" opens your
browser's own folder picker, so what you add stays in your browser. Signing in keeps the account and
its week of Pro in the browser too, and **Download app** above the account icon offers the
installers.

## Scenarios

Each scenario runs from nothing to a working copy. The team scenarios share the last steps:
[sign-in](#sign-in-and-admins) and [running as a service](#running-as-a-service).

### On your own machine

Nothing to set. Only this machine can reach it, and it opens your browser:

```sh
npx @knockdata/objectexplorer
```

A folder after the command is added to the tree on the first start:
`npx @knockdata/objectexplorer ~/data`.

### A team server on a private network

The machine is on your company network, and the internet cannot reach it. The certificate comes
from Let's Encrypt through the [DNS check](#the-dns-check-one-record-added-once), which needs a
licence issued for the domain. During the trial, use
[your own certificate](#with-your-own-certificate) instead.

1. In your DNS, point `oe.example.com` at the machine's address on your network, and add the one
   record the DNS check needs, once:

   ```
   _acme-challenge.oe.example.com  CNAME  oe.example.com.acme.objectexplorer.com
   ```

2. Register the server at your identity provider: [OIDC](/reference/authentication-oidc) or
   [SAML](/reference/authentication-saml).
3. Start it once with the licence and what the identity provider gave you, here for OIDC:

   ```sh
   npx @knockdata/objectexplorer \
   	deployment=enterprise \
   	host=0.0.0.0 \
   	port=443 \
   	domain=oe.example.com \
   	protocol=https \
   	licence=/path/to/licence.txt \
   	sso=oidc \
   	issuer=https://integrator-1234567.okta.com \
   	clientId=<client id> \
   	clientSecret=<client secret> \
   	admins="rock@example.com;group:objectexplorer-admins"
   ```

   The licence, the sign-in settings and the admins are saved, so every later start leaves them
   out. See [sign-in and admins](#sign-in-and-admins).
4. Keep it running: see [running as a service](#running-as-a-service).

### A server the internet can reach

The machine has a public address, and ports 80 and 443 are open to it. The certificate comes from
Let's Encrypt through the [web check](#the-web-check-port-80), which works during the trial too.

1. Point `oe.example.com` at the machine's public address.
2. Start it:

   ```sh
   npx @knockdata/objectexplorer \
   	deployment=enterprise \
   	host=0.0.0.0 \
   	port=443 \
   	domain=oe.example.com \
   	protocol=https \
   	challenge=http-01
   ```

   It listens on port 80 as well: for the web check, and to redirect plain http to https.
3. Everyone on the internet can now reach it, so turn on [sign-in](#sign-in-and-admins) before
   anyone uses it, and [run it as a service](#running-as-a-service).

### Behind a load balancer or reverse proxy

The load balancer ends TLS and forwards plain http to the machine. The server needs no certificate:

```sh
npx @knockdata/objectexplorer \
	deployment=enterprise \
	host=0.0.0.0 \
	port=9421 \
	domain=oe.example.com
```

Point `oe.example.com` at the load balancer. Sign-in needs the address people see, so `domain=` is
the load balancer's name. Then [sign-in](#sign-in-and-admins) and
[running as a service](#running-as-a-service).

### With your own certificate

A certificate from your company CA, or bought from anyone:

```sh
npx @knockdata/objectexplorer \
	deployment=enterprise \
	host=0.0.0.0 \
	port=443 \
	domain=oe.example.com \
	certificate=/etc/ssl/oe/fullchain.pem \
	key=/etc/ssl/oe/privkey.pem
```

Point `oe.example.com` at the machine. The server reads the certificate when it starts, so restart
it after you renew the certificate. Then [sign-in](#sign-in-and-admins) and
[running as a service](#running-as-a-service).

::: warning Other machines can reach it
`host=0.0.0.0`, or any address other than `localhost`, lets other machines reach this copy. Without
`sso=`, nothing asks them to sign in, and every request runs with the credentials of the account
that started the server: its folders, and every cloud connection added to it. A copy started this
way without sign-in prints a warning. Only do it on a network you control.
:::

### Sign-in and admins

Add `sso=oidc` or `sso=saml` to any enterprise start above. The first start also takes what your
identity provider gave you and saves it, so later starts leave that out. The steps at the identity
provider, including who may sign in, are on [authentication with OIDC](/reference/authentication-oidc)
and [authentication with SAML](/reference/authentication-saml).

Until there is an admin, everyone who signs in is a user. Name the admins on the same start with
`admins=`, separated by `;`: an email for one person, `group:<name>` for everyone in a group.

```sh
admins="rock@example.com;group:objectexplorer-admins"
```

It replaces the saved list, so it is the whole list every time. A start without it keeps the
admins saved last time. To change one without restarting, as the account that runs the server:

```sh
npx @knockdata/objectexplorer admins add group:objectexplorer-admins
```

## Start settings

### How it is reached

| setting       | values                                               | default                                        | what it does                                                                                                                    |
|---------------|------------------------------------------------------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `host`        | `localhost`, `0.0.0.0`, or an address of the machine | `localhost`                                    | where it listens. `localhost` is this machine only; `0.0.0.0` is every network it is on                                         |
| `port`        | a number                                             | `9421`                                         | the port. On `localhost`, a port in use moves up to the next free one; any other host keeps exactly the port you gave           |
| `domain`      | a name, like `oe.example.com`                        | none                                           | the name people use to reach it. It needs a `host` other machines can reach                                                     |
| `protocol`    | `http`, `https`                                      | `http`, or `https` when a certificate is given | `https` serves TLS itself: with your own certificate, or with one from Let's Encrypt (see [certificates](#certificates))        |
| `certificate` | path to a PEM file                                   | none                                           | your own certificate chain, like `fullchain.pem`                                                                                |
| `key`         | path to a PEM file                                   | none                                           | the private key of that certificate, like `privkey.pem`                                                                         |
| `challenge`   | `dns-01`, `http-01`                                  | `dns-01`                                       | how Let's Encrypt checks the domain is yours, when there is no `certificate`                                                    |
| `httpPort`    | a number                                             | `80`                                           | where `challenge=http-01` is answered, and plain http is redirected to https                                                    |
| `staging`     | `true`                                               | off                                            | use Let's Encrypt's test CA: its certificates are not trusted by browsers, and its limits are generous — for trying a setup out |

### Other settings

| setting                                       | what it does                                                                                                                     |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `deployment`                                  | `package` or `enterprise`, see above                                                                                             |
| `licence`                                     | a licence file, or the licence text itself, installed before the server starts                                                   |
| `sso`                                         | `oidc` or `saml`: everyone signs in first, see [OIDC](/reference/authentication-oidc) and [SAML](/reference/authentication-saml) |
| `issuer`, `clientId`, `clientSecret`, `label` | with `sso=oidc`: saved for later starts, see [OIDC](/reference/authentication-oidc)                                              |
| `metadata`, `label`                           | with `sso=saml`: saved for later starts, see [SAML](/reference/authentication-saml)                                              |
| `admins`                                      | with `sso=`: `;`-separated emails and `group:<name>`, replacing the saved [admins](#sign-in-and-admins)                          |
| `auditLog`                                    | `gcp:<project>`: also send the [audit log](#the-audit-log) to Cloud Logging                                                      |
| `open=0`                                      | do not open a browser when a `package` copy starts                                                                               |
| a folder                                      | a word with no `=` is a folder to show in the tree on the first start                                                            |

### Settings that are refused

The server stops at start, with a message, when the settings contradict each other:

| you gave                                            | why it is refused                                        |
|-----------------------------------------------------|----------------------------------------------------------|
| `domain=` with `host=localhost`                     | nobody but this machine could reach that name            |
| `protocol=https` without `domain` or `certificate`  | a certificate from Let's Encrypt is for a domain         |
| `certificate=` without `key=`                       | a certificate is no use without its key                  |
| `certificate=` with `protocol=http`                 | the certificate would never be used                      |
| `challenge=` with `certificate=`                    | your own certificate needs no challenge                  |
| `challenge=` other than `dns-01` or `http-01`       | those are the two the server answers                     |
| `challenge=dns-01` without a licence for the domain | the licence is what lets the server write the challenge  |
| `deployment=` other than `package` or `enterprise`  | the other two are set by the app and the website         |
| `licence=` that does not verify                     | a licence is checked before it is installed, never after |
| `sso=` other than `oidc` or `saml`                  | those are the two sign-in standards supported            |
| `sso=` without `deployment=enterprise` or `domain=` | sign-in is for an enterprise server reached by a name    |
| `admins=` without `sso=`                            | admins are only told apart on a server people sign in to |
| `sso=oidc` or `sso=saml` before anything is saved   | there is no identity provider to send people to yet      |

## Certificates

With `protocol=https`, the server needs a certificate. There are three ways to give it one:

| how                                | settings                                                    | the machine must be reachable from the internet | renewing                          |
|------------------------------------|-------------------------------------------------------------|-------------------------------------------------|-----------------------------------|
| your own                           | `certificate=` and `key=`                                   | no                                              | yours; restart after replacing it |
| Let's Encrypt, DNS check (default) | `domain=`, a licence for it, and one DNS record, added once | no                                              | by the server, while it runs      |
| Let's Encrypt, web check           | `domain=` and `challenge=http-01`                           | yes, on port 80                                 | by the server, while it runs      |

### The DNS check: one record, added once

Let's Encrypt proves a domain is yours by looking up a TXT record under it, and asks for a new
value every time. Instead of changing your DNS every time, you point that name at ours once, and
the server puts each value there itself. This is what lets a server on a private network, which
the internet cannot reach, still get a certificate every browser trusts.

The record is the same rule for every domain: `_acme-challenge.` in front of your domain, pointing
at your domain followed by `.acme.objectexplorer.com`. For `oe.example.com`:

```
_acme-challenge.oe.example.com  CNAME  oe.example.com.acme.objectexplorer.com
```

In your DNS provider's console that is a `CNAME` record named `_acme-challenge.oe.example.com` —
most consoles add the zone for you, so type only the part before it — with the value
`oe.example.com.acme.objectexplorer.com`. You can add it before the server ever starts. If it is
missing, the server prints it, and `npx @knockdata/objectexplorer check` shows it.

The DNS check needs the [licence](#installing-a-licence) issued for that domain: the name is the
same rule for everyone, so the licence is what proves the domain is yours before a challenge is
put under it. During the trial, use `challenge=http-01` or your own certificate.

Until the record is visible, the server does not serve https; it checks every minute and starts by
itself. After that, renewing needs nothing from you: the server renews when a third of the
certificate's life is left, and the next connection gets the new one without a restart.

What leaves the server: the domain name, to Let's Encrypt, and the challenge value with the
licence, to objectexplorer.com. Your certificate's private key is made on the server and never
leaves it. Moving the server to another machine needs no DNS change: the record names the domain,
not the machine.

### The web check: port 80

With `challenge=http-01`, Let's Encrypt fetches a file from `http://<domain>/.well-known/acme-challenge/`
instead. The domain's DNS must point at the machine, and port 80 must be reachable from the
internet. The server listens on port 80 (or `httpPort`) for that, and redirects every other request
to https.

## The trial

An `enterprise` server with no licence runs a 14-day trial from the first time it starts. The start
date is written once, to `~/.objectexplorer/enterpriseTrial`.

- **Days 1 to 7:** only **Settings → Plan**, which an admin sees, says how many days are left.
- **Days 8 to 14:** a banner at the top of the window, a little more urgent each day. Closing it
  hides it until the next day.
- **After day 14:** everything keeps working. The banner says the server is unlicensed, and it
  cannot be closed.

## Installing a licence

On the server, as the account that runs it:

```sh
npx @knockdata/objectexplorer licence /path/to/licence.txt
```

The text of the licence works too, pasted in place of the path, and so does `licence=` at start.
The licence is checked before it is written. The running server picks it up without a restart, and
the banner goes away.

A licence can be issued for one domain. It then counts only on a server started with that
`domain=`, and installing it anywhere else is refused.

## The audit log

An enterprise server writes one line per event to `~/.objectexplorer/audit/<date>.ndjson`: sign-ins
(and failed ones, with the reason), sign-outs, file copies, moves, renames, deletes and uploads,
agent calls, admin changes (including refused attempts), updates, rollbacks and licence changes.

```json
{"ts":"2026-09-25T09:12:03.411Z","actor":{"email":"rock@example.com"},"ip":"10.0.0.7","action":"file.rename","target":"gcs/sales/2026/q3.parquet","outcome":"ok","detail":{"name":"q3-final.parquet"}}
```

On Google Cloud, start the server with `auditLog=gcp:<project>` to send every entry to Cloud Logging
as well, in the log `objectexplorer-audit`, with the machine's own service account. The local file
is always written first.

## The admin commands

Run on the server, as the account that runs it. Each is `npx @knockdata/objectexplorer <command>`,
or `oe <command>` with [the shorter command](#the-command).

| command                                       | what it does                                                                                            |
|-----------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `check`                                       | the installed versions, the one in use, the latest published, the licence or trial, and the certificate |
| `upgrade`                                     | installs the latest version and makes it the one in use                                                 |
| `upgrade 0.8.0`                               | the same, for one version                                                                               |
| `rollback`                                    | goes back to the newest installed version older than the one in use                                     |
| `rollback 0.7.6`                              | goes back to that version, which must be installed                                                      |
| `versions`                                    | every installed version, the one in use marked `*`                                                      |
| `licence <file>`                              | installs or replaces the licence                                                                        |
| `sso show`                                    | the identity provider saved for sign-in, and the addresses to register at it                            |
| `sso oidc issuer=… clientId=… clientSecret=…` | saves OIDC sign-in without starting the server                                                          |
| `sso saml metadata=…`                         | saves SAML sign-in without starting the server                                                          |
| `admins add <email or group:name>`            | makes a person, or everyone in a group, an admin                                                        |
| `admins remove <email or group:name>`         | takes that back                                                                                         |
| `admins list`                                 | the admins                                                                                              |
| `version`                                     | the version of this copy of the command                                                                 |

## Updating an enterprise server

An enterprise server never updates itself, and **Settings → Check for Updates** in its window only
shows the commands. Each version is installed beside the others, so going back is one command.

Versions go in `~/.objectexplorer/versions/<version>/`, and `~/.objectexplorer/current` points at
the one in use. Point your service at `current`, so that after `upgrade` or `rollback` a restart is
all it takes:

```sh
npx @knockdata/objectexplorer upgrade && \
	sudo systemctl restart objectexplorer
```

The running server keeps its version until it is restarted. The commands change nothing else.

## Running as a service

A server that starts with the machine, runs from the version in use, and is restarted after an
update. On Linux with systemd, as an account of its own named `objectexplorer`:

1. Install the first version, as that account. This makes `~/.objectexplorer/current`:

   ```sh
   sudo -u objectexplorer -i npx @knockdata/objectexplorer upgrade
   ```

2. Save the sign-in and the licence the same way, as that account, so the service starts with no
   secret on its command line:

   ```sh
   sudo -u objectexplorer -i npx @knockdata/objectexplorer sso oidc \
   	issuer=https://integrator-1234567.okta.com clientId=<client id> clientSecret=<client secret> label=Okta
   sudo -u objectexplorer -i npx @knockdata/objectexplorer licence /path/to/licence.txt
   ```

3. Write the service, with the settings of your scenario after `cli.js`:

   ```ini
   # /etc/systemd/system/objectexplorer.service
   [Service]
   User=objectexplorer
   # ports below 1024, like 443 and 80, without running as root
   AmbientCapabilities=CAP_NET_BIND_SERVICE
   ExecStart=/usr/bin/node \
   	/home/objectexplorer/.objectexplorer/current/node_modules/@knockdata/objectexplorer/cli.js \
   	deployment=enterprise \
   	host=0.0.0.0 \
   	port=443 \
   	domain=oe.example.com \
   	protocol=https \
   	sso=oidc
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

4. Start it, and have it start with the machine:

   ```sh
   sudo systemctl enable --now objectexplorer
   ```

Every admin command, from here on, runs as that account too:
`sudo -u objectexplorer -i npx @knockdata/objectexplorer check`.

## For contributors: running from source

In a checkout of the ObjectExplorer source, `debug=true` runs from the source through vite, with
hot reload, instead of from the built package. It also turns on a few features that are still in
development. It needs the checkout: a copy installed from npm does not carry the source, and
refuses to start with it.

Next: [troubleshooting](/reference/troubleshooting).
