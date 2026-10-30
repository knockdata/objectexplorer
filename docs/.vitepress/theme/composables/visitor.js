import { ref } from "vue"

// The visitor's id (1029-9). A partner's link is objectexplorer.com/?id=K7QM: four characters of
// Crockford's base32 (no I, L, O or U), the partner's code, which simply is the visitor's id. The
// server keeps it in the id cookie (ten years; a newer link's id replaces it, the last link wins)
// with no question asked, since it is what makes the site credit the partner. The page reads the
// id the address carries, else the cookie's, and carries it on in every share and download link,
// so the partner is credited for a download from a link passed on. Only a partner's code is
// carried: a registered visitor's own id (api.js's, HttpOnly) is never put in a link.
const codePattern = /^[0-9A-HJKMNP-TV-Z]{4}$/

// one state for every component of the page
const current = ref("")

// the id cookie's partner code, else ""
function cookieId() {
	let found = ""
	for (const part of document.cookie.split(";")) {
		const [name, value] = part.trim().split("=")
		if (name === "id" && codePattern.test(value ?? "")) {
			found = value
		}
	}
	return found
}

// read once the page is in the browser (onMounted): the address's ?id=, else the cookie's
export function readVisitor() {
	const asked = (new URLSearchParams(location.search).get("id") ?? "").trim().toUpperCase()
	if (codePattern.test(asked)) {
		current.value = asked
	}
	else {
		current.value = cookieId()
	}
}

// the id the page's links carry, "" for none
export function visitorId() {
	return current.value
}

// a link of this site with the visitor's id added, when there is one
export function withVisitor(link) {
	const id = visitorId()
	if (id) {
		const separator = link.includes("?") ? "&" : "?"
		return `${link}${separator}id=${id}`
	}
	else {
		return link
	}
}
