# check_formats.py — the formats the site names are formats the product opens, and the number of them
# the site states is true. The product's list is foldone's: parser/formats.js (its types, its whole
# names, its database_extensions), every parser/**/readers.js and parser/base/registry.c's FORMATS.
#
#   uv run --no-project python scripts/check_formats.py <foldone> [--list]
#
# The registry lists what a development build reads too; what a release does not open is listed in
# <foldone>/tools/site_release_left_out.txt (one extension a line).
#
# Wrong (exit 1): a backticked extension in the table of docs/formats/index.md or in the first
# paragraph of a format page that the product does not know; one, anywhere on a format page, that a
# release does not open; a stated count ("more than 900 file
# extensions", "900+ formats") above what the product opens, or under 85 % of it (the site undersells).
# Told, not wrong: how many extensions the product opens that no format page names (--list prints them).
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import ROOT, SITE, pages, theme_files, lines_of, relative, report

# the least share of the real count a stated one may be
UNDERSELL = 0.85
# names a format page gives that are no extension of the registry: a file told by its whole name, by
# its content (a PADS board or a CAN log saved as .asc), a lake table's folder, a sprite sheet's XML kind
WHOLE_NAMES = {"history", "dicomdir", "winmail.dat", ".ds_store", "slides.md", "osm.pbf", "ome.tif", "csv.gz", "json.zst", "tsv.bz2"}
TOLD_OTHERWISE = {"asc", "delta", "iceberg", "hudi", "textureatlas", "spritesheet", "sprites", "imagemap"}


def product_extensions(foldone):
	formats = open(f"{foldone}/parser/formats.js", encoding="utf-8").read()
	types = set()
	for match in re.finditer(r"exts: '([^']*)'", formats):
		types.update(match.group(1).split())
	database_block = formats[formats.index("const database_extensions"):formats.index("COMPRESSED_RECORD_EXTENSIONS = ")]
	database = set(word for match in re.finditer(r'"([^"]+)"', database_block) for word in match.group(1).split())
	readers = set()
	for file in glob.glob(f"{foldone}/parser/**/readers.js", recursive=True):
		if "/build/" not in file:
			text = open(file, encoding="utf-8").read()
			readers.update(match.group(1) for match in re.finditer(r'\[\s*"([a-z0-9_.~+\-]+)"\s*,\s*[A-Za-z_{]', text))
			for match in re.finditer(r'"([a-z0-9_ .~+\-]+)"\.split\(" "\)\.map', text):
				readers.update(match.group(1).split())
		else:
			# a build's copy
			pass
	registry_source = open(f"{foldone}/parser/base/registry.c", encoding="utf-8").read()
	start = registry_source.index("static const Format FORMATS[] = {")
	registry_block = registry_source[start:registry_source.index("\n};", start)]
	registry = set()
	registry_names = set()
	for match in re.finditer(r'\{\s*"([a-z0-9_.]+)",\s*"([^"]*)"', registry_block):
		registry_names.add(match.group(1))
		registry.update(match.group(2).split())
	named_block = formats[formats.index("const named"):formats.index("const database_extensions")]
	named = set(word.lower() for word in re.findall(r'\["([^"]+)", "[a-z_]+"\]', named_block))
	opens = registry | readers | database
	known = opens | types | named | registry_names
	return opens, known


def release_left_out(foldone):
	# the extensions a release does not open, from the product's list; a missing list is a failure
	file = f"{foldone}/tools/site_release_left_out.txt"
	words = set()
	if os.path.isfile(file):
		lines = [line.strip().lower() for line in open(file, encoding="utf-8").read().split("\n")]
		words = set(line for line in lines if line != "" and line.startswith("#") is False)
	else:
		# the check below says so
		pass
	return file, words


def backticked(line):
	return [token.strip().lstrip(".").lower() for token in re.findall(r"`([^`]+)`", line)]


def is_extension_like(word):
	return re.fullmatch(r"[a-z0-9][a-z0-9_.+~\-]{0,18}", word) is not None


def named_lines(page):
	# the lines that list a page's extensions: index.md's table, any other page's first paragraph
	numbered = [entry for entry in lines_of(page) if entry[2] is False]
	if page.endswith("/index.md"):
		chosen = [entry for entry in numbered if entry[1].startswith("|")]
	else:
		chosen = []
		started = False
		ended = False
		for entry in numbered:
			text = entry[1].strip()
			if ended is False and text.startswith("#") is False and text != "" and text.startswith("<") is False:
				started = True
				chosen.append(entry)
			elif started and text == "":
				ended = True
			else:
				# the title, the lines before the paragraph, or after it
				pass
	return chosen


def stated_counts(file):
	found = []
	for number, line, inside_code in lines_of(file):
		for match in re.finditer(r"(?i)(?:more than|over)\s+([\d,]+)\s+(?:file extensions|kinds of file|formats)|([\d,]+)\+\s+(?:file extensions|kinds of file|formats)", line):
			found.append((number, int((match.group(1) or match.group(2)).replace(",", ""))))
	return found


def main():
	foldone = sys.argv[1]
	opens, known = product_extensions(foldone)
	list_file, left_out = release_left_out(foldone)
	opens = opens - left_out
	failures = [] if os.path.isfile(list_file) else [f"{list_file}: missing, the list of what a release does not open"]
	named_on_site = set()
	for page in sorted(glob.glob(f"{SITE}/formats/*.md")):
		for number, line, inside_code in lines_of(page):
			words = [word for word in backticked(line) if is_extension_like(word)]
			named_on_site.update(words)
			for word in words:
				if word in left_out:
					failures.append(f"{relative(page)}:{number} `{word}` is named, but a release does not open it")
				else:
					# a release opens it, or it is no extension
					pass
		for number, line, inside_code in named_lines(page):
			for word in backticked(line):
				if is_extension_like(word) and word not in known and word not in WHOLE_NAMES | TOLD_OTHERWISE:
					failures.append(f"{relative(page)}:{number} `{word}` is no format the product knows")
				else:
					# a format, or a phrase
					pass
	for file in pages() + theme_files() + [f"{ROOT}/README.md"]:
		for number, count in stated_counts(file):
			if count > len(opens) or count < UNDERSELL * len(opens):
				failures.append(f"{relative(file)}:{number} says {count}; the product opens {len(opens)} extensions")
			else:
				# true, and not selling it short
				pass
	missing = sorted(opens - named_on_site)
	print(f"  the product opens {len(opens)} extensions; {len(missing)} are named on no format page")
	if "--list" in sys.argv:
		print("  " + " ".join(missing))
	else:
		# the count alone
		pass
	return report("formats", failures)


sys.exit(main())
