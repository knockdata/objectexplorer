# Audio and video

`mp3` `wav` `m4a` `m4b` `aac` `aiff` `flac` `ogg` `opus` `ac3` `wv` `ape` `dsf` `caf`,
video as `mp4` `mov` `mkv` `webm` `avi` `flv` `m2ts` `ts` `mpg` `vob` `ogv`, MIDI as `mid`
`midi`, and subtitles

<img src="/screenshot/audio.png" alt="An mp3 in structure mode: MPEG audio, 21 frames, each with its bitrate and byte size">

Audio and video play in place, with the app's own player. Most formats are decoded by the app itself,
so nothing has to be installed and no codec is fetched. Some are left to the system's own decoders:
H.264, HEVC, VC-1, MPEG-4 Part 2 (DivX and Xvid) and H.263 video, and AAC sound (HE-AAC too).

| Kind    | Decoded by the app                                                                                    |
|---------|-------------------------------------------------------------------------------------------------------|
| picture | VP8, VP9, AV1, MPEG-1 and MPEG-2, Theora, ProRes, QuickTime Animation, MJPEG                          |
| sound   | MP3, FLAC, Opus, Vorbis, PCM, Apple Lossless, AC-3 and E-AC-3, WavPack, Monkey's Audio, TTA, DSD, AMR |

| Decoded by the system   | Mac and iOS  | Windows                                              | Linux                                         |
|-------------------------|--------------|------------------------------------------------------|-----------------------------------------------|
| H.264 and AAC           | always there | built in                                             | the distribution's FFmpeg (see below)         |
| HEVC                    | always there | needs HEVC Video Extensions from the Microsoft Store | the distribution's FFmpeg (see below)         |
| VC-1                    | not played   | built in                                             | the distribution's FFmpeg (see below)         |
| MPEG-4 Part 2 and H.263 | on a Mac     | handed to the system's decoder, not yet tried        | handed to the system's decoder, not yet tried |

In the browser at objectexplorer.com/app, MPEG-4 Part 2 and H.263 do not play. On a Windows N
edition, install the Media Feature Pack first. On Linux install the full FFmpeg:
`libavcodec-extra` on Debian and Ubuntu, `ffmpeg` from RPM Fusion on Fedora, `ffmpeg` on Arch. When a
file needs something that is missing, the player says what to install in place of that track and
plays the rest.

The bar under the picture seeks, plays and pauses, and sets the volume. `Space` or `K` plays and
pauses, `←` and `→` skip five seconds, `↑` and `↓` change the volume, and `M` mutes.

The line above the player names each track — `Video H.264 320×180 · Sound AC-3 5.1 · Subtitles (2)`.
When a track cannot be played, the player says which and why in place of it — "No sound: this app
cannot decode sound TrueHD in Matroska" — and plays the rest. **Open in Default App** hands it to
another player. The **table** mode lists every track, and whether it plays.

[Structure mode](/explore/preview) walks the container a sound came in — the MPEG frames of an mp3,
the chunks of a wav, the boxes of an m4a — each one with its offset, its bitrate and its size. It
answers what a player never shows: how the file is actually put together.

## Chapters

An audiobook (`.m4b`), and any MP4 or Matroska file that marks chapters, lists them under the player
bar: each chapter's number, title and start, the one playing marked. Click one to jump to its start.
The **table** mode holds them too, a row each — `12:04 – 25:31 · The Storm`. The chapter list is in
the desktop app; the browser's player has none.

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

A score — MusicXML, MuseScore, Guitar Pro — plays the same way, and a playlist opens as its
entries: see [music scores and playlists](/formats/music).

Next: [music scores and playlists](/formats/music).
