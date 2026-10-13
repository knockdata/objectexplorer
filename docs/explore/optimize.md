# Optimize

The **Cost/mo** column says what a bucket costs. **Optimize** says what it could cost instead, and
hands you the command that gets it there.

It is on the cost line at the foot of the list: for the folder you are in, or for the one object you
picked. It opens a list of what could be done, each with what it saves a month, the biggest saving
first, then what it looked for and did not find.

## What it suggests

| Action                        | When it is offered                                                                    |
|-------------------------------|---------------------------------------------------------------------------------------|
| **Switch to a storage class** | one row per cheaper class, priced across every object the dialog is about             |
| **Switch to one region**      | a GCS bucket in more than one region, or an Azure account that keeps a copy elsewhere |
| **Remove old versions**       | an S3 bucket with versioning, holding noncurrent versions                             |
| **Abort incomplete uploads**  | S3 uploads that were started and never finished, still billed as storage              |

The saving is the net one. A class that some objects are dearer in can still be worth it overall,
and the dialog says how many objects lose. Old versions and abandoned uploads need a listing of
their own, so those two rows arrive a moment after the dialog opens.

## Before you do it

Pick an action and the review says what it touches — how many objects, how many bytes, and what it
saves — and what it will cost to live with:

- a class with a **retrieval fee**, or one that keeps data **offline** for minutes or hours
- a **minimum storage duration**, and how many objects are still inside the one they already have —
  an early deletion is billed as if it had stayed
- for a GCS bucket, a region move **copies every object**, billed once as reads and writes, and
  gives up surviving the loss of a region

## It changes nothing

Optimize never touches your storage. The review ends in a `gcloud`, `aws` or `az` command, with a
copy button: you read it here, and run it in your own terminal, under your own credentials.

It covers Google Cloud Storage, Amazon S3 and Azure Blob Storage. The prices are the published rates
for the bucket's region — see [where the usage numbers come from](/reference/usage-data).

Next: [the cache](/explore/cache).
