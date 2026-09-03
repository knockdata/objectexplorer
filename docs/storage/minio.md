# MinIO

MinIO, and anything else that speaks the S3 API on your own endpoint, is added as its own provider so
its buckets list separately from AWS.

What it needs is the endpoint, an access key, a secret and a region:

```
endpoint    http://localhost:9000
accessKey   minioadmin
secretKey   ••••••••
region      us-east-1
```

Requests are signed exactly as S3's are, in path style against your host. Everything else in the app
— [preview](/explore/preview), [SQL](/analyze/sql), [search](/explore/search),
[copy and move](/explore/file-management) — behaves as it does for any other bucket.

Next: [local folders](/storage/local).
