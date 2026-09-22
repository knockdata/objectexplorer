---
title: "Train a model?"
subtitle: "Choose data, one click to train."
episode: 6
runtime: null
video: null
poster: /screenshot/notebook-model.png
background: "#202020"
focus: { x: 25, y: 50, width: 50 }
caption: "A model cell predicting EVENT from nine ticked columns, with sliders for leaves (31), rate (0.1) and iterations (100). Left, the columns ranked by gain, START_DATE first. Right, row 0 explained one column at a time."
today:
  - tool: "Notebook"
    step: "install a library"
  - tool: "Terminal"
    step: "compiler missing"
  - tool: "Notebook"
    step: "install another"
  - tool: "Notebook"
    step: "fit, plot"
  - tool: "Chat"
    step: "paste a screenshot"
tally: "an afternoon of installs for forty thousand rows"
published: 2026-09-14
description: "An afternoon of installs to fit a model on rows already on the screen, and the result ends its life as a screenshot in a chat."
---

<!--
Lines:
1. Choose data, one click to train.
2. The rows are here. Fit the curve.
3. Pick the rows. Train on them.

Cue:
- rows already on screen
- install, fail, install again
- fitting is arithmetic
- Choose data, one click to train.

Board:
  0:00  Train a model?                      white       top
  0:06  small table of rows                 white       upper middle
  0:20  INSTALL / FAIL / INSTALL stack      pink        upper middle
  0:42  same rows, a curve through them     neon green  middle
  0:52  Choose data, / one click to train.  neon green  lower band
Drawn: 7

Words: 127

Delivery:
- "A compiler you didn't know you needed" is the laugh. Let it sit.
- Pause after "The rows were already on the screen."
- Cut "Move a slider, see it change" first.

Script:
[0:00, walk in]
You spent an afternoon installing things, to fit a curve to forty thousand rows.
TODAY
[0:06, draw a small table of rows, white]
The rows were already on the screen. You wanted to know which column predicts the one at the end.
[0:20, write INSTALL / FAIL / INSTALL stacked, pink]
So a notebook. Install the library. It wants a compiler you didn't know you needed. Install a different library. Fit it. You screenshotted the chart, pasted it in the chat, and that's where the model lives now.
IDEAL
Start over. What is fitting a model? Arithmetic over rows. A lot of it. Your own machine does a lot of it every second.
[0:42, draw the same rows with a curve through them, neon green]
And the rows are right there. So train on what's on the screen. Move a slider, see it change, and ask it why about a single row.
[0:52, write the line, step out, hold three seconds]
Choose data, one click to train.
-->

I had forty thousand rows on my screen and one question about them: which of these columns predicts the one at the end? It is a small question and an old one. I spent the afternoon installing things.

## Today

The rows were already open in front of me. But the thing showing them could only show them, so I started a notebook. I installed the library I wanted. It needed a compiler I didn't have, and the error said so in a way that took a while to read. I installed a different library that shipped ready to run. I loaded the rows again, this time from a file, and fitted a model. Then I plotted which columns mattered.

The answer was useful. I took a screenshot of the chart and pasted it into the team chat, and as far as I know that is where the model lives now. Nobody can rerun it, change a setting, or ask it about a single row.

<StoryToday />

None of the tools were bad. The libraries are excellent. The notebook worked once it had what it needed. The shared assumption was that training a model is a separate activity, done in a separate place, by someone who first builds that place.

## Ideal

So I tried to start from what fitting a model is. For this kind of question, a gradient boosted tree model is the usual answer: it builds a few hundred small decision trees, each one correcting the last. That is arithmetic over rows. A lot of it, but a laptop does a lot of arithmetic.

And the rows were already there. To show them to me, something had loaded them and measured each column: which ones are numbers, which ones are categories. That is most of the preparation a model needs. The rest is a handful of settings: how big each tree can grow, how fast it learns, how many trees to build.

What I wanted from the model was also small. Which columns matter, ranked. And for one row I picked, why the model said what it said about that row. The second one is harder to compute than it sounds, but there is a known, exact method for trees, from the SHAP work, that splits one prediction into a contribution per column.

<StoryPoster />

That is a model trained in the page on the rows of the cell above it. The trainer is LightGBM compiled to WebAssembly, so it runs in the browser tab. It picks regression when the label is a number and multiclass when it is a category. The three sliders are the settings above: leaves from 2 to 255, a learning rate of 0.01, 0.03, 0.1 or 0.3, and 10 to 500 iterations, and each one writes its value into the training code shown under it. The row slider picks a row and explains it with the tree SHAP method, without retraining. And a trained model can be shared as the model's own text, without the rows it learned from.

## Where it stops

The rows are what the cell above holds, and a query brings back at most 10,000 of them. For forty thousand rows that means training on a quarter of them unless I aggregate or sample first. The page is also a browser tab, with a browser tab's memory.

And it is one kind of model. Boosted trees answer "which columns predict this one" well. They are not the answer to every question, and I would not want the ease of a slider to hide that.

**Choose data, one click to train.**
