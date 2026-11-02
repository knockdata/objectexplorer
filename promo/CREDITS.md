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

The film's music is made on this Mac by `scripts/promo-music.py` from the Apple Loops that Logic Pro
installs (`/Library/Audio/Apple Loops/Apple`), arranged to the film's cuts: Indie Disco's Reflex set
(bass, rhythm and lead guitar, synth, in A minor at 130 beats a minute) over Electro House's Disco Core
Beat and Tight House Topper, stretched from 128. Its other songs (`electro-house`, `disco-funk`) are one
argument away.

```sh
uv run --with numpy python -I scripts/promo-music.py     # promo/music/soundtrack.wav and its .beats.json
```

Logic Pro's licence lets its loops be used royalty-free in a soundtrack of our own, and the film with it
may be published; the loops may not be handed out on their own or repackaged as music beds. So no loop
and no soundtrack is in this repository (`promo/music/soundtrack.*` is ignored): the script reads the
loops where Logic keeps them, and the film carries the mix.

Without a soundtrack the recorder takes the first other audio file in `promo/music/`, with its
`.beats.json` beside it:

| Track              | Author                                              | Source                                                          | Licence                                          |
|--------------------|-----------------------------------------------------|-----------------------------------------------------------------|--------------------------------------------------|
| Hyperflight Racing | cynicmusic ([cynicmusic.com](http://cynicmusic.com)) | [OpenGameArt](https://opengameart.org/content/hyperflight-racing) | CC0 1.0 — public domain, no attribution required |

It is 61 s at 134 beats a minute; the film loops it on a phrase of 16 beats.
