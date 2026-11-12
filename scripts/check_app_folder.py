# check_app_folder.py — every place in the app's folder the site names is where the product keeps it.
# The product's layout is foldone's service/app_folder.js: its PARTS (settings/, account/, data/, log/,
# work/), and MOVED, each file's old place at the folder's top beside its new one; the cache is its own
# part. A path the site names under ~/.objectexplorer (or <data>, a server's data= folder), and each in
# the first column of reference/data-locations.md's table, must start with a part, and must not be an
# old place.
#
#   uv run --no-project python scripts/check_app_folder.py <foldone>/service/app_folder.js
#
# Prints each path that is wrong, with its file and line, and where it went; exits 1 when there is one.
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import ROOT, SITE, pages, theme_files, lines_of, relative, report

# what stays at the folder's top, written by the update service rather than arranged by app_folder.js:
# a server's installed versions and the link to the one in use (service/update/versions.js), and
# where an npx copy installs a newer one (service/update/kind.js)
KEPT_AT_TOP = {"cache", "versions", "current", "update"}
DATA_LOCATIONS = f"{SITE}/reference/data-locations.md"


def layout(file):
	text = open(file, encoding="utf-8").read()
	parts = set(re.findall(r'"([a-z]+)"', re.search(r"const PARTS = \[([^\]]*)\]", text).group(1)))
	moved_block = text[text.index("const MOVED = ["):]
	moved_block = moved_block[:moved_block.index("\n]")]
	moved = dict(re.findall(r'\["([^"]+)", "([^"]+)"\]', moved_block))
	return parts, moved


def named_paths(file):
	# [(number, path)]: what follows ~/.objectexplorer/ or <data>/, and data-locations.md's first column
	found = []
	for number, line, inside_code in lines_of(file):
		for match in re.finditer(r"(?:~|\$HOME|/home/[a-z]+)/\.objectexplorer/([^\s`'\")\]*,;]+)|<data>/([^\s`'\")\]*,;]+)", line):
			found.append((number, (match.group(1) or match.group(2)).rstrip(".:")))
		if file == DATA_LOCATIONS and line.startswith("| `"):
			for path in re.findall(r"`([^`]+)`", line.split("|")[1]):
				found.append((number, path))
		else:
			# no table of the folder
			pass
	return found


def wrong_place(path, parts, moved):
	# where the path went, when it names an old place; "" when it is where the product keeps it
	plain = path.rstrip("/")
	first = plain.split("/")[0]
	old = [source for source in moved if plain == source or plain.startswith(source + "/")]
	answer = ""
	if len(old) > 0:
		answer = f"moved to {moved[old[0]]}{plain[len(old[0]):]}"
	elif first not in parts and first not in KEPT_AT_TOP:
		answer = "not in a part of the folder: " + ", ".join(f"{part}/" for part in sorted(parts)) + " or cache/"
	else:
		# in its part
		pass
	return answer


def main():
	parts, moved = layout(sys.argv[1])
	failures = []
	for file in pages() + theme_files() + [f"{ROOT}/README.md"]:
		for number, path in named_paths(file):
			answer = wrong_place(path, parts, moved)
			if answer != "":
				failures.append(f"{relative(file)}:{number} {path}: {answer}")
			else:
				# right
				pass
	return report("app folder paths", failures)


sys.exit(main())
