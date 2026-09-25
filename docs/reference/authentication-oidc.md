# Authentication with OIDC

An [enterprise server](/reference/deployment#enterprise) can ask everyone to sign in with your
organization's identity provider before they see anything. This page sets it up with **OpenID
Connect (OIDC)**. For SAML 2.0, see [authentication with SAML](/reference/authentication-saml).

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

| name                  | value                                      |
|-----------------------|--------------------------------------------|
| sign-in redirect URI  | `https://oe.example.com/api/oidc/callback` |
| sign-out redirect URI | `https://oe.example.com/api/oidc/login`    |

The sign-in redirect URI is where Okta sends the browser back to after someone signs in. The
sign-out redirect URI is not where signing out happens: it is where Okta sends the browser back to
after it has ended the session there, and the server passes it on to its sign-in page, ready for
the next sign-in.

### 2. Register the server at Okta

1. In the Okta admin console: **Applications → Create App Integration → OIDC - OpenID Connect →
   Web Application**.
2. **Sign-in redirect URIs**: the sign-in redirect URI above. **Sign-out redirect URIs**: the
   sign-out one.
3. **Assignments**: *Limit access to selected groups* and pick the groups who may use the server.
   With nobody assigned, Okta turns everyone away with *User is not assigned to this
   application*. To assign later, or one person at a time, open the app's **Assignments** tab:
   **Assign → Assign to Groups** or **Assign to People**, **Assign** beside each, then **Done**.
4. On the app's **Sign On** tab, under **OpenID Connect ID Token**, set the **Groups claim type** to
   *Filter*, the name to `groups`, and *Matches regex* `.*` — this is how admins are recognized by
   group.
5. Copy the **Client ID** and **Client secret** from the **General** tab.

### 3. Find the issuer

The issuer is the address of your Okta organization. It is **not** the address the admin console
shows in your browser: Okta puts the console on its own name, your organization's name with
`-admin` added. Take `-admin` out, and that is the issuer:

| what you see                       | example                                     |
|------------------------------------|---------------------------------------------|
| the admin console, in your browser | `https://integrator-1234567-admin.okta.com` |
| the issuer                         | `https://integrator-1234567.okta.com`       |

To read it from Okta instead, open the menu under your name at the top right of the admin console:
the address below your email is your **Okta domain**. Put `https://` in front of it. A trailing `/`
makes no difference.

Use the organization's address itself, not an authorization server under it such as
`https://integrator-1234567.okta.com/oauth2/default`: the groups claim set up in step 2 is added
by the organization's own sign-in, and admins by group would not be recognized.

### 4. Start the server with the issuer, client ID and secret

The first start takes what Okta gave you beside `sso=oidc`. The server saves it, then starts:

```sh
npx @knockdata/objectexplorer \
	deployment=enterprise \
	host=0.0.0.0 \
	domain=oe.example.com \
	protocol=https \
	sso=oidc \
	issuer=https://integrator-1234567.okta.com \
	clientId=<client id> \
	clientSecret=<client secret> \
	label=Okta \
	admins="rock@example.com;group:objectexplorer-admins"
```

`label` is the name on the sign-in button. `admins` is who administers the server: see
[admins and users](#admins-and-users). The client secret is stored encrypted on the server,
never in a plain file.

Every start after that is the same command without them, so the secret is not left in the
server's command line, where other accounts on the machine can see it:

```sh
npx @knockdata/objectexplorer \
	deployment=enterprise \
	host=0.0.0.0 \
	domain=oe.example.com \
	protocol=https \
	sso=oidc
```

To change the identity provider, or a secret that has been rotated, start once with the new values
again. `npx @knockdata/objectexplorer sso show` prints what is saved.

Starting with only `sso=oidc` before anything is saved stops the server at once:

```
sso=oidc is not set up yet. Add issuer= clientId= clientSecret= to this command once (npx @knockdata/objectexplorer sso show lists what to register)
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
signing in. The picture at the bottom of the activity bar, above the settings gear, is who
is signed in: their avatar when the identity provider has one, otherwise their initials. Hovering
shows their name; clicking it opens a menu with their name above their email, and **Sign out**,
which ends the session at Okta too. The name is the ID token's `name` claim, which the `profile`
scope brings; without one, only the email is shown.
**Settings → Account** shows the same: who is signed in, as a user or an admin, with its own
**Sign out**. Restarting the server ends every session; with single sign-on, signing in again is one click.

## What leaves the server

Signing in talks to your identity provider only: its configuration, its keys and the tokens.
Nothing about who signs in is sent to us.

Next: [authentication with SAML](/reference/authentication-saml).
