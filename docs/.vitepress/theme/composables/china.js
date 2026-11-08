import { onMounted, ref } from "vue"

// cn.objectexplorer.com is the copy of the site for visitors in mainland China, served from Hong Kong
// (YouTube cannot be reached from the mainland). There the films play from our own files, without
// the YouTube notice; every link stays as it is. The same built pages serve both hosts, so this is told in the browser, once mounted;
// the pages are first drawn as objectexplorer.com's.
const CHINA_HOST = /^cn\./

// whether this page is served by cn.objectexplorer.com; in the browser only
export function isChinaSite() {
	return CHINA_HOST.test(window.location.hostname)
}

export function useChina() {
	const inChina = ref(false)
	onMounted(function () {
		inChina.value = isChinaSite()
	})
	return { inChina }
}
