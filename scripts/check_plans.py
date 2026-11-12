# check_plans.py — the plan numbers the site shows are the product's. The product's are in foldone's
# service/plan/features.js; the pricing page's in docs/.vitepress/theme/data/plans.js, in the same shape,
# compared key by key. The pages that say the Free plan's limits in words ("five cloud roots per
# provider and ten local folders", "a sixth bucket") are read too.
#
#   uv run --no-project python scripts/check_plans.py <foldone>/service/plan/features.js
#
# Prints each number that differs, with where it is; exits 1 when one does.
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_pages import ROOT, SITE, pages, lines_of, relative, report

PLANS_FILE = f"{SITE}/.vitepress/theme/data/plans.js"
NUMBERS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "twenty": 20}
ORDINALS = {"second": 2, "third": 3, "fourth": 4, "fifth": 5, "sixth": 6, "seventh": 7, "eighth": 8, "ninth": 9, "tenth": 10, "eleventh": 11}


def plans_of(file):
	# { plan: { key: value as written } } of the const blocks free, pro and enterprise
	text = open(file, encoding="utf-8").read()
	plans = {}
	for match in re.finditer(r"const (free|pro|enterprise) = \{(.*?)\n\}", text, re.S):
		plans[match.group(1)] = dict(re.findall(r"^\s*(\w+):\s*(.*?),?\s*$", match.group(2), re.M))
	return plans


def number_of(word):
	return int(word) if word.isdigit() else NUMBERS.get(word.lower())


def check_tables(product, site, failures):
	for plan in ["free", "pro", "enterprise"]:
		product_values = product.get(plan, {})
		site_values = site.get(plan, {})
		for key in sorted(set(product_values) | set(site_values)):
			if product_values.get(key) != site_values.get(key):
				failures.append(f"{relative(PLANS_FILE)} {plan}.{key} is {site_values.get(key)}; the product's is {product_values.get(key)}")
			else:
				# the same
				pass


def check_words(free, failures):
	roots = int(free["max_cloud_roots_per_provider"])
	folders = int(free["max_local_folders"])
	for file in pages() + [f"{ROOT}/README.md"]:
		numbered = [entry for entry in lines_of(file) if entry[2] is False]
		for index, entry in enumerate(numbered):
			number, line = entry[0], entry[1]
			# a phrase may run onto the next line
			text = line + " " + (numbered[index + 1][1] if index + 1 < len(numbered) else "")
			place = f"{relative(file)}:{number}"
			for match in re.finditer(r"\b(\w+) cloud roots (?:on every|per) provider", line):
				if number_of(match.group(1)) is not None and number_of(match.group(1)) != roots:
					failures.append(f"{place} says {match.group(1)} cloud roots per provider; Free has {roots}")
			for match in re.finditer(r"\b(\w+) local\s+folders", text):
				said = number_of(match.group(1))
				if match.start() < len(line) and said is not None and said != folders and "Free" in text:
					failures.append(f"{place} says {match.group(1)} local folders; Free has {folders}")
			for match in re.finditer(r"\ba (\w+) bucket of one provider", line):
				if ORDINALS.get(match.group(1)) is not None and ORDINALS[match.group(1)] != roots + 1:
					failures.append(f"{place} says a {match.group(1)} bucket hits the limit; Free allows {roots}")


def main():
	product = plans_of(sys.argv[1])
	site = plans_of(PLANS_FILE)
	failures = []
	if len(product) != 3:
		failures.append(f"{sys.argv[1]}: no free, pro and enterprise blocks found")
	else:
		check_tables(product, site, failures)
		check_words(product["free"], failures)
	return report("plan numbers", failures)


sys.exit(main())
