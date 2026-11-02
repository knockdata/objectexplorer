# The beat of the film's music, for scripts/promo.mjs, written beside the track as <track>.beats.json:
#
#   tempo, first    the beat, and the first beat once the music starts: the film's cuts are counted in
#                   beats from it
#   duration        the track's length
#   loop, hit       for a track shorter than the film: a stretch of whole phrases to play again (from the
#                   middle of its first stop to the middle of a later one), and the downbeat of its own
#                   ending (the one after its last stop), which the film puts one beat into its end card
#
#   uv run --with librosa python -I scripts/promo-beats.py promo/music/<track>.mp3 [--tempo 119]
#
# --tempo names the beat when librosa takes another reading of it (a clap pattern of 3 + 3 + 2 eighths read
# as 96 instead of 119): the phrases are what tell, a whole number of bars between the stops.
import json
import sys
import numpy
import librosa

PHRASE_BEATS = 16

arguments = sys.argv[1:]
hint = None
if "--tempo" in arguments:
	hint = float(arguments[arguments.index("--tempo") + 1])
track = arguments[0]
samples, rate = librosa.load(track, sr=22050, mono=True)
if hint is not None:
	tempo, frames = librosa.beat.beat_track(y=samples, sr=rate, bpm=hint, tightness=400)
else:
	tempo, frames = librosa.beat.beat_track(y=samples, sr=rate)
times = librosa.frames_to_time(frames, sr=rate)
estimate = float(numpy.atleast_1d(tempo)[0])
# librosa's tempo is rounded to its own steps (136 for a track at 134 drifts half a beat in 20 s): the
# period is fitted to the beats it found instead, each numbered from the one before it
numbers = [0]
for index in range(1, len(times)):
	numbers.append(numbers[-1] + max(1, round((float(times[index]) - float(times[index - 1])) / (60 / estimate))))
count = len(times)
mean_number = sum(numbers) / count
mean_time = sum(float(time) for time in times) / count
period = sum((number - mean_number) * (float(time) - mean_time) for number, time in zip(numbers, times)) / sum((number - mean_number) ** 2 for number in numbers)
phase = mean_time - period * mean_number

# where the music is, and where it stops for a moment: quieter than a fifth of its usual loudness for at
# least a quarter of a second, with music before and after
hop = 256
loudness = librosa.feature.rms(y=samples, hop_length=hop)[0]
seconds = librosa.frames_to_time(numpy.arange(len(loudness)), sr=rate, hop_length=hop)
usual = float(numpy.median(loudness))
loud = loudness > usual * 0.2
start = float(seconds[numpy.argmax(loud)])
stops = []
quiet_from = None
for index in range(len(loud)):
	if loud[index] == False and quiet_from is None:
		quiet_from = float(seconds[index])
	elif loud[index] and quiet_from is not None:
		if seconds[index] - quiet_from >= 0.25 and quiet_from > start:
			stops.append((quiet_from, float(seconds[index])))
		quiet_from = None

# the first beat: the grid's beat nearest where the music starts
first = phase + round((start - phase) / period) * period
beats = {
	"tempo": round(60 / period, 3),
	"first": round(first, 3),
	"duration": round(len(samples) / rate, 3),
}
if len(stops) >= 2:
	phrase = PHRASE_BEATS * period
	loop_from = (stops[0][0] + stops[0][1]) / 2
	middle_last = (stops[-1][0] + stops[-1][1]) / 2
	phrases = round((middle_last - loop_from) / phrase)
	# the ending's downbeat: the grid's beat nearest the music coming back after the last stop
	hit = phase + round((stops[-1][1] - phase) / period) * period
	beats["loop"] = {"from": round(loop_from, 3), "to": round(loop_from + phrases * phrase, 3), "phrases": phrases}
	beats["hit"] = round(hit, 3)
	beats["stops"] = [[round(begin, 2), round(end, 2)] for begin, end in stops]
target = track.rsplit(".", 1)[0] + ".beats.json"
with open(target, "w") as file:
	json.dump(beats, file, indent="\t")
	file.write("\n")
print(target, json.dumps(beats))
