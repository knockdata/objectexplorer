# Promo credits

The film is built by `scripts/promo.mjs` from `promo/promo.html`:

```sh
uv run --with torch --with spandrel --with pillow --with numpy python scripts/promo-comic.py
                                   # the comic, upscaled and rebranded, into promo/oe@4x.jpg
node scripts/promo.mjs --preview   # one still per cut, into promo/preview
node scripts/promo.mjs             # the whole film at 1080p, into docs/public/video
```

## Pictures

| | |
|---|---|
| The squirrel comic | `assets/oe.png`, ours — upscaled 4× by [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) (`RealESRGAN_x4plus`, BSD-3-Clause) and rebranded green by `scripts/promo-comic.py` |
| The chalk e | `assets/mark.png`, ours — the master mark from the app |
| Every app screenshot | `docs/public/screenshot/*.png`, captured from the running app by `explorer/test/docShot.js` in the rock2 workspace |

## Music

The recorder takes the first audio file it finds in `promo/music/`.

| Track | Author | Source | Licence |
|---|---|---|---|
| Hyperflight Racing | cynicmusic ([cynicmusic.com](http://cynicmusic.com)) | [OpenGameArt](https://opengameart.org/content/hyperflight-racing) | CC0 1.0 — public domain, no attribution required |

CC0 asks for nothing, but the author asks to hear about projects that use it, which is why they are
named here.
