# The beat of the film's music, for scripts/promo.mjs: its tempo, its first beat and its length, written
# beside the track as <track>.beats.json. The film's cuts are counted in beats from that first beat, so
# a new track is this and one render:
#
#   uv run --with librosa python -I scripts/promo-beats.py promo/music/<track>.mp3
import json
import sys
import librosa

track = sys.argv[1]
samples, rate = librosa.load(track, sr=22050, mono=True)
tempo, frames = librosa.beat.beat_track(y=samples, sr=rate)
times = librosa.frames_to_time(frames, sr=rate)
estimate = float(tempo[0]) if hasattr(tempo, "__len__") else float(tempo)
# librosa's tempo is rounded to its own steps (136 for a track at 134 drifts half a beat in 20 s): the
# period is fitted to the beats it found instead, each numbered from the one before it
numbers = [0]
for index in range(1, len(times)):
	numbers.append(numbers[-1] + max(1, round((float(times[index]) - float(times[index - 1])) / (60 / estimate))))
count = len(times)
mean_number = sum(numbers) / count
mean_time = sum(float(time) for time in times) / count
period = sum((number - mean_number) * (float(time) - mean_time) for number, time in zip(numbers, times)) / sum((number - mean_number) ** 2 for number in numbers)
first = mean_time - period * mean_number
tempo = 60 / period
beats = {
	"tempo": round(tempo, 3),
	"first": round(first, 3),
	"duration": round(len(samples) / rate, 3),
}
target = track.rsplit(".", 1)[0] + ".beats.json"
with open(target, "w") as file:
	json.dump(beats, file, indent="\t")
	file.write("\n")
print(target, beats)
