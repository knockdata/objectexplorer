# Audio and video

`mp3` `wav` `m4a` `aiff` `bwf` `3gpp`, and video played in place

<img src="/shot/audio.png" alt="An mp3 in structure mode: MPEG audio, 21 frames, each with its bitrate and byte size">

Audio plays in place, and [structure mode](/explore/preview) walks the container it came in — the MPEG
frames of an mp3, the chunks of a wav, the boxes of an m4a — each one with its offset, its bitrate
and its size. It answers what a player never shows: how the file is actually put together.

Video plays in place, streamed by range requests from the object rather than downloaded whole first.

Next: [ebooks](/formats/ebooks).
