<script setup>
import { acceptAffiliate, askedCode, consentWanted, declineAffiliate } from "../composables/affiliate.js"
</script>

<!-- Shown only to a visitor who came by a partner's link (?aff=) and has no partner kept yet:
     the cookie that remembers the partner is set only after a yes (composables/affiliate.js). -->
<template>
	<div v-if="consentWanted()" class="affiliate-consent" role="dialog" aria-label="A partner's link">
		<p>
			You came by a partner's link ({{ askedCode() }}). May we keep a cookie for 90 days, so they are
			credited if you download later? <a href="/privacy#partner-links">What it keeps</a>
		</p>
		<div class="affiliate-consent-buttons">
			<button type="button" class="affiliate-consent-yes" @click="acceptAffiliate">Yes</button>
			<button type="button" @click="declineAffiliate">No</button>
		</div>
	</div>
</template>

<style src="./affiliate-consent.css"></style>
