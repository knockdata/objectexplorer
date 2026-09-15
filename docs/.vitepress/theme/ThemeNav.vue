<script setup>
import LandingNav from "./components/LandingNav.vue"
</script>

<!-- Stands in for VitePress's own VPNav (config.js aliases it), so every page wears the landing's
     header. It keeps VPNav's positioning — in the flow on a phone, fixed from 960px — which the
     sidebar and the content are offset from. -->
<template>
	<div class="theme-nav">
		<LandingNav app-link="https://objectexplorer.com/app" />
	</div>
</template>

<style>
.theme-nav {
	position: relative;
	width: 100%;
	z-index: var(--vp-z-index-nav);
}

@media (min-width: 960px) {
	.theme-nav {
		position: fixed;
		top: 0;
	}
}
</style>
