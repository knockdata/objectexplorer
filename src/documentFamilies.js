// Which document icon each extension wears: a family is one drawing, shared by the extensions that
// hold the same kind of thing. The drawings are made by scripts/documentIcons.mjs into
// assets/document/, and every OS is handed the family of each extension — macOS a
// CFBundleDocumentTypes entry per family, the msix a FileTypeAssociation per family, linux a
// mimetype icon per mime.
//
// An extension named nowhere here wears `data`: our own mark on a page.
export const documentFamilies = {
	parquet: "parquet",
	arrow: "arrow feather ipc",
	avro: "avro",
	orc: "orc",
	table: "sas7bdat xpt sav",
	hdf5: "h5 hdf5 he5",
	netcdf: "nc nc4 cdf",
	sqlite: "sqlite sqlite3",
	excalidraw: "excalidraw",
	dwg: "dwg",
	step: "step stp",
	solidworks: "sldprt sldasm slddrw",
	catia: "catpart catproduct",
	gltf: "glb gltf",
	fbx: "fbx",
	obj: "obj",
	blend: "blend",
}

export const genericFamily = "data"

const familyByExt = new Map(Object.entries(documentFamilies).flatMap(([family, exts]) => exts.split(" ").map(ext => [ext, family])))

export function familyOf(ext) {
	return familyByExt.get(String(ext).toLowerCase()) ?? genericFamily
}

// every family, the generic one last
export function familyNames() {
	return [...Object.keys(documentFamilies), genericFamily]
}

// file types grouped by family, in family order, leaving out families with none
export function groupByFamily(fileTypes) {
	const groups = new Map(familyNames().map(family => [family, []]))
	for (const fileType of fileTypes) {
		groups.get(familyOf(fileType.ext)).push(fileType)
	}
	return [...groups].filter(([family, members]) => members.length > 0)
}

// The extensions the file managers ask us to draw a thumbnail or a preview of: the tables the
// preview renderer reads (rock2/preview/previewModel.js previewExtensions — keep the two equal).
// Every other file keeps its document icon.
export const previewExtensions = ["parquet", "arrow", "feather", "ipc", "avro", "orc", "sas7bdat", "xpt", "sav", "csv", "tsv"]
