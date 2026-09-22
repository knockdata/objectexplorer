# Google Cloud Storage

GCS calls are signed with an OAuth bearer token. Listing buckets needs a project and a token; the
same token reads the objects.

## Ways to connect

- **Application Default Credentials.** If `~/.config/gcloud/application_default_credentials.json`
  exists, buckets list immediately — this works in the packaged app even when `gcloud` is not on the
  PATH.
- **Sign in.** The button runs `gcloud auth login --update-adc`, which opens your browser once and
  refreshes silently afterwards.
- **A service-account key**, for a machine that has no person in front of it.

## Projects

A bucket belongs to a project, and the dialog lists the projects your account can see so you can pick
the one whose buckets you want in the tree. The same project selection is what
[Cloud Logging](/analyze/logging) tails.

An organisation can hand out hundreds of projects, so the dialog shows the first five and a
**Show all** row for the rest; the filter box finds one by name or id. A project's buckets are
listed when you open it, not before, so a long list costs nothing until you look inside.

A project that refuses to list its buckets says **No permission to list buckets** and moves to the
bottom of the list, with what Google said on hover. Opening it again asks again, so a permission
granted a minute ago shows up without a restart.

## Objects you may not read

Listing a bucket and reading an object are separate permissions. An object your account may not
read opens on **No permission to read** with the account and permission Google named, rather than a
sign-in prompt — signing in again would not change the answer.

Next: [Azure Blob Storage](/storage/azure).
