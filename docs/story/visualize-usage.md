---
title: "Visualize usage"
subtitle: "See where our money goes"
episode: 5
runtime: null
video: null
recording: /video/usage-visualization.mp4
poster: /screenshot/usage-visualization.png
open: "usage/"
component: { insight: "on" }
background: "#11151b"
focus: { x: 50, y: 50, width: 90 }
caption: "Every bucket and folder from four places on one disc: this machine, Google Cloud, AWS and Azure. Each pole stands as tall as what it holds, by size or by monthly cost, in the sector of what kind of thing it is; an arch joins bytes kept twice."
today:
  - tool: "Billing console"
    step: "click here and there"
  - tool: "Billing console"
    step: "plenty of graphs"
  - tool: "Terminal"
    step: "one more command"
  - tool: "Effort"
    step: "an hour gone"
tally: "an hour gone, only some vague ideas"
published: 2026-09-14
description: "Billing consoles explain a bill; they were never built to lower it. One page answers where the money goes."
---

<!--
Lines:
1. The cloud that sends your bill has no reason to help you shrink it.
2. See where your money goes.
3. One page. Every answer.

Cue:
- click, graphs, an hour gone
- the bill's sender wants it big
- bucket, kind, who, twice, small, unused
- The cloud that sends your bill has no reason to help you shrink it.

Board:
  0:00  See where your money goes?        white       top
  0:06  console box full of tiny graphs   amber       upper middle
  0:20  $ with an arrow back to the cloud pink        upper middle
  0:42  disc with poles of mixed height   neon green  middle
  0:52  Sends the bill / won't shrink it.  neon green  lower band
Drawn: 7

Words: 119

Delivery:
- Don't say a real price out loud. Point at the dollar sign instead; a number dates the video.
- Pause after "does the cloud that sends the bill want it smaller?"
- Cut "Many small objects, or big ones nobody opens." first.

Script:
[0:00, walk in]
Our storage bill went up again. Somebody upstairs asked why.
TODAY
[0:06, draw a console box full of tiny graphs, amber]
Every cloud has a billing console. You click here, click there. Plenty of graphs. An hour later you still can't say why.
[0:20, draw a dollar sign with an arrow back to the cloud, pink]
Ask yourself: does the cloud that sends the bill want it smaller? The tools are there. Lowering your bill is not their job.
IDEAL
So what do you want to know? Which bucket costs most. What kind of files. Read by a person or an agent. Kept twice. Many small objects, or big ones nobody opens. And what to do about it.
[0:42, draw a disc with poles of mixed height, neon green]
One page. Every bucket a pole, as tall as what it costs.
[0:52, write the line, step out, hold three seconds]
The cloud that sends your bill has no reason to help you shrink it.
-->

Our cloud storage bill has been going up month by month. High mangers are asking why. We'd better to figure it out. 

## Today

For sure there is billing console and command line tool for every cloud provider.
We can click here and there, plenty of graphs. 
Often after an hour passed away, we still could not get concrete action points. 

Why? Cloud provider don't have any incentive to help reducing cost, do they?

Billing tools are there, but the purpose certainly not help us to reduce cost. Why would they?

<StoryToday />

## Ideal Solution

The answers I want to have are. 

* which bucket cost most
* what type of files take the most cost
* by human or agent
* duplication in different places?
* becuase or many small objects
* or large unused ones
* what should I do to reduce the cost

Answered all in one page. 

<StoryPoster />

## Reference

> NOTE: The example below are all artificial results, no real data.

This is what *Today* looks like in each cloud's console and command line. These are made up, not captured from a real account. The buckets, accounts and numbers are invented to show the shape of what each console and command line gives back for storage cost. Each one is filtered to storage alone, the bytes kept per month; transfer, requests and retrieval are left out.

### AWS

Cost Explorer, filtered to the S3 usage visualization types and grouped by usage type. Resource-level grouping covers only the last 14 days, and only after it is turned on.

![Artificial AWS Cost Explorer page for S3 storage, grouped by usage type](/screenshot/story-cost-aws-console.png)

The same numbers from `aws ce get-cost-and-usage`, then the bucket listed and summed by prefix by hand. Nothing joins the two.

![Artificial terminal session with aws ce get-cost-and-usage and aws s3 ls](/screenshot/story-cost-aws-cli.png)

### Azure

Cost analysis, filtered to the data stored meters and grouped by resource. The smallest unit is the storage account, not the container or the folder.

![Artificial Azure Cost analysis page for data stored, grouped by resource](/screenshot/story-cost-azure-console.png)

`az costmanagement query` filtered to the same meters and grouped by resource ID, then `az storage blob list` to sum sizes under a prefix.

![Artificial terminal session with az costmanagement query and az storage blob list](/screenshot/story-cost-azure-cli.png)

### Google Cloud

Billing Reports, filtered to the Cloud Storage storage SKUs and grouped by SKU. Group by offers service, SKU, project, location and label; there is no bucket.

![Artificial Google Cloud Billing Reports page for storage SKUs, grouped by SKU](/screenshot/story-cost-gcp-console.png)

There is no gcloud command for cost. It comes from a query over the billing export in BigQuery, then `gcloud storage du` for the sizes.

![Artificial terminal session with bq query over the billing export and gcloud storage du](/screenshot/story-cost-gcp-cli.png)
