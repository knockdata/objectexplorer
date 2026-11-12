# check_links.py — every link of the site leads somewhere: a page, a heading on it (by VitePress's own
# way of making a heading's anchor), a file in docs/public; every picture is there. A page that
# config.js keeps out of the build (srcExclude) counts as missing, so nothing links to it.
#
#   uv run --no-project python scripts/check_links.py
#
# Prints each dead link, anchor and missing picture with its file and line; exits 1 when there is one.
# External links are not asked (that needs the network): the list of them is printed as a count.
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import SITE, pages, theme_files, lines_of, relative, report


def slug(text):
	# VitePress's slugify (@mdit-vue/shared)
	text = re.sub(r"<[^>]+>", "", text)
	text = re.sub(r"`", "", text)
	text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
	text = re.sub(r"\*\*|__|\*", "", text)
	text = unicodedata.normalize("NFKD", text)
	text = re.sub(r"[̀-ͯ]", "", text)
	text = re.sub(r"[\u0000-\u001f]", "", text)
	text = re.sub(r"[\s~`!@#$%^&*()\-_+=\[\]{}|\;:\"'“”‘’<>,.?/]+", "-", text)
	text = re.sub(r"-{2,}", "-", text)
	text = re.sub(r"^-+|-+$", "", text)
	text = re.sub(r"^(\d)", r"_\1", text)
	return text.lower()


def anchors_of(page):
	found = set()
	counts = {}
	for number, line, inside_code in lines_of(page):
		heading = re.match(r"^(#{1,6})\s+(.*)$", line) if inside_code is False else None
		if heading is not None:
			title = heading.group(2)
			custom = re.search(r"\{#([^}]+)\}\s*$", title)
			if custom is not None:
				found.add(custom.group(1))
			else:
				anchor = slug(title)
				if anchor in counts:
					counts[anchor] += 1
					anchor = f"{anchor}-{counts[anchor]}"
				else:
					counts[anchor] = 0
				found.add(anchor)
		else:
			# not a heading
			pass
		found.update(re.findall(r'id="([^"]+)"', line))
	return found


def excluded_pages():
	config = open(f"{SITE}/.vitepress/config.js", encoding="utf-8").read()
	listed = re.search(r"srcExclude:\s*\[([^\]]*)\]", config)
	names = re.findall(r'"([^"]+)"', listed.group(1)) if listed is not None else []
	return set(os.path.join(SITE, name) for name in names)


EXCLUDED = excluded_pages()


def target_of(link, page):
	# the page a site link names, or the public file, or None
	if link.startswith("/"):
		base = SITE + link
	else:
		base = os.path.normpath(os.path.join(os.path.dirname(page), link))
	candidates = []
	if link.endswith("/"):
		candidates.append(base.rstrip("/") + "/index.md")
	else:
		candidates += [base + ".md", base, base + "/index.md", re.sub(r"\.html$", ".md", base)]
	if link.startswith("/"):
		candidates += [SITE + "/public" + link, SITE + "/public" + link.rstrip("/")]
	else:
		# a relative link: the page's own folder only
		pass
	found = [candidate for candidate in candidates if os.path.isfile(candidate) and candidate not in EXCLUDED]
	return found[0] if len(found) > 0 else None


def links_in(line):
	return re.findall(r"\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", line) + re.findall(r'(?<![:\w-])href="([^"]+)"', line) + re.findall(r"withBase\('([^']+)'\)", line) + re.findall(r'link: "(/[^"]*)"', line)


def pictures_in(line):
	return re.findall(r"!\[[^\]]*\]\(([^)\s]+)", line) + re.findall(r'<img[^>]*(?<![:\w-])src="([^"]+)"', line) + re.findall(r'poster(?:=|: )"(/[^"]+)"', line) + re.findall(r'(?<![:\w-])image="(/[^"]+)"', line)


def is_site_link(link):
	return link.startswith(("http:", "https:", "mailto:", "tel:", "{{", "javascript", "#{")) is False and "${" not in link


def check_picture(picture, page, place, failures):
	if picture.startswith("http") is False:
		file = SITE + "/public" + picture if picture.startswith("/") else os.path.normpath(os.path.join(os.path.dirname(page), picture))
		if os.path.isfile(file) is False:
			failures.append(f"{place} picture missing: {picture}")
		else:
			# there
			pass
	else:
		# another site's
		pass


def check_link(link, page, place, anchors, failures):
	path_part, _, anchor = link.partition("#")
	path_part = path_part.split("?")[0]
	target = (page if page.endswith(".md") else None) if path_part == "" else target_of(path_part, page)
	if target is None:
		failures.append(f"{place} dead link: {link}")
	elif anchor != "" and target.endswith(".md"):
		if target not in anchors:
			anchors[target] = anchors_of(target)
		else:
			# read already
			pass
		if anchor not in anchors[target]:
			failures.append(f"{place} dead anchor: {link} (no such heading in {relative(target)})")
		else:
			# the heading is there
			pass
	else:
		# a page, or a file
		pass


def main():
	failures = []
	anchors = {}
	external = set()
	for page in [page for page in pages() if page not in EXCLUDED] + theme_files():
		for number, line, inside_code in lines_of(page):
			if inside_code is False:
				place = f"{relative(page)}:{number}"
				# a code span in a page is an example (`![](chart.png)`), not a picture
				line = re.sub(r"`[^`]*`", "", line) if page.endswith(".md") else line
				pictures = pictures_in(line)
				for picture in pictures:
					check_picture(picture, page, place, failures)
				for link in links_in(line):
					if link.startswith("http"):
						external.add(link.split("#")[0])
					elif link not in pictures and is_site_link(link):
						check_link(link, page, place, anchors, failures)
					else:
						# a picture, a mail address, a template's expression
						pass
			else:
				# code: an example, not a link
				pass
	print(f"  {len(external)} external links, not asked")
	return report("links, anchors and pictures", failures)


sys.exit(main())
