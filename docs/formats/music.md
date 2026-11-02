# Music scores and playlists

Scores as MusicXML `musicxml` `mxl` (and an `xml` that is one), MuseScore `mscx` `mscz`, ABC `abc`
and Guitar Pro `gp3` `gp4` `gp5` `gpx` `gp`; playlists as `m3u` `m3u8` `pls` `xspf`, and cue sheets
`cue`

<img src="/screenshot/format-music.png" alt="A Bach chorale in MusicXML drawn as a score: four staves, the player bar above it, and the line naming its format, parts, measures and length">

## Scores

A score opens as its music: the pages drawn as staves and notes, and a player above them that plays
it through the app's own synthesizer, the same one that plays a [MIDI file](/formats/media#midi).
The line on top names it — `MusicXML (compressed) · 4 parts · 10 measures · 0:23`, with the title and
the composer first when the file has them.

| Format         | Files                                  | Read                                     |
|----------------|----------------------------------------|------------------------------------------|
| **MusicXML**   | `musicxml`, `xml`, compressed as `mxl` | the exchange format of notation programs |
| **MuseScore**  | `mscx`, compressed as `mscz`           | MuseScore 2 to 4                         |
| **ABC**        | `abc`                                  | the folk tunes' text notation            |
| **Guitar Pro** | `gp3` `gp4` `gp5`, `gpx`, `gp`         | Guitar Pro 3 to 8                        |

Which one a file is, its bytes decide: a Guitar Pro 6 `.gpx` is told from a GPS track, and a
Guitar Pro 7 `.gp` from a protein sequence.

The **table** mode holds every note, a row each, a chord's notes on rows of their own: the `part`,
`staff`, `voice`, `measure`, `beat`, its `start` and `duration` in quarter notes and in `seconds`,
its `pitch` (`C#4`) and MIDI `key`, a guitar's `string` and `fret`, and whether it is `tied`, a
`grace` note, or sung to a `lyric`:

```sql
SELECT pitch, count(*) FROM 'song.gp5' GROUP BY pitch ORDER BY 2 DESC
```

The score is drawn as standard notation only: a guitar part is written on the staff, not as
tablature. Repeats are played once, and dynamics, articulations and a guitar's bends and slides are
left out. A browser plays no MIDI, so there the player says so: the desktop app plays the score.

## Playlists and cue sheets

`m3u` `m3u8` `pls` `xspf` `cue`

A playlist opens as the **table** of its entries — `number`, `title`, `artist`, `album`, `start`,
`duration` and `location` — and a **list** of the files it names that are there beside it, each
opening as itself. A stream's address, or a file that is not there, stays a row of the table.

A cue sheet gives each track its start in the one file it cuts up. An HLS playlist (`.m3u8`, the
playlist a video site streams in pieces) lists its segments, each starting where the last ended.

Next: [fonts](/formats/fonts).
