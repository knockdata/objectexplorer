import { useData, withBase } from "vitepress"
import simplified_chinese from "./simplified_chinese.js"

// The language the landing speaks, as the explorer does it (foldone 1105-1): every text is written in
// English in the components and goes through translate(english), which gives it from the catalog of
// the page's language (English text → its translation, "" to show nothing). A text the catalog does
// not hold shows in English. The page's language is its VitePress locale (config.js): / is English, /chinese/ Simplified
// Chinese; the documentation is English only.
//
// The choice is the app's own: localStorage "fo setting language" (lib/ui/app.web.js in foldone), on
// the same origin as the app at /app/, so a language chosen here is the one the app opens in, and the
// other way round. Kept only when it differs from the browser's languages; nothing kept is "system".
export const LANGUAGES = [
	{ name: "english", title: "English", code: "en", landing: "/", catalog: undefined },
	{ name: "simplified_chinese", title: "简体中文", code: "zh-Hans", landing: "/chinese/", catalog: simplified_chinese },
]

const CHOICE_KEY = "fo setting language"

// the language whose standard code is code, English when none is
function languageOfCode(code) {
	return LANGUAGES.find(language => language.code === code) ?? LANGUAGES[0]
}

// the language named, or undefined
function languageNamed(name) {
	return LANGUAGES.find(language => language.name === name)
}

// the language the browser asks for: the first of its languages there is a landing for; any Chinese is
// Simplified Chinese, the one Chinese there is
function browserLanguage() {
	let found
	for (const code of navigator.languages ?? [navigator.language]) {
		const lower = code.toLowerCase()
		if (found === undefined && lower.startsWith("zh")) {
			found = languageNamed("simplified_chinese")
		}
		else if (found === undefined && lower.startsWith("en")) {
			found = languageNamed("english")
		}
	}
	return found ?? LANGUAGES[0]
}

// the person's kept choice, undefined when none is kept (or storage cannot be read)
function keptLanguage() {
	let found
	try {
		const kept = localStorage.getItem(CHOICE_KEY)
		if (kept) {
			found = languageNamed(JSON.parse(kept))
		}
	}
	catch (error) {
		console.warn(error)
	}
	return found
}

// the language the visitor wants: their kept choice, else the browser's
export function wantedLanguage() {
	return keptLanguage() ?? browserLanguage()
}

// keeps the visitor's choice, as the app does: only when it differs from the browser's
export function chooseLanguage(name) {
	try {
		if (name === browserLanguage().name) {
			localStorage.removeItem(CHOICE_KEY)
		}
		else {
			localStorage.setItem(CHOICE_KEY, JSON.stringify(name))
		}
	}
	catch (error) {
		console.warn(error)
	}
}

// for a component: { language, translate(english), landing (this language's landing, with the base) }
export function useLanguage() {
	const { lang } = useData()
	function current() {
		return languageOfCode(lang.value)
	}
	function translate(english) {
		const catalog = current().catalog
		if (catalog && english in catalog) {
			return catalog[english]
		}
		else {
			return english
		}
	}
	function landing() {
		return withBase(current().landing)
	}
	return { current, translate, landing }
}
