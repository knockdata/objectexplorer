# check_changelog.py — the newest version's release notes are in the one style (foldone's CLAUDE.md,
# "Release notes"): each item one short sentence saying what the user gets, in their words — no path
# in Settings, no file path, not several sentences, at most MOST_WORDS words.
#
#   uv run --no-project python scripts/check_changelog.py [CHANGELOG.md] [--all]
#
# Prints each item that is not, with its line and why; exits 1 when there is one. --all reads every
# version, for a look at the older ones (it still exits by the newest alone).
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import ROOT, report

MOST_WORDS = 30


def sections(file):
	# [(version, [(number, item)])], newest first
	found = []
	for number, line in enumerate(open(file, encoding="utf-8").read().split("\n"), 1):
		heading = re.match(r"^## (v[\d.]+)", line)
		if heading is not None:
			found.append((heading.group(1), []))
		elif line.startswith("- ") and len(found) > 0:
			found[-1][1].append((number, line[2:].strip()))
		else:
			# the page's head, a blank line
			pass
	return found


def why_not(item):
	# what is wrong with an item, "" when nothing is
	reasons = []
	words = len(item.split())
	if words > MOST_WORDS:
		reasons.append(f"{words} words")
	if re.search(r"Settings\s*(?:→|->)", item) is not None:
		reasons.append("a path in Settings")
	if re.search(r"`[^`]*/[^`]*`|~/|\b[\w-]+/[\w.-]+\.(?:js|jsx|c|h|json|md|yaml)\b", item) is not None:
		reasons.append("a file path")
	if re.search(r"[.!?] +[A-Z]", re.sub(r"`[^`]*`|\b(?:e\.g|i\.e|vs|etc)\.", "", item)) is not None:
		reasons.append("several sentences")
	return ", ".join(reasons)


def main():
	file = next((argument for argument in sys.argv[1:] if argument.startswith("--") is False), f"{ROOT}/CHANGELOG.md")
	versions = sections(file)
	failures = []
	told = []
	for index, (version, items) in enumerate(versions):
		for number, item in items:
			reasons = why_not(item)
			if reasons != "" and index == 0:
				failures.append(f"CHANGELOG.md:{number} {version}: {reasons}: {item[:70]}")
			elif reasons != "" and "--all" in sys.argv:
				told.append(f"  CHANGELOG.md:{number} {version}: {reasons}")
			else:
				# in the style, or an older version not asked for
				pass
	print("\n".join(told) if len(told) > 0 else f"  newest: {versions[0][0] if len(versions) > 0 else 'none'}")
	return report("release notes of the newest version", failures)


sys.exit(main())
