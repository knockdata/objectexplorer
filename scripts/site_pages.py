# site_pages.py — what the checks beside it share: the site's pages and theme files, read once, each line
# with its number, the lines inside a code block marked, so a check reads the words a visitor reads.
#
#   pages()              the Markdown pages under docs/, node_modules and VitePress's build output left out
#   theme_files()        the landing's components, data and words (docs/.vitepress/theme, config.js)
#   lines_of(file)       [(number, line, inside_code)] of a file
#   relative(file)       its path from the repository's root, as a failure names it
#   report(name, failures)  prints the check's failures, or that it passed; the exit code it should end with
import glob
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "docs")
LEFT_OUT = ("/node_modules/", "/.vitepress/cache/", "/.vitepress/dist/")


def kept(file):
	return any(part in file for part in LEFT_OUT) is False


def pages():
	return sorted(file for file in glob.glob(f"{SITE}/**/*.md", recursive=True) if kept(file))


def theme_files():
	found = glob.glob(f"{SITE}/.vitepress/theme/**/*.vue", recursive=True) + glob.glob(f"{SITE}/.vitepress/theme/**/*.js", recursive=True)
	return sorted([file for file in found if kept(file)] + [f"{SITE}/.vitepress/config.js"])


def lines_of(file):
	numbered = []
	inside_code = False
	for number, line in enumerate(open(file, encoding="utf-8").read().split("\n"), 1):
		fence = line.lstrip().startswith("```")
		if fence:
			inside_code = inside_code is False
		else:
			# a line of text, or of code
			pass
		numbered.append((number, line, inside_code or fence))
	return numbered


def relative(file):
	return os.path.relpath(file, ROOT)


def report(name, failures):
	if len(failures) > 0:
		print(f"✗ {name}: {len(failures)} wrong")
		for failure in failures:
			print(f"  {failure}")
		code = 1
	else:
		print(f"✓ {name}")
		code = 0
	return code
