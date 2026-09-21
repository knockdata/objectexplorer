# Optimize

The **Cost/mo** column says what a bucket costs. **Optimize** says what it could cost instead, and
hands you the command that gets it there.

It is on the cost line at the foot of the list: for the folder you are in, or for the one object you
picked. It opens a list of what could be done, each with what it saves a month, the biggest saving
first.

## What it suggests

| Action                        | When it is offered                                                                    |
|-------------------------------|---------------------------------------------------------------------------------------|
| **Switch to a storage class** | one row per cheaper class, priced across every object the dialog is about             |
| **Switch to one region**      | a GCS bucket in more than one region, or an Azure account that keeps a copy elsewhere |
| **Remove old versions**       | a versioned bucket holding noncurrent versions                                        |
| **Abort incomplete uploads**  | uploads that were started and never finished, still billed as storage                 |

The saving is the net one. A class that some objects are dearer in can still be worth it overall,
and the objects that lose are named. Old versions and abandoned uploads need a listing of their own,
so those two rows arrive a moment after the dialog opens.

## Before you do it

Pick an action and the review says what it touches, what it costs to do, and what it will cost to
live with:

- a class with a **retrieval fee**, or one that keeps data **offline** for minutes or hours
- a **minimum storage duration**, and which objects are still inside the one they already have — an
  early deletion is billed as if it had stayed
- a region move **copies every object**, billed once as reads and writes, and gives up surviving the
  loss of a region

## It changes nothing

Optimize never touches your storage. The review ends in a `gcloud`, `aws` or `az` command, with a
copy button: you read it here, and run it in your own terminal, under your own credentials.

It covers Google Cloud Storage, Amazon S3 and Azure Blob Storage. The prices are the published rates
for the bucket's region — see [where the usage numbers come from](/reference/usage-data).

Next: [the cache](/explore/cache).
