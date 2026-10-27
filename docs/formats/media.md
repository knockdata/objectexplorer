# Audio and video

`mp3` `wav` `m4a` `aac` `aiff` `flac` `ogg` `opus` `wma` `ac3` `dts` `wv` `ape` `dsf` `caf`, video as
`mp4` `mov` `mkv` `webm` `avi` `wmv` `flv` `m2ts` `ts` `mpg` `vob` `ogv`, MIDI as `mid` `midi`, and
subtitles

<img src="/screenshot/audio.png" alt="An mp3 in structure mode: MPEG audio, 21 frames, each with its bitrate and byte size">

Audio and video play in place, with the app's own player and its own decoders. Nothing has to be
installed, and no codec is fetched.

| Kind    | Decoded                                                                                                                                  |
|---------|------------------------------------------------------------------------------------------------------------------------------------------|
| picture | H.264, HEVC, VP8, VP9, AV1, MPEG-1 and MPEG-2, MPEG-4 Part 2, Microsoft MPEG-4 and WMV, VC-1, Theora, ProRes, QuickTime Animation, MJPEG |
| sound   | AAC (HE-AAC too), MP3, FLAC, Opus, Vorbis, PCM, Apple Lossless, AC-3 and E-AC-3, DTS, WMA, WavPack, Monkey's Audio, TTA, DSD, AMR        |

The bar under the picture seeks, plays and pauses, and sets the volume. `Space` or `K` plays and
pauses, `←` and `→` skip five seconds, `↑` and `↓` change the volume, and `M` mutes.

The line above the player names each track — `Video H.264 320×180 · Sound AC-3 5.1 · Subtitles (2)`.
When a track cannot be played, the player says which and why in place of it — "No sound: this app
cannot decode sound TrueHD in Matroska" — and plays the rest. **Open in Default App** hands it to
another player. The **table** mode lists every track, and whether it plays.

[Structure mode](/explore/preview) walks the container a sound came in — the MPEG frames of an mp3,
the chunks of a wav, the boxes of an m4a — each one with its offset, its bitrate and its size. It
answers what a player never shows: how the file is actually put together.

## MIDI

A MIDI file opens **playing**: the app's own synthesizer sounds its notes at the file's tempos, a
piano-like tone for every instrument and drums on the percussion channel, on every platform.

<img src="/screenshot/midi.png" alt="A MIDI file's table: a row per event, with its track, tick, time, type, channel, note and velocity">

Its **table** holds a row for each event: the track, the tick and the time, what kind of event it
is, the channel, the note and its velocity, a controller and its value, and any text.
**Structure** mode shows its header — the format, the track count, the ticks to a quarter note — and
every track with its name and how many events of each kind it holds.

## Subtitles

`srt` `vtt` `ass` `ssa` `lrc` `ttml` `dfxp` `scc` `smi` `sami` `sub`

A subtitle file opens as its cues, a timed list: when each one starts, when it ends, and its text.
The **text** mode beside it is the words alone, a line a cue. Which format it is, its content
decides; a `.sub` is read when it is MicroDVD's text.

Next: [fonts](/formats/fonts).
