# check_settings.py — every way to a setting the site gives ("Settings → Connections → Google") is the
# way the app's Settings dialog shows. The dialog is foldone's explorer/ui/settings: SettingsDialog.jsx
# names its groups (NavGroup label=…) and its rows (label: …); every pane's words are the jsx files'
# strings. The first step after Settings must be a group or a row; after a group, a row; any later
# step a word some pane shows. "System Settings → …" is the system's own, and is left alone.
#
#   uv run --no-project python scripts/check_settings.py <foldone>/explorer/ui/settings
#
# Prints each way that does not resolve, with its file and line and the step that is no label; exits
# 1 when there is one.
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import ROOT, pages, theme_files, relative, report

ARROW = r"(?:→|->)"


def labels(folder):
	dialog = open(f"{folder}/SettingsDialog.jsx", encoding="utf-8").read()
	groups = set(re.findall(r'<NavGroup label=\{translate\("([^"]+)"\)\}', dialog))
	rows = set(re.findall(r'label: (?:\(?translate\()?"([^"]+)"', dialog))
	words = set()
	for file in glob.glob(f"{folder}/*.jsx"):
		text = open(file, encoding="utf-8").read()
		words.update(re.findall(r'"([^"\n]{1,80})"', text))
	return groups, rows, words


def line_of(text, position):
	return text.count("\n", 0, position) + 1


def steps_wrong(steps, groups, rows, words):
	# the first step that is no label, "" when every step is one
	wrong = ""
	first = steps[0]
	if first not in groups and first not in rows:
		wrong = first
	elif first in groups and len(steps) > 1 and steps[1] not in rows and steps[1] not in words:
		wrong = steps[1]
	else:
		later = [step for step in steps[1:] if step not in rows and step not in words and step.rstrip("…") not in words]
		wrong = later[0] if len(later) > 0 else ""
	return wrong


def main():
	groups, rows, words = labels(sys.argv[1])
	first_steps = sorted(groups | rows, key=len, reverse=True)
	failures = []
	for file in pages() + theme_files() + [f"{ROOT}/README.md"]:
		text = open(file, encoding="utf-8").read()
		place = relative(file)
		# a bold way, each step whole: **Settings → Connections → Google**
		bold_spans = []
		for match in re.finditer(r"\*\*Settings\s*" + ARROW + r"\s*([^*]+?)\*\*", text):
			bold_spans.append(match.start())
			steps = [step.strip().rstrip(".") for step in re.split(ARROW, match.group(1))]
			wrong = steps_wrong(steps, groups, rows, words)
			if wrong != "":
				failures.append(f"{place}:{line_of(text, match.start())} Settings → {' → '.join(steps)}: “{wrong}” is no label of the dialog")
			else:
				# every step is there
				pass
		# a way in running text: Settings → MCP writes this file — the words after the arrow start with a label
		for match in re.finditer(r"(?<![*\w])(?<!System )(?<!System\n)Settings\s*" + ARROW + r"\s*(.{0,60})", text):
			if match.start() - 2 not in bold_spans and text[max(0, match.start() - 7):match.start()].strip() != "System":
				after = match.group(1)
				found = [label for label in first_steps if after.startswith(label) and re.match(r"[\w]", after[len(label):len(label) + 1]) is None]
				if len(found) == 0:
					failures.append(f"{place}:{line_of(text, match.start())} Settings → {after[:30]}…: no group or row of the dialog")
				else:
					# it starts with one
					pass
			else:
				# bold, read above; or the system's own Settings
				pass
	return report("settings paths", failures)


sys.exit(main())
