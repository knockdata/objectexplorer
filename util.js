import fsp from "node:fs/promises";

export async function readJson(file, defaultValue) {
	try {
		const content = await fsp.readFile(file, "utf8");
		return JSON.parse(content);
	} catch (err) {
		return defaultValue;
	}
}
export async function writeJson(file, object) {
	try {
		const content = JSON.stringify(object, null, 4);
		await fsp.writeFile(file, content, "utf8");
	} catch (err) {
		console.error(err);
	}
}

export async function fetchJson(fullUrl) {
	try {
		// bound the wait so an unreachable or hanging server never blocks startup
		const response = await fetch(fullUrl, { signal: AbortSignal.timeout(5000) });
		if (response.ok) {
			return await response.json();
		}
	} catch (error) {
		console.log(fullUrl, error);
	}
	return undefined;
}
