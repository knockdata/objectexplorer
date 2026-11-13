# check_words.py — the public site never names what the product keeps out of it. The list is not kept in
# this public repository, which would name what it lists: it is read from a file of the product's source,
# one regular expression a line, # for a comment line (scripts/check.sh passes it).
#
# One name is allowed with a condition: Minecraft, a file format the product reads. Its owner's usage
# guidelines (https://www.minecraft.net/en-us/usage-guidelines, "Naming guidelines" and "Essential
# guidelines") allow the name in a description, and ask for their disclaimer on every page that uses it.
# So it may stand on the format pages (docs/formats/), in the release notes and on the third-party
# notices page, each page (each version, in CHANGELOG.md) with DISCLAIMER on it, and nowhere else.
#
#   uv run --no-project python scripts/check_words.py <file of patterns>
#
# Reads every page, the landing's components and words, README.md and CHANGELOG.md; prints each line
# that names one, with its file and line; exits 1 when there is one.
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import ROOT, SITE, pages, theme_files, lines_of, relative, report

FORMAT_NAME = re.compile(r"(?i)\bminecraft\b")
DISCLAIMER = "NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT"
CHANGELOG = f"{ROOT}/CHANGELOG.md"
NOTICES = f"{SITE}/third-party-licenses.md"


def patterns_of(file):
	lines = [line.strip() for line in open(file, encoding="utf-8").read().split("\n")]
	return [re.compile(line, re.I) for line in lines if line != "" and line.startswith("#") is False]


def sections_of(file):
	# the parts the disclaimer must be in: a version of the release notes, or the whole page
	numbered = lines_of(file)
	parts = []
	for entry in numbered:
		if len(parts) == 0 or (file == CHANGELOG and entry[1].startswith("## ")):
			parts.append([])
		else:
			# the same part
			pass
		parts[-1].append(entry)
	return parts


def check_format_name(file, part, failures):
	named = [entry for entry in part if FORMAT_NAME.search(entry[1]) is not None and DISCLAIMER not in entry[1]]
	allowed_here = file.startswith(f"{SITE}/formats/") or file == CHANGELOG or file == NOTICES
	has_disclaimer = any(DISCLAIMER in entry[1] for entry in part)
	for number, line, inside_code in named:
		if allowed_here is False:
			failures.append(f"{relative(file)}:{number} names Minecraft off the format pages, the release notes and the notices page")
		elif has_disclaimer is False:
			failures.append(f"{relative(file)}:{number} names Minecraft without its owner's disclaimer: “{DISCLAIMER}”")
		else:
			# allowed, with the disclaimer
			pass


def main():
	left_out = patterns_of(sys.argv[1])
	failures = []
	for file in pages() + theme_files() + [f"{ROOT}/README.md", CHANGELOG]:
		for part in sections_of(file):
			for number, line, inside_code in part:
				named = [pattern for pattern in left_out if pattern.search(line) is not None]
				if len(named) > 0:
					failures.append(f"{relative(file)}:{number} names “{named[0].search(line).group(0)}”, which the site leaves out")
				else:
					# nothing left out
					pass
			check_format_name(file, part, failures)
	return report("words the site leaves out", failures)


sys.exit(main())
