// The short notes a GitHub release shows: this version's opening line, one bullet per headline,
// and a link to the full section on the site. The whole CHANGELOG section is too long to read on
// a page whose job is handing over a download — the headlines say what changed, the site says why.
//
//   node scripts/release-notes.mjs v0.5.6 CHANGELOG.md > notes.md
//
// A version with no section in CHANGELOG.md writes nothing, and the release is then the generated
// commit list alone, exactly as it was before.
import fs from "node:fs";

const [tag, changelogPath] = process.argv.slice(2);
process.stdout.write(shortNotes(fs.readFileSync(changelogPath, "utf8"), tag));

export function shortNotes(changelog, tag) {
	const section = sectionOf(changelog, tag);
	let notes = "";
	if (section) {
		const all = [ledeOf(section), "", ...linesOf(section),
			"", "[Full release notes](https://objectexplorer.com/changelog)"];
		// two blank lines in a row is one blank line, so a heading can ask for the space around it
		// without knowing what was written before it
		notes = all.filter((line, i) => line !== "" || all[i - 1] !== "").join("\n") + "\n";
	}
	else {
		// nothing was written about this version
	}
	return notes;
}

// `## v0.5.6` down to the next `## `, the same cut the workflow used to make in awk.
function sectionOf(changelog, tag) {
	const lines = changelog.split("\n");
	const start = lines.findIndex(line => line.startsWith(`## ${tag}`));
	let section = "";
	if (start >= 0) {
		const rest = lines.slice(start + 1);
		const end = rest.findIndex(line => line.startsWith("## "));
		section = (end >= 0 ? rest.slice(0, end) : rest).join("\n");
	}
	else {
		// no section for this tag
	}
	return section;
}

// The paragraph under the heading, on one line: the sentence in bold and the reason after it.
function ledeOf(section) {
	const paragraph = section.trim().split("\n\n")[0];
	return paragraph.split("\n").join(" ").trim();
}

// The bold lead-in of every top-level bullet — `- **A project that refuses…** the rest` — which is
// what each bullet was written to be read as when it is read on its own, under the sub-heading it
// was written under, because "rendered as text" only says what it says under Fixed.
function linesOf(section) {
	const lines = [];
	for (const line of section.split("\n")) {
		const heading = /^### (.+)$/.exec(line);
		const bullet = /^- \*\*(.+?)\*\*/.exec(line);
		if (heading) {
			lines.push("", `**${heading[1]}**`, "");
		}
		else if (bullet) {
			lines.push(`- ${bullet[1].replace(/[,:.]$/, "")}`);
		}
		else {
			// a continuation line, or a bullet with no headline of its own
		}
	}
	return lines;
}
