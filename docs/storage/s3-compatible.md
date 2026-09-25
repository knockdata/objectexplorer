# S3 compatible providers

Any storage that speaks the S3 API on its own endpoint is added as an **S3 compatible provider**.
Each one is a provider of its own, so its buckets list separately from [Amazon S3](/storage/s3) and
from each other.

What it needs is the endpoint, an access key, a secret and a region:

```
endpoint    http://localhost:9000
accessKey   minioadmin
secretKey   ••••••••
region      us-east-1
```

Requests are signed exactly as S3's are, in path style against your endpoint. Everything else in the
app — [preview](/explore/preview), [SQL](/analyze/sql), [search](/explore/search),
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
