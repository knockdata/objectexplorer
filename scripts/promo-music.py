# The film's music, arranged from the Apple Loops that Logic Pro installs on this Mac, laid out to the
# film's cuts, and written as promo/music/soundtrack.wav with its soundtrack.beats.json (the exact tempo,
# the first beat at 0), which scripts/promo.mjs takes before any other track.
#
#   uv run --with numpy python -I scripts/promo-music.py [song] [--out file.mp3]
#
# The loops are read where Logic keeps them and never copied: Logic's licence lets them be used in a
# soundtrack of our own, not handed out on their own or as a music bed. So nothing of them is in this
# repository, and promo/music/soundtrack.* is ignored by git: whoever builds the film makes it again here.
#
# A song is one set of loops in one key (loops that share a name in a pack were made to play together),
# with drums and toppers from the same pack. Each loop is decoded by ffmpeg, stretched to the song's
# tempo when it was made at another (atempo), and repeated from the first beat; the sections below say
# which parts sound when. Mixed, then brought to -14 LUFS with its peaks under -1 dBTP by ffmpeg's
# loudnorm in two passes.
import json
import os
import subprocess
import sys
import tempfile
import numpy

LOOPS = "/Library/Audio/Apple Loops/Apple"
RATE = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
MUSIC = os.path.normpath(os.path.join(HERE, "..", "promo", "music"))

# The film in beats, as promo/promo.html counts its cuts: 200 beats, then the end card in silence.
# The name card and the first two word cards are a short, sparse start; the screens are the groove; the
# cards "Your files" "never leave your machine." are the drop, a riser into the closing cards, and a hit
# on the last beat as the end card comes in.
FILM_BEATS = 200
SECTIONS = [
	(0, 8, ["pad", "topper"]),
	(8, 16, ["pad", "topper", "bass", "drums"]),
	(16, 92, ["drums", "topper", "bass", "chords", "stabs"]),
	(92, 172, ["drums", "topper", "bass", "chords", "lead"]),
	(172, 182, ["pad", "bass"]),
	(182, 200, ["drums", "topper", "bass", "chords", "lead", "stabs"]),
]
RISER = (178, 182)
# the parts that sound once more on the last beat, and how long their sound is let ring
HIT = ["drums", "stabs", "chords"]
HIT_SECONDS = 1.6

# Each part: the loop (pack, name), the tempo it was made at, and its level in dB once every loop is
# brought to the same loudness.
SONGS = {
	# Electro House at 128, every melodic loop in C minor
	"electro-house": {
		"tempo": 128,
		"parts": {
			"drums": ("02 Electro House", "Four Four Beat", 128, 0),
			"topper": ("02 Electro House", "Tight House Topper", 128, -8),
			"bass": ("02 Electro House", "Diamond Sky Bass", 128, -3),
			"chords": ("02 Electro House", "Above And Beyond Synth", 128, -5),
			"lead": ("02 Electro House", "Epic Anthem Synth", 128, -6),
			"stabs": ("02 Electro House", "Spike Riff Synth Layers", 128, -7),
			"pad": ("02 Electro House", "Deep Dream Synth", 128, -4),
		},
	},
	# Indie Disco's Reflex set at 130 (A minor), the pack having no drums: Electro House's, stretched from 128
	"indie-disco": {
		"tempo": 130,
		"parts": {
			"drums": ("02 Electro House", "Disco Core Beat", 128, 0),
			"topper": ("02 Electro House", "Tight House Topper", 128, -8),
			"bass": ("08 Indie Disco", "Reflex Bass 01", 130, -2),
			"chords": ("08 Indie Disco", "Reflex Rhythm Guitar", 130, -4),
			"lead": ("08 Indie Disco", "Reflex Lead Guitar", 130, -5),
			"stabs": ("08 Indie Disco", "Reflex Synth", 130, -7),
			"pad": ("08 Indie Disco", "Reflex Synth", 130, -4),
		},
	},
	# Disco Funk's Down With It set (E major), made at 116 and played at 128
	"disco-funk": {
		"tempo": 128,
		"parts": {
			"drums": ("09 Disco Funk", "Down With It Beat 01", 116, 0),
			"topper": ("09 Disco Funk", "Boogie Right Hi-Hat Topper", 116, -8),
			"bass": ("09 Disco Funk", "Down With It Synth Bass 01", 116, -2),
			"chords": ("09 Disco Funk", "Down With It Funk Guitar 01", 116, -5),
			"lead": ("09 Disco Funk", "Down With It Brass", 116, -5),
			"stabs": ("09 Disco Funk", "Down With It Synth Stabs 01", 116, -6),
			"pad": ("09 Disco Funk", "Down With It Gated Synth", 116, -5),
		},
	},
}
DEFAULT_SONG = "indie-disco"


def run(arguments):
	return subprocess.run(arguments, check=True, capture_output=True, text=True)


# a loop as float samples (frames × 2), stretched to `tempo` and trimmed or padded to its whole beats there
def read_loop(pack, name, made_at, tempo):
	path = os.path.join(LOOPS, pack, name + ".caf")
	stretch = [] if made_at == tempo else ["-af", f"atempo={tempo / made_at:.6f}"]
	decoded = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", path, *stretch, "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-"], check=True, capture_output=True).stdout
	samples = numpy.frombuffer(decoded, dtype=numpy.float32).reshape(-1, 2).astype(numpy.float64)
	beat = 60 / tempo * RATE
	beats = max(1, round(len(samples) / beat))
	length = round(beats * beat)
	fitted = numpy.zeros((length, 2))
	fitted[:min(length, len(samples))] = samples[:length]
	return fitted, beats


def loudness_of(samples):
	return numpy.sqrt(numpy.mean(samples ** 2)) + 1e-9


# 1 where a part sounds, 0 where not, with 6 ms ramps where it comes in or goes, so it does not click
def gate(part, beat, length):
	ranges = []
	for start, end, parts in SECTIONS:
		if part in parts and ranges and ranges[-1][1] == start:
			ranges[-1] = (ranges[-1][0], end)
		elif part in parts:
			ranges.append((start, end))
	envelope = numpy.zeros(length)
	ramp = int(0.006 * RATE)
	for start, end in ranges:
		first = round(start * beat)
		last = min(length, round(end * beat))
		envelope[first:last] = 1
		if first > 0:
			envelope[first:first + ramp] = numpy.linspace(0, 1, ramp)
		if last < length:
			envelope[last - ramp:last] = numpy.linspace(1, 0, ramp)
	return envelope


# a noise sweep of our own, brighter and louder over its beats, into the closing cards
def riser(beat, length):
	sound = numpy.zeros((length, 2))
	first = round(RISER[0] * beat)
	last = round(RISER[1] * beat)
	count = last - first
	generator = numpy.random.default_rng(1102)
	noise = generator.standard_normal((count, 2))
	# brighter as it goes: a one-pole low-pass whose cut-off climbs, done in blocks
	shaped = numpy.zeros_like(noise)
	state = numpy.zeros(2)
	block = 256
	for index in range(0, count, block):
		progress = index / count
		cutoff = 300 + 9000 * progress ** 2
		factor = 1 - numpy.exp(-2 * numpy.pi * cutoff / RATE)
		for offset in range(index, min(count, index + block)):
			state = state + factor * (noise[offset] - state)
			shaped[offset] = state
	level = numpy.linspace(0, 1, count) ** 2
	sound[first:last] = shaped / loudness_of(shaped) * 0.12 * level[:, None]
	return sound


def arrange(song):
	tempo = song["tempo"]
	beat = 60 / tempo * RATE
	end = round(FILM_BEATS * beat)
	length = end + round(HIT_SECONDS * RATE)
	mix = numpy.zeros((length, 2))
	for part, (pack, name, made_at, level) in song["parts"].items():
		loop, beats = read_loop(pack, name, made_at, tempo)
		loop = loop / loudness_of(loop) * 0.1 * 10 ** (level / 20)
		repeats = int(numpy.ceil(end / len(loop)))
		tiled = numpy.tile(loop, (repeats, 1))[:end]
		mix[:end] += tiled * gate(part, beat, end)[:, None]
		if part in HIT:
			# the loop's first beat again on the last beat, let ring and dying away
			ring = loop[:min(len(loop), round(HIT_SECONDS * RATE))].copy()
			ring *= numpy.exp(-numpy.arange(len(ring)) / (0.35 * RATE))[:, None]
			ring[-round(0.05 * RATE):] *= numpy.linspace(1, 0, round(0.05 * RATE))[:, None]
			mix[end:end + len(ring)] += ring
	mix += numpy.pad(riser(beat, end), ((0, length - end), (0, 0)))
	return mix


def write_wave(path, samples):
	peak = numpy.max(numpy.abs(samples))
	scaled = samples / peak * 0.5 if peak > 0.5 else samples
	data = scaled.astype(numpy.float32).tobytes()
	subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(RATE), "-i", "-", "-c:a", "pcm_f32le", path], input=data, check=True)


def measure(path):
	output = run(["ffmpeg", "-hide_banner", "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-"]).stderr
	found = json.loads(output[output.rindex("{"):output.rindex("}") + 1])
	return float(found["input_i"]), float(found["input_tp"])


# -14 LUFS with its peaks held under -1.9 dB by a limiter: the gain measured, applied, and measured again
# once, since the limiter takes a little of the loudness back
def master(source, target):
	codec = ["-c:a", "libmp3lame", "-b:a", "256k"] if target.endswith(".mp3") else ["-c:a", "pcm_s16le"]
	loudness, peak = measure(source)
	gain = -14 - loudness
	for attempt in range(2):
		run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", source, "-af", f"volume={gain:.2f}dB,alimiter=limit=0.8:attack=2:release=40:level=false", "-ar", str(RATE), *codec, target])
		loudness, peak = measure(target)
		gain += -14 - loudness
	return loudness, peak


def main():
	arguments = sys.argv[1:]
	out = None
	if "--out" in arguments:
		out = arguments[arguments.index("--out") + 1]
		arguments = [argument for argument in arguments if argument not in ("--out", out)]
	name = arguments[0] if arguments else DEFAULT_SONG
	song = SONGS[name]
	target = out if out is not None else os.path.join(MUSIC, "soundtrack.wav")
	mix = arrange(song)
	with tempfile.TemporaryDirectory() as folder:
		raw = os.path.join(folder, "mix.wav")
		write_wave(raw, mix)
		loudness, peak = master(raw, target)
	beats = {"tempo": song["tempo"], "first": 0, "duration": round(len(mix) / RATE, 3)}
	with open(os.path.splitext(target)[0] + ".beats.json", "w") as file:
		json.dump(beats, file, indent="\t")
		file.write("\n")
	print(f"{target}: {name}, {song['tempo']} beats a minute, {beats['duration']} s, {loudness} LUFS, true peak {peak} dB")


main()
