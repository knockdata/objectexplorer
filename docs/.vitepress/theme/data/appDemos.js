// Every live demo a page frames, by name: <AppDemo name="sql" />. Each opens one object in the
// public app's demo folder (rock2/objectexplorer/demo), the only root objectexplorer.com/app
// serves. `focus` leaves only the object on screen; without it the tree, the tabs and the
// toolbar show too, with `reveal` opening the tree down to the object.
//
// A cell is "<type>:<code>", type one of table, chart, model, code, markdown. An empty code
// is the cell working out its own start, as it does in a fresh notebook. Python is not here:
// the public app has no Python to run it with.

const stationsByCountry = "SELECT country, count(*) AS stations FROM 'nl_train_stations.parquet' GROUP BY country ORDER BY stations DESC"

const stationsChart = `Plot.plot({
	width, height,
	marginLeft: 60,
	grid: true,
	marks: [Plot.barY(rows, {x: "country", y: "stations", sort: {x: "-y"}, tip: true})],
})`

export const appDemos = {
	usage: {
		open: "usage/",
		image: "/screenshot/usage-visualization.png",
		alt: "The usage disc: a pole for every root and every kind of thing it holds",
	},
	fitsTogether: {
		open: "folder/demo/diagram/how-it-fits-together.excalidraw",
		image: "/diagram/how-it-works.svg",
		alt: "The window and any agent talk to one local server, which signs requests straight to your storage",
	},
	howItWorks: {
		open: "folder/demo/diagram/how-it-works.excalidraw",
		image: "/diagram/how-it-works.svg",
		alt: "Opening a file: the local server, the cache or the provider, a reader in a worker, the view",
	},
	columnSummary: {
		open: "folder/demo/nl_train_stations.parquet",
		cells: ["table:SELECT * FROM 'nl_train_stations.parquet' LIMIT 100"],
		image: "/screenshot/column-summary.png",
		alt: "A parquet grid with a summary under every column header",
	},
	search: {
		open: "folder/demo/",
		search: "station",
		reveal: true,
		focus: false,
		image: "/screenshot/search.png",
		alt: "Search results across the demo folder, grouped by file with the matching line",
	},
	hex: {
		open: "folder/demo/nl_train_stations.parquet",
		view: "hex",
		reveal: true,
		focus: false,
		image: "/screenshot/hex.png",
		alt: "The hex viewer: offsets, hex pairs and the ASCII column",
	},
	archive: {
		open: "folder/demo/archive/sample.zip/sample/",
		reveal: true,
		focus: false,
		image: "/screenshot/archive.png",
		alt: "A zip browsed as a folder, its entries listed like files",
	},
	notebook: {
		open: "folder/demo/nl_train_stations.parquet",
		cells: [
			"markdown:# Stations per country\nA table cell asks, the chart cell under it draws what came back.",
			"table:" + stationsByCountry,
			"chart:" + stationsChart,
		],
		height: "680px",
		image: "/screenshot/notebook-sql.png",
		alt: "A notebook: a note, a query over the parquet, and a chart of its rows",
	},
	sql: {
		open: "folder/demo/nl_train_stations.parquet",
		cells: ["table:SELECT country, type, count(*) AS stations FROM 'nl_train_stations.parquet' GROUP BY ALL ORDER BY stations DESC"],
		image: "/screenshot/notebook-sql.png",
		alt: "A table cell: the SQL over the object, and the rows it returned with their column summaries",
	},
	chart: {
		open: "folder/demo/nl_train_stations.parquet",
		cells: ["table:" + stationsByCountry, "chart:" + stationsChart],
		height: "640px",
		image: "/screenshot/notebook-chart.png",
		alt: "A chart cell: stations per country, drawn from the rows above",
	},
	model: {
		open: "folder/demo/synthetic-survival.xpt",
		cells: ["model:"],
		height: "640px",
		image: "/screenshot/notebook-model.png",
		alt: "A model cell: features and sliders, the training source, feature importance and a SHAP waterfall",
	},
	delta: {
		open: "folder/demo/delta/sales/_delta_log/",
		height: "360px",
		image: "/screenshot/lake-metadata.png",
		alt: "_delta_log opened as commit history: every version with the files it added and removed",
	},
	hudi: {
		open: "folder/demo/hudi/sales/.hoodie/",
		height: "360px",
		image: "/screenshot/lake-metadata.png",
		alt: ".hoodie opened as the timeline of commits",
	},
	iceberg: {
		open: "folder/demo/iceberg/sales/metadata/",
		height: "360px",
		image: "/screenshot/lake-metadata.png",
		alt: "An Iceberg metadata folder opened as its chain of snapshots, manifests and files",
	},
	pdf: {
		open: "folder/demo/pdf/tour.pdf",
		height: "640px",
		image: "/screenshot/pdf-reader.png",
		alt: "A PDF open in the reader, with its contents panel beside the page",
	},
	image: {
		open: "folder/demo/image/sample_gps.jpg",
		image: "/screenshot/image-exif.png",
		alt: "An image with its EXIF and GPS metadata beside it",
	},
	ebook: {
		open: "folder/demo/ebook/the-lighthouse-keeper.epub",
		image: "/screenshot/ebook.png",
		alt: "An epub opened as a book, showing its cover",
	},
	spriteSheet: {
		open: "folder/demo/sprite/medievalRTS_spritesheet@2.xml",
		image: "/screenshot/sprite-sheet.png",
		alt: "A texture atlas with every sprite's bounding box overlaid and named",
	},
	cad: {
		open: "folder/demo/cad/nist_ftc_11_asme1_rb.stp",
		image: "/screenshot/format-cad.png",
		alt: "A STEP part drawn in the CAD view, with its face count and size above it",
	},
	model3d: {
		open: "folder/demo/model/City.glb",
		image: "/screenshot/format-model.png",
		alt: "City.glb in the model view: a low-poly city block, with the model toolbar above it",
	},
	shader: {
		open: "folder/demo/shader/lit.wgsl",
		image: "/screenshot/format-shader.png",
		alt: "lit.wgsl in the shader view: a lit sphere, its uniforms and pipeline diagram",
	},
}
