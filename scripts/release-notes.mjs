// The short notes a GitHub release shows: this version's bullets, and a link to the full list on
// the site.
//
//   node scripts/release-notes.mjs v0.5.6 CHANGELOG.md > notes.md
//
// A version with no section in CHANGELOG.md writes nothing, and the release is then the generated
// commit list alone, exactly as it was before.
import fs from "node:fs";

const [tag, changelogPath] = process.argv.slice(2);
process.stdout.write(shortNotes(fs.readFileSync(changelogPath, "utf8"), tag));

export function shortNotes(changelog, tag) {
	const bullets = bulletsOf(sectionOf(changelog, tag));
	let notes = "";
	if (bullets.length > 0) {
		notes = [...bullets, "", "[Full release notes](https://objectexplorer.com/changelog)"].join("\n") + "\n";
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

// Every `- ` line of the section, as it is written. The changelog is already one bullet per change.
function bulletsOf(section) {
	return section.split("\n").filter(line => line.startsWith("- "));
}
