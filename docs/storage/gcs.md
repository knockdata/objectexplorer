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

Next: [Azure Blob Storage](/storage/azure).
