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
| The book                   | The Tale of Peter Rabbit, Beatrix Potter, the Project Gutenberg ebook (public domain)                      |
| The usage disc             | the made-up example the app ships (its Demo), no real account                                             |
| The chalk e                | `assets/mark.png`, ours — the master mark from the app                                                    |

The cursor, the typing, the zooms, the captions and the cards are drawn by the page.

## Music

| Track    | Author  | Source                                                                  | Licence                                                                                                  |
|----------|---------|-------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Clapping | mrclaps | [Pixabay](https://pixabay.com/music/rock-clapping-492559/) (53.5 s)      | Pixabay Content License: free for commercial use, no attribution required, not to be redistributed on its own |

The track is not in this repository: Pixabay's licence lets it be used in the film but not handed out by
itself, so only the film carries it (`promo/music/mrclaps-*.mp3` is ignored by git). To build the film,
download it from the page above as `promo/music/mrclaps-clapping-492559.mp3`. Its beat is measured once
into `mrclaps-clapping-492559.beats.json` (kept in git; it holds only times):

```sh
uv run --with librosa python -I scripts/promo-beats.py promo/music/mrclaps-clapping-492559.mp3 --tempo 119
```

It is 119 beats a minute in phrases of 4 bars, each ending on a short stop (librosa alone reads its clap
pattern as 96). The film is longer than the track, so the recorder plays it to the middle of its last
stop, then goes back as many phrases as the film needs, from stop to stop (now the six between its first
and last stops, then one more), and on to its own ending, whose downbeat lands one beat into the end card.

Without that file the recorder takes the first other track in `promo/music/`:

| Track              | Author                                              | Source                                                          | Licence                                          |
|--------------------|-----------------------------------------------------|-----------------------------------------------------------------|--------------------------------------------------|
| Hyperflight Racing | cynicmusic ([cynicmusic.com](http://cynicmusic.com)) | [OpenGameArt](https://opengameart.org/content/hyperflight-racing) | CC0 1.0 — public domain, no attribution required |

CC0 asks for nothing, but the author asks to hear about projects that use it, which is why they are
named here.
