# Authentication with SAML

An [enterprise server](/reference/deployment#enterprise) can ask everyone to sign in with your
organization's identity provider before they see anything. This page sets it up with **SAML 2.0**.
For OpenID Connect, see [authentication with OIDC](/reference/authentication-oidc).

With sign-in on, every page and every API call needs a signed-in person. Without it, anyone who can
reach the server uses it — keep such a server behind a VPN or a load balancer with its own sign-in.

## Set it up

Type your server's domain, and the commands and addresses on this page use it.

<DomainInput />

Everything is done on the server, as the account that runs it. Every command here is
`npx @knockdata/objectexplorer …`, or `oe …` once you have
[the `oe` command](/reference/deployment#the-command).

### 1. The addresses to register

```sh
npx @knockdata/objectexplorer sso show domain=oe.example.com
```

prints the addresses the identity provider asks for:

| name | value                                      |
|-------------------------------------|--------------------------------------------|
| single sign-on URL (ACS)            | `https://oe.example.com/api/saml/acs`      |
| audience URI / entity ID            | `https://oe.example.com/api/saml/metadata` |

### 2. Register the server at Okta

1. In the Okta admin console: **Applications → Create App Integration → SAML 2.0**.
2. **Single sign-on URL**: the ACS URL above (leave "Use this for Recipient URL and Destination
   URL" ticked). **Audience URI (SP Entity ID)**: the audience URI above.
3. **Name ID format**: *EmailAddress*; **Application username**: *Email*.
4. **Attribute statements**: `email` = `user.email`, `name` = `user.firstName + " " + user.lastName`.
   Use that expression rather than `user.displayName`, which Okta leaves empty for many users.
   Without a name, the account menu and Settings → Account show only the email. **Group attribute
   statements**: `groups`, filter *Matches regex* `.*` — this is how admins are recognized by
   group.
5. Finish the wizard, then on the app's **Sign On** tab, copy the **Metadata URL**.

Signed assertions are required; encrypted assertions are not supported, so leave assertion
encryption off.

### 3. Assign who may sign in

A new SAML app has nobody assigned, and Okta turns everyone away with *User is not assigned to
this application* until someone is. On the app's **Assignments** tab:

1. **Assign → Assign to Groups** (or **Assign to People** for one person).
2. Click **Assign** beside each group or person, then **Done**. For a person, Okta asks for their
   user name: keep the email it fills in.

Someone added later to an assigned group can sign in straight away.

### 4. Start the server with the metadata

The first start takes the metadata URL beside `sso=saml`. The server reads it, saves where to send
people and the certificate Okta signs with, then starts:

```sh
npx @knockdata/objectexplorer \
	deployment=enterprise \
	host=0.0.0.0 \
	domain=oe.example.com \
	protocol=https \
	sso=saml \
	metadata=<metadata URL> \
	label=Okta \
	admins="rock@example.com;group:objectexplorer-admins"
```

`metadata` is the URL, or a downloaded metadata file. `label` is the name on the sign-in button. `admins` is who administers the server: see
[admins and users](#admins-and-users).

Every start after that is the same command without them:

```sh
npx @knockdata/objectexplorer \
	deployment=enterprise \
	host=0.0.0.0 \
	domain=oe.example.com \
	protocol=https \
	sso=saml
```

When Okta's signing certificate changes, start once with `metadata=` again.
`npx @knockdata/objectexplorer sso show` prints what is saved.

Starting with only `sso=saml` before anything is saved stops the server at once:

```
sso=saml is not set up yet. Add metadata= to this command once (npx @knockdata/objectexplorer sso show lists what to register)
```

`sso=` needs `deployment=enterprise` and `domain=`. The rest of the start settings are in
[deployments and start settings](/reference/deployment).

## Admins and users

Everyone the identity provider lets in is a **user**: they browse, preview, query and search what
the server's roots expose, and change files the server may change. An **admin** can also connect or
disconnect clouds, change the roots everyone sees, run Python and command-line tools (they run as
the server's own account), look after the agent door, and open **Settings → Admin**: the server's
version, licence, sign-in and certificate.

Name the admins when the server starts, separated by `;`: an email for one person, `group:<name>`
for everyone in a group the identity provider sends.

```sh
admins="rock@example.com;group:objectexplorer-admins"
```

It replaces the saved list, so give the whole list each time; a start without it keeps the admins
saved last time. To change one without restarting:

```sh
npx @knockdata/objectexplorer admins add group:objectexplorer-admins    # everyone in this group
npx @knockdata/objectexplorer admins add rock@example.com               # one person
npx @knockdata/objectexplorer admins list
npx @knockdata/objectexplorer admins remove <email | group:name>
```

Until there is an admin, the server warns at start that everyone who signs in is a user. The role
is worked out when someone signs in, so a change reaches them at their next sign-in.

## Sessions

A session lasts until the person signs out, is idle for 8 hours, or 12 hours have passed since
signing in. The initials at the bottom of the activity bar, above the settings gear, are who is
signed in. Hovering shows their name; clicking them opens a menu with their name above their email,
and **Sign out**, which ends the session on the server.
**Settings → Account** shows the same: who is signed in, as a user or an admin, with its own
**Sign out**. Restarting the server ends every session; with single sign-on, signing in again is one click.

## What leaves the server

Nothing: the server only receives the answer your browser brings back from the identity provider,
and reads the metadata at the start that is given `metadata=`. Nothing about who signs in is sent to us.

Next: [deployments and start settings](/reference/deployment).
