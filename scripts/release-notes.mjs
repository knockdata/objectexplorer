// The short notes a GitHub release shows: the downloads people look for first (the asset list
// below is GitHub's, sorted by name, the first ten shown: the updaters' zips and .appinstaller
// files take those places), this version's bullets, and a link to the full list on the site.
//
//   node scripts/release-notes.mjs v0.5.6 CHANGELOG.md [release-files] > notes.md
//
// release-files: the folder of the release's assets; a download is listed only when its file is
// there (a dry run has no msix), with its size. A version with no section in CHANGELOG.md writes
// the downloads alone, or nothing without the folder.
import fs from "node:fs";
import path from "node:path";

const REPOSITORY = "https://github.com/knockdata/objectexplorer";

// one line a system: its downloads by processor
const DOWNLOADS = [
	{ system: "macOS", files: [{ label: "Apple silicon", name: "objectexplorer-app-darwin-arm64.dmg" }, { label: "Intel", name: "objectexplorer-app-darwin-x64.dmg" }] },
	{ system: "Windows", files: [{ label: "x64", name: "objectexplorer-windows-x64.msix" }, { label: "Arm", name: "objectexplorer-windows-arm64.msix" }] },
	{ system: "Linux", files: [{ label: "x64", name: "objectexplorer-linux-x64.tar.gz" }, { label: "Arm", name: "objectexplorer-linux-arm64.tar.gz" }] },
];

const [tag, changelogPath, folder] = process.argv.slice(2);
process.stdout.write(releaseNotes(fs.readFileSync(changelogPath, "utf8"), tag, folder));

export function releaseNotes(changelog, tag, folder) {
	const downloads = folder !== undefined ? downloadLines(tag, folder) : [];
	const bullets = bulletsOf(sectionOf(changelog, tag));
	const parts = [];
	if (downloads.length > 0) {
		parts.push("### Download", "", ...downloads, "", `or from [objectexplorer.com/download](https://objectexplorer.com/download), which also reaches you where GitHub cannot`, "");
	}
	else {
		// no assets named
	}
	if (bullets.length > 0 && downloads.length > 0) {
		parts.push("### What's new", "", ...bullets, "", "[Full release notes](https://objectexplorer.com/changelog)", "");
	}
	else if (bullets.length > 0) {
		parts.push(...bullets, "", "[Full release notes](https://objectexplorer.com/changelog)", "");
	}
	else {
		// nothing was written about this version
	}
	return parts.join("\n");
}

// "- **macOS**: [Apple silicon (33.6 MB)](…) · [Intel (37.1 MB)](…)" for the files that are there
function downloadLines(tag, folder) {
	const lines = [];
	for (const entry of DOWNLOADS) {
		const links = entry.files.filter(file => fs.existsSync(path.join(folder, file.name))).map(file => `[${file.label} (${megabytes(fs.statSync(path.join(folder, file.name)).size)})](${REPOSITORY}/releases/download/${tag}/${file.name})`);
		if (links.length > 0) {
			lines.push(`- **${entry.system}**: ${links.join(" · ")}`);
		}
		else {
			// none of this system's files
		}
	}
	return lines;
}

function megabytes(bytes) {
	return `${(bytes / 1048576).toFixed(1)} MB`;
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
