# check_notices.py — docs/third-party-licenses.md is what the product's licence inventory makes of it
# now: foldone's tools/notices.py writes the page (site=<file>), and the site adds only its own head
# (site_page below). So a row added to the inventory, or a notice changed, fails this check until
# the page is written again.
#
#   uv run --no-project python scripts/check_notices.py <foldone>            compare
#   uv run --no-project python scripts/check_notices.py <foldone> --write    write the page from it
#
# Prints the first line that differs; exits 1 when the page is not the generated one.
import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import SITE, report

PAGE = f"{SITE}/third-party-licenses.md"
GENERATED = "<!-- Written by foldone's tools/notices.py from its licence inventory: not edited by hand. -->"


def site_page(text):
	# the generated page with the site's own head: the comment saying so under the front matter, and
	# the terms linked where the generator names the app's own licence file
	end = text.index("\n---\n", 4) + len("\n---\n")
	return text[:end] + GENERATED + "\n" + text[end:].replace("(LICENSE.md)", "(see [terms](/terms))", 1)


def generated(foldone):
	with tempfile.TemporaryDirectory() as folder:
		file = os.path.join(folder, "third-party-licenses.md")
		subprocess.run(["uv", "run", "--quiet", f"{foldone}/tools/notices.py", f"site={file}"], check=True, capture_output=True)
		text = open(file, encoding="utf-8").read()
	return site_page(text)


def first_difference(expected, actual):
	expected_lines = expected.split("\n")
	actual_lines = actual.split("\n")
	differing = [index for index in range(max(len(expected_lines), len(actual_lines))) if index >= len(expected_lines) or index >= len(actual_lines) or expected_lines[index] != actual_lines[index]]
	return differing[0] + 1 if len(differing) > 0 else 0


def main():
	expected = generated(sys.argv[1])
	failures = []
	if "--write" in sys.argv:
		open(PAGE, "w", encoding="utf-8").write(expected)
		print(f"  wrote {os.path.relpath(PAGE)}")
	else:
		actual = open(PAGE, encoding="utf-8").read()
		line = first_difference(expected, actual)
		if line > 0:
			failures.append(f"docs/third-party-licenses.md:{line} differs from what tools/notices.py writes now: scripts/check_notices.py <foldone> --write")
		else:
			# the same
			pass
	return report("third-party notices page", failures)


sys.exit(main())
