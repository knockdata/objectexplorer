# Sign-in with SAML

A [server](/self-hosting/) can ask everyone to sign in with your organization's identity
provider before they see anything. This page sets it up with **SAML 2.0**. For OpenID Connect, see
[sign-in with OIDC](/self-hosting/sign-in-oidc).

With sign-in on, every page and every API call needs a signed-in person. A server that other machines
can reach refuses to start without a sign-in, unless it is started with `public=true`.

Signing in decides who is using the server, not what they may configure: clouds, roots, Python and
the agent door are configured on the server's own machine only — see
[who may do what](/self-hosting/#who-may-do-what).

## Set it up

Type your server's domain, and the commands and addresses on this page use it.

<DomainInput />

Everything is done on the server, as the account that runs it, with `oe` (or `objectexplorer`
followed by the same words). It writes into the server's
[config](/self-hosting/#the-config-file), `~/.objectexplorer/server.json`, or the file given with
`config=`.

### 1. The addresses to register

```sh
oe sso show domain=oe.example.com
```

prints the addresses the identity provider asks for:

| Name                     | Value                                  |
|--------------------------|----------------------------------------|
| single sign-on URL (ACS) | `https://oe.example.com/saml/acs`      |
| audience URI / entity ID | `https://oe.example.com/saml/metadata` |

The entity ID is also the address of the server's own metadata, for an identity provider that reads
it. Single Logout comes back to `https://oe.example.com/saml/logout`.

### 2. Register the server at Okta

1. In the Okta admin console: **Applications → Create App Integration → SAML 2.0**.
2. **Single sign-on URL**: the ACS URL above (leave "Use this for Recipient URL and Destination
   URL" ticked). **Audience URI (SP Entity ID)**: the audience URI above.
3. **Name ID format**: *EmailAddress*; **Application username**: *Email*.
4. **Attribute statements**: `email` = `user.email`, `name` = `user.firstName + " " + user.lastName`.
   Use that expression rather than `user.displayName`, which Okta leaves empty for many users.
   Without a `name`, the server uses `firstName` and `lastName` when they are sent, and otherwise
   shows only the email.
5. Finish the wizard, then on the app's **Sign On** tab, copy the **Metadata URL**.

Signed assertions are required. Encrypted assertions work too, when the server has a key of its own
(`sp_key` and `sp_certificate` in the `saml` key of the config).

### 3. Assign who may sign in

A new SAML app has nobody assigned, and Okta turns everyone away with *User is not assigned to
this application* until someone is. On the app's **Assignments** tab:

1. **Assign → Assign to Groups** (or **Assign to People** for one person).
2. Click **Assign** beside each group or person, then **Done**. For a person, Okta asks for their
   user name: keep the email it fills in.

Someone added later to an assigned group can sign in straight away.

### 4. Save it

```sh
oe sso saml metadata=<metadata URL> label=Okta
```

`metadata` is the URL, or a downloaded metadata file. A URL is read again each time the server
starts, so a signing certificate Okta rolls over is picked up by a restart; a file is kept in the
config as it is. `label` is the name on the sign-in button.

### 5. Start the server

The sign-in applies when the server starts again:

```sh
objectexplorer host=0.0.0.0 https_port=443 http_port=80 domain=oe.example.com tls=auto
```

The certificate for `tls=auto` is on [domain and certificate](/self-hosting/domain-and-certificate).

`oe sso show` prints what is saved. Every change is a line in the
[audit log](/self-hosting/#the-audit-log), with the account that ran it.

## Sessions

A session lasts until the person signs out, is idle for 8 hours, or 12 hours have passed since
signing in. The account icon at the bottom of the activity bar, above the settings gear, is who is
signed in; clicking it opens a menu with their name above their email, **Account…**, and **Sign out
of this server**. When the identity provider's metadata names a Single Logout address, signing out
ends the session there too, and a logout the identity provider starts ends that person's sessions on
the server.

**Settings → Account** shows the same: who is signed in, and how, with its own **Sign out**.
Restarting the server ends every session; with single sign-on, signing in again is one click.

## What leaves the server

Nothing but the metadata request: the server only receives the answer your browser brings back
from the identity provider, and reads a metadata URL when it starts. Nothing about who signs in is
sent to us.

Next: [running as a service](/self-hosting/#running-as-a-service).
