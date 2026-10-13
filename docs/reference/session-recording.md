# Recording a session

The desktop window writes down each session as it happens, so what happened can be played back
afterwards: to see how a problem came about, or to show it to someone else.

## What is recorded

One line per event, in the order they came:

- every click, drag, scroll and key, with the element it landed on;
- the text you typed, and the choices you made in menus and dialogs;
- the window opened, resized or focused;
- the messages the app printed, and when each file you opened was ready.

Nothing in it is sent anywhere. A recording is written as it goes, so a crash loses nothing that was
already written.

## Where it goes

Each window session is a file of its own in `~/.objectexplorer/replay`, named by when it started.
The last 20 sessions are kept, and never more than 50 MB in all; one session stops growing at 50 MB.
The browser version records nothing.

| Start with      | What happens                                           |
|-----------------|--------------------------------------------------------|
| nothing         | this session is recorded in `~/.objectexplorer/replay` |
| `record=<file>` | this session is recorded in that file instead          |
| `record=false`  | nothing is recorded                                    |

## Playing it back

```sh
objectexplorer window=true replay=~/.objectexplorer/replay/2026-10-11T17-36-44.166Z.replay
```

The window opens and the session is played into it, input by input. Each click goes to the element
it went to before, wherever that element is now, and each step waits until the app has done what
it did the first time, such as a file finished opening. A step that finds nothing to click stops the
app, and says which element it looked for.

| Setting             | What it does                                                        |
|---------------------|---------------------------------------------------------------------|
| `replay_speed=fast` | the default: the waiting between inputs is skipped, the work is not |
| `replay_speed=1`    | real time, as it was recorded; `2` twice as fast, and so on         |

A session played back is not recorded over the one it plays; give it `record=<file>` to record it.

This is the window's own session. An agent's calls are kept and replayed apart — see
[sessions, replay and audit](/agents/sessions).

Next: [the tour and what is new](/reference/tour).
