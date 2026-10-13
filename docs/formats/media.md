# Audio and video

`mp3` `wav` `m4a` `aac` `aiff` `flac` `ogg` `opus` `bwf` `3gpp`, video as `mp4` `mov` `mkv` `webm`
`avi`, and MIDI as `mid` `midi`

<img src="/screenshot/audio.png" alt="An mp3 in structure mode: MPEG audio, 21 frames, each with its bitrate and byte size">

Audio and video play in place, with the app's own player and its own decoders: H.264, HEVC, VP9 and
AV1 pictures; AAC, MP3, FLAC, Opus, Vorbis and PCM sound. Nothing has to be installed, and no codec
is fetched.

[Structure mode](/explore/preview) walks the container a sound came in — the MPEG frames of an mp3,
the chunks of a wav, the boxes of an m4a — each one with its offset, its bitrate and its size. It
answers what a player never shows: how the file is actually put together.

## MIDI

A MIDI file is read as its events. Its **table** holds a row for each: the track, the tick and the
time, what kind of event it is, the channel, the note and its velocity, a controller and its value,
and any text. **Structure** mode shows its header — the format, the track count, the ticks to a
quarter note — and every track with its name and how many events of each kind it holds.

Next: [fonts](/formats/fonts).
