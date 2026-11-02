# Promo credits

The film is built by `scripts/promo.mjs` from `promo/promo.html`:

```sh
node scripts/promo.mjs --preview   # one still per cut, into promo/preview
node scripts/promo.mjs             # the whole film at 1080p, into docs/public/video
```

Its cuts are counted in beats of the music. A new track needs its beat measured once, then one render:

```sh
uv run --with librosa python -I scripts/promo-beats.py promo/music/<track>.mp3
```

## Pictures

| What                       | Where it comes from                                                                                       |
|----------------------------|-----------------------------------------------------------------------------------------------------------|
| Every screen in the film   | `promo/shots/*.jpg`, stills foldone's explorer took of itself offscreen, step by step, with `targets.js` (where the cursor goes) read from their layouts |
| The files on those screens | foldone's `explorer/demo` and `explorer/reference` samples, each with its own licence there                |
| The chalk e                | `assets/mark.png`, ours — the master mark from the app                                                    |

The cursor, the typing, the zooms, the captions and the cards are drawn by the page.

## Music

The recorder takes the first audio file it finds in `promo/music/`, with its `.beats.json` beside it.

| Track              | Author                                              | Source                                                          | Licence                                          |
|--------------------|-----------------------------------------------------|-----------------------------------------------------------------|--------------------------------------------------|
| Hyperflight Racing | cynicmusic ([cynicmusic.com](http://cynicmusic.com)) | [OpenGameArt](https://opengameart.org/content/hyperflight-racing) | CC0 1.0 — public domain, no attribution required |

CC0 asks for nothing, but the author asks to hear about projects that use it, which is why they are
named here. The track is 61 s at 134 beats a minute; the film loops it on a phrase of 16 beats.
