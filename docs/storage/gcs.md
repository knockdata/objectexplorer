# Google Cloud Storage

GCS calls are signed with an OAuth bearer token. Listing buckets needs a project and a token; the
same token reads the objects.

## Ways to connect

- **Use what this machine already has.** **Settings → Sign-ins → Google** walks the chain below and
  says who it signed in as, and through what.
- **Sign in with Google.** The button runs `gcloud auth login --update-adc`: your browser opens once
  to sign in, and the Application Default Credentials the app reads are written. When `gcloud` is
  missing, the pane shows the command that installs it for your user, and goes on once it is there.
- **A service account key**, for a machine that has no person in front of it. Paste the JSON or drop
  the `.json` file; it is checked before it is kept.

## The credential chain

|   | Source                           | Read from                                                                            |
|---|----------------------------------|--------------------------------------------------------------------------------------|
| 1 | `GOOGLE_APPLICATION_CREDENTIALS` | a service account key, or an authorized user's file                                  |
| 2 | Application Default Credentials  | `application_default_credentials.json` in `CLOUDSDK_CONFIG`, else `~/.config/gcloud` |
| 3 | Metadata server                  | Compute Engine, Cloud Run, GKE                                                       |
| 4 | `gcloud` ADC token               | `gcloud auth application-default print-access-token`                                 |
| 5 | `gcloud` token                   | `gcloud auth print-access-token`                                                     |

A pasted service account key is used ahead of the chain. A source that is set up but fails — a
revoked token, `gcloud` signed out — is passed over for the next, and **What was checked** lists
each one. The ADC file works even when `gcloud` is not on the PATH.

**Revoke** forgets a pasted key, or runs `gcloud auth application-default revoke` and
`gcloud auth revoke`.

## Projects

A bucket belongs to a project. **Settings → Locations → Google Cloud Platform** lists the projects
your account can see, each with its buckets and a tick for each bucket.

An organisation can hand out hundreds of projects, so five or fewer open at once, and more show the
first five and a **Show all** row for the rest; the filter box finds one by name or id. A project's
buckets are listed when you open it, not before, so a long list costs nothing until you look inside.

A project that refuses to list its buckets says **No permission to list buckets** and moves to the
bottom of the list, with what Google said on hover. A bucket you may read but not list can be added
by its name.

Next: [Azure Blob Storage](/storage/azure).
