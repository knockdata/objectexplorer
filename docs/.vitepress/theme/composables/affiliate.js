import { ref } from "vue"

// A partner's link is objectexplorer.com/?aff=K7QM: four characters of Crockford's base32 (no I, L,
// O or U). The code rides on in every share and download link of the page, so the partner is
// credited for a download from a link passed on. Remembering it for later visits takes the cookie
// aff=<code>.<unix seconds>, which the server sets for 90 days, and only after the visitor said yes
// to the consent line (AffiliateConsent.vue), shown only to someone who came with a code. The server
// counts only codes it knows, and the first one kept wins for its 90 days.
const codePattern = /^[0-9A-HJKMNP-TV-Z]{4}$/
const cookieDays = 90

// one state for every component of the page
const kept = ref("")
const asked = ref("")
const answered = ref(false)
const declined = ref(false)

// the code the cookie keeps while it is under 90 days old, else ""
function cookieCode() {
	let found = ""
	for (const part of document.cookie.split(";")) {
		const [name, value] = part.trim().split("=")
		if (name === "aff" && value) {
			const [code, seconds] = value.split(".")
			const age = Date.now() / 1000 - Number(seconds)
			if (codePattern.test(code) && age >= 0 && age < cookieDays * 24 * 60 * 60) {
				found = code
			}
		}
	}
	return found
}

// read once the page is in the browser (onMounted): the cookie's code and the address's ?aff=
export function readAffiliate() {
	kept.value = cookieCode()
	const code = (new URLSearchParams(location.search).get("aff") ?? "").trim().toUpperCase()
	if (codePattern.test(code)) {
		asked.value = code
	}
	else {
		asked.value = ""
	}
}

// the code the page's links carry: the cookie's, else the one the visitor came with unless they said no
export function affiliateCode() {
	if (kept.value) {
		return kept.value
	}
	else if (declined.value) {
		return ""
	}
	else {
		return asked.value
	}
}

// whether to ask: a code in the address, no code kept yet, not answered on this page
export function consentWanted() {
	return asked.value !== "" && kept.value === "" && answered.value === false
}

export function askedCode() {
	return asked.value
}

// yes: the server checks the code and sets the cookie; an unknown code sets nothing
export async function acceptAffiliate() {
	answered.value = true
	try {
		const response = await fetch("/affiliate/accept", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ aff: asked.value }),
		})
		const answer = await response.json()
		kept.value = answer.code ?? ""
	}
	catch (error) {
		console.warn(error)
	}
}

// no: nothing kept, and the links stop carrying the code
export function declineAffiliate() {
	answered.value = true
	declined.value = true
}

// a link of this site with the code added, when there is one
export function withAffiliate(link) {
	const code = affiliateCode()
	if (code) {
		const separator = link.includes("?") ? "&" : "?"
		return `${link}${separator}aff=${code}`
	}
	else {
		return link
	}
}
