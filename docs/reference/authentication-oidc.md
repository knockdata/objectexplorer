# Authentication with OIDC

A [server](/reference/deployment) can ask everyone to sign in with your organization's identity
provider before they see anything. This page sets it up with **OpenID Connect (OIDC)**. For SAML 2.0,
see [authentication with SAML](/reference/authentication-saml).

With sign-in on, every page and every API call needs a signed-in person. A server that other machines
can reach refuses to start without a sign-in, unless it is started with `public=true`.

Signing in decides who is using the server, not what they may configure. Everyone signed in uses what
the server's owner set up, inside the folders the owner shared; clouds, roots, Python and the agent
door are configured on the server's own machine only — see
[who may do what](/reference/deployment#who-may-do-what).

## Set it up

Type your server's domain, and the commands and addresses on this page use it.

<DomainInput />

Everything is done on the server, as the account that runs it, with `oe` (or `objectexplorer`
followed by the same words). It writes into the server's config, `~/.objectexplorer/server.json`, or
the file given with `config=`.

### 1. The addresses to register

```sh
oe sso show domain=oe.example.com
```

prints the addresses the identity provider asks for:

| Name                  | Value                              |
|-----------------------|------------------------------------|
| sign-in redirect URI  | `https://oe.example.com/callback`  |
| sign-out redirect URI | `https://oe.example.com/signedout` |

The sign-in redirect URI is where Okta sends the browser back to after someone signs in. The
sign-out redirect URI is where Okta sends the browser back to after it has ended the session there.

### 2. Register the server at Okta

1. In the Okta admin console: **Applications → Create App Integration → OIDC - OpenID Connect →
   Web Application**.
2. **Sign-in redirect URIs**: the sign-in redirect URI above. **Sign-out redirect URIs**: the
   sign-out one.
3. **Assignments**: *Limit access to selected groups* and pick the groups who may use the server.
   With nobody assigned, Okta turns everyone away with *User is not assigned to this
   application*. To assign later, or one person at a time, open the app's **Assignments** tab:
   **Assign → Assign to Groups** or **Assign to People**, **Assign** beside each, then **Done**.
4. Copy the **Client ID** and **Client secret** from the **General** tab.

### 3. Find the issuer

The issuer is the address of your Okta organization. It is **not** the address the admin console
shows in your browser: Okta puts the console on its own name, your organization's name with
`-admin` added. Take `-admin` out, and that is the issuer:

| What you see                       | Example                                     |
|------------------------------------|---------------------------------------------|
| the admin console, in your browser | `https://integrator-1234567-admin.okta.com` |
| the issuer                         | `https://integrator-1234567.okta.com`       |

To read it from Okta instead, open the menu under your name at the top right of the admin console:
the address below your email is your **Okta domain**. Put `https://` in front of it. A trailing `/`
makes no difference.

### 4. Save it

```sh
oe sso oidc issuer=https://integrator-1234567.okta.com client_id=<client id> label=Okta
```

The client secret is asked for: paste it, then Ctrl-D, or give it as a file with `--file`. It is
never taken from the command line, where it would stay in your shell history and in the list of
processes. It goes to the system keychain, and the config file holds only a reference to it.

`label` is the name on the sign-in button. `scope=` asks for other scopes than `openid email
profile`. The config then holds:

```json
{
	"domain": "oe.example.com",
	"oidc": { "issuer": "https://integrator-1234567.okta.com", "client_id": "…", "client_secret": "…", "label": "Okta" }
}
```

You can also write the `oidc` key yourself; `redirect_uri` is `https://<domain>/callback` unless it
says otherwise.

### 5. Start the server

The sign-in applies when the server starts again:

```sh
objectexplorer host=0.0.0.0 https_port=443 http_port=80 domain=oe.example.com tls=auto
```

To change the identity provider, or a secret that has been rotated, run `oe sso oidc` again and
restart. `oe sso show` prints what is saved. Every change is a line in the
[audit log](/reference/deployment#the-audit-log), with the account that ran it.

## Sessions

A session lasts until the person signs out, is idle for 8 hours, or 12 hours have passed since
signing in. The account icon at the bottom of the activity bar, above the settings gear, is who is
signed in; clicking it opens a menu with their name above their email, **Account…**, and **Sign out
of this server**, which ends the session at Okta too. The name is the ID token's `name` claim, which
the `profile` scope brings; without one, only the email is shown.

**Settings → Account** shows the same: who is signed in, and how, with its own **Sign out**.
Restarting the server ends every session; with single sign-on, signing in again is one click.

After a sign-in the page shows the session's token too, for a desktop window to connect with:
`objectexplorer connect=https://oe.example.com token=<token>`.

## What leaves the server

Signing in talks to your identity provider only: its configuration, its keys and the tokens.
Nothing about who signs in is sent to us.

Next: [authentication with SAML](/reference/authentication-saml).
