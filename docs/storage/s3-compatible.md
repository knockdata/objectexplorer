# S3 compatible providers

Any storage that speaks the S3 API on its own endpoint is added as an **S3 compatible provider**.
Each one is a provider of its own, so its buckets list separately from [Amazon S3](/storage/s3) and
from each other.

Add one with the **+** beside **Accounts** in Settings. It needs a name and the endpoint's URL, and
takes a description, an access key and a secret; **Connect** checks it and keeps it:

```
name         minio
description  the MinIO on this laptop
URL          http://localhost:9000
access key   minioadmin
secret key   ••••••••
```

The name is the endpoint's scheme in the tree — `minio://bucket/key` — so it is small letters and
digits, and not `s3`, `gs`, `az` or `file`. The key pair may be left empty for an endpoint that takes
anonymous requests, or written into the URL as `http://key:secret@host:9000`. Its buckets are then
under **Locations**, in a row named after it, each with a tick. **Forget this sign-in** removes it.

From the command line, `oe signin s3 minio --endpoint http://localhost:9000` does the same, reading
the key pair from the input (`--anonymous` keeps none).

Requests are signed exactly as S3's are, in path style against your endpoint, with the region
`us-east-1` unless the endpoint's entry in `storage.json` names another. Everything else in the
app — [preview](/explore/preview), [search](/explore/search),
[copy and move](/explore/file-management) — behaves as it does for any other bucket.

## Providers

The endpoint is the one each provider documents; `<region>` and the other placeholders are yours.
A provider that refuses path-style requests will not list.

| Provider                            | Endpoint                                                            | Note                                                              |
|-------------------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------|
| Cloudflare R2                       | `https://<account-id>.r2.cloudflarestorage.com`                     | region `auto`                                                     |
| Backblaze B2                        | `https://s3.<region>.backblazeb2.com`                               |                                                                   |
| Wasabi                              | `https://s3.<region>.wasabisys.com`                                 |                                                                   |
| DigitalOcean Spaces                 | `https://<region>.digitaloceanspaces.com`                           |                                                                   |
| Hetzner Object Storage              | `https://<location>.your-objectstorage.com`                         |                                                                   |
| Scaleway Object Storage             | `https://s3.<region>.scw.cloud`                                     |                                                                   |
| OVHcloud Object Storage             | `https://s3.<region>.io.cloud.ovh.net`                              |                                                                   |
| Akamai (Linode) Object Storage      | `https://<region>.linodeobjects.com`                                |                                                                   |
| Oracle Cloud (OCI) Object Storage   | `https://<namespace>.compat.objectstorage.<region>.oraclecloud.com` | a Customer Secret Key                                             |
| IBM Cloud Object Storage            | `https://s3.<region>.cloud-object-storage.appdomain.cloud`          | HMAC credentials                                                  |
| Google Cloud Storage (interop mode) | `https://storage.googleapis.com`                                    | HMAC keys; for a Google sign-in use [Cloud Storage](/storage/gcs) |
| Alibaba Cloud OSS                   | `https://oss-<region>.aliyuncs.com`                                 |                                                                   |
| Tencent Cloud COS                   | `https://cos.<region>.myqcloud.com`                                 |                                                                   |
| Tigris                              | `https://t3.storage.dev`                                            | region `auto`                                                     |
| Storj                               | `https://gateway.storjshare.io`                                     | S3 credentials from the Storj console                             |
| iDrive e2                           | the endpoint shown in the e2 console                                |                                                                   |
| Exoscale SOS                        | `https://sos-<zone>.exo.io`                                         |                                                                   |
| Vultr Object Storage                | `https://<region>.vultrobjects.com`                                 |                                                                   |
| Supabase Storage                    | `https://<project-ref>.supabase.co/storage/v1/s3`                   | S3 access keys from the project settings                          |
| MinIO                               | `http://localhost:9000`                                             | self-hosted                                                       |
| Ceph RGW                            | `http://<host>:7480`                                                | self-hosted                                                       |
| Garage                              | `http://<host>:3900`                                                | self-hosted; region `garage` unless you set another               |
| SeaweedFS                           | `http://<host>:8333`                                                | self-hosted                                                       |

Next: [local folders](/storage/local).
