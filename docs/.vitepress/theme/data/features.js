// The landing's tiles (LandingFeatures): what the app does, each with a crop of a docs screenshot
// (public/feature/, 800×500) and the page that says more. Eight, so they sit four across and two down on a wide screen.
export const features = [
	{
		title: "Every storage in one tree",
		text: "S3 and its kind, Google Cloud Storage, Azure Blob, OneLake, BigQuery, Google Drive, Dropbox, OneDrive, Box, FTP and SFTP servers, and your own disk.",
		link: "/explore/tree",
		picture: "/feature/tree-providers.jpg",
		alt: "The tree with a root for each cloud and a local folder",
	},
	{
		title: "Every file opened as itself",
		text: "More than 900 kinds of file: Parquet and Excel, PDFs and ebooks, CAD parts and 3D models, scans and recordings, circuit boards, mailboxes, maps and molecules.",
		link: "/formats/",
		picture: "/feature/format-circuit-boards.jpg",
		alt: "A KiCad circuit board drawn with its parts and tracks",
	},
	{
		title: "SQL where the file lives",
		text: "A notebook opens on any table with its query written: Parquet, CSV, a lake table, a sheet, a database file. Nothing is imported first.",
		link: "/analyze/sql",
		picture: "/feature/notebook-sql.jpg",
		alt: "A Parquet file opened as a notebook, the query above its rows",
	},
	{
		title: "Where the money goes",
		text: "Every bucket and folder on one disc: what it costs a month, what has gone cold, what is kept twice, and the commands that cut it.",
		link: "/explore/usage",
		picture: "/feature/usage-visualization.jpg",
		alt: "The usage disc, a pole for every root",
	},
	{
		title: "Read, measure, edit",
		text: "A PDF or an ebook read as a book, distances and areas measured on a drawing, a model or a page, a text file edited and saved.",
		link: "/explore/measure",
		picture: "/feature/measure.jpg",
		alt: "A washer's radius and volume measured on its STEP part",
	},
	{
		title: "Ask the agent you use",
		text: "Claude, Copilot, Gemini, ChatGPT or a model of your own, in the side bar beside the file you are looking at.",
		link: "/agents/ask",
		picture: "/feature/ask-side.jpg",
		alt: "The agent side bar beside an open file",
	},
	{
		title: "An agent is just another user",
		text: "It reads through the app, under rules you wrote: personal data rewritten on the way out, and every call logged to replay.",
		link: "/agents/",
		picture: "/feature/story-agent-rules.jpg",
		alt: "The rules that decide what an agent may read",
	},
	{
		title: "Hand it over in any shape",
		text: "A table as Excel or CSV, a deck as PDF or Word, a folder as a zip, or an anonymized copy to test with.",
		link: "/explore/download",
		picture: "/feature/download.jpg",
		alt: "The Download ring with its formats",
	},
]
