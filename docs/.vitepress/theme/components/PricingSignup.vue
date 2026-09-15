<script setup>
import { computed, ref } from "vue"
import { withBase } from "vitepress"

// Signing up for Pro from this page, with an address and a password.
//
// It lands where the app's own sign-up lands — POST /plan/signup on this host — in the same shape,
// so the host cannot tell which one sent it:
//   emailHash   sha256 of the trimmed, lower-cased address
//   sealed      { email, name, verified } encrypted to the licence key, RSA-OAEP with SHA-256
//   secretHash  sha256 of the secret that collects the licence later
//
// The app makes its secret at random and keeps it in a file. Here the secret is made from the
// password, with the address as salt, so the app can make the same one again from the same two and
// collect the licence issued for this sign-up. The password itself never leaves this page:
//   secret = hex(PBKDF2-SHA256(password, "objectexplorer:" + lower-cased address, 600000, 32 bytes))
const PASSWORD_ROUNDS = 600000
const MIN_PASSWORD_LENGTH = 8

// The public half of the licence key — the same PEM as rock2 server/src/plan/planSeal.js.
const SEAL_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzjJxkqaRRQTK8LjW21fA
gRz/y4HNBXpan951MxiQqNmZ4uucXkBLXN5x9t0kgm8WwRS/Dm0mku0OnJ9jEW5f
rqWZMOuXJ79VhtHRF7Pb3zTMeSU07NjpiSGx5kDToQJDYS+M5Xu74xTcqfz9NxNS
9KaTa4FtdsFKtkH+FT0zYDkE5m/wola8UWTBCb2DkGw3qn7ACUnYG1aJmCfcmxvs
olJ30DumT7PrP8d+2DI6tT67yl52FWowb7Tr7CwlRfQu7QJtKw6TEkmp0xX1rxUG
NsKg6HU32PuZunsYjigsMed8Yaejh9XEyY4jtcTEJKANXZhEwz3C4AoJNrkLW2CA
jTXCpo5xCXN0s9P56v6AX98lESHVbSiTQ89W3y5d7hHNgNRA7/BEHd/VVqInhIqp
arAWKpz7AgOqku3f7j2kzXxiof4fi7kTmN60kiNIUcjNL7UCIOus8Mk0Ope/pqK1
lzMPZduwQ3SUEdn/E9CcyOBm0kk7CnlPZOEV3oeBIoKt1hyWFZcKlJLS/8X5XAFh
5XXv/iXkCdHQBJJf+rabbuQZzIH51Cc/YuKZxEAJWviSfJeNoY/zXTI9uPGAMR8y
lJwdz2gHLBAkl+VhpK4M4HQJqGsdckjCSs9oepiZqhxTQFhp3dqdreImlmwMsOdV
fdOJwy9SuIQ52RuLsXuweCMCAwEAAQ==
-----END PUBLIC KEY-----`

// Something before an @, something after it, a dot and more after that — the app's own check.
const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const opened = ref(false)
const email = ref("")
const password = ref("")
const working = ref(false)
const error = ref("")
const signedUpAs = ref("")

const ready = computed(() => looksLikeEmail.test(email.value.trim()) && password.value.length >= MIN_PASSWORD_LENGTH && working.value === false)

async function signup() {
	error.value = ""
	working.value = true
	const address = email.value.trim()
	try {
		const body = {
			emailHash: await sha256Hex(address.toLowerCase()),
			sealed: await seal({ email: address, name: "", verified: false }),
			secretHash: await sha256Hex(await secretOf(password.value, address.toLowerCase())),
		}
		const response = await fetch("/plan/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
		const answer = await response.json()
		if (answer.error) {
			error.value = answer.error.message ?? "The sign-up was refused."
		}
		else {
			signedUpAs.value = address
		}
	}
	catch (failure) {
		error.value = "The sign-up did not go through. Try again in a moment."
	}
	working.value = false
}

async function sha256Hex(text) {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
	return hexOf(digest)
}

async function secretOf(passwordText, address) {
	const passwordKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(passwordText), "PBKDF2", false, ["deriveBits"])
	const salt = new TextEncoder().encode(`objectexplorer:${address}`)
	const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PASSWORD_ROUNDS }, passwordKey, 256)
	return hexOf(bits)
}

async function seal(payload) {
	const keyBytes = Uint8Array.from(atob(SEAL_KEY_PEM.replace(/-----[^-]+-----|\s/g, "")), (character) => character.charCodeAt(0))
	const sealKey = await crypto.subtle.importKey("spki", keyBytes, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"])
	const sealed = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, sealKey, new TextEncoder().encode(JSON.stringify(payload)))
	return btoa(String.fromCharCode(...new Uint8Array(sealed)))
}

function hexOf(buffer) {
	return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("")
}
</script>

<template>
	<div class="pricing-signup">
		<div v-if="signedUpAs" class="pricing-signup-form">
			<p class="pricing-signup-done">You are signed up as {{ signedUpAs }}.</p>
			<a class="pricing-action" :href="withBase('/download')">Download</a>
		</div>
		<form v-else-if="opened" class="pricing-signup-form" @submit.prevent="signup">
			<input v-model="email" class="pricing-signup-field" type="email" autocomplete="email" placeholder="you@company.com">
			<input v-model="password" class="pricing-signup-field" type="password" autocomplete="new-password" :placeholder="`Password, ${MIN_PASSWORD_LENGTH} characters or more`">
			<p v-if="error" class="pricing-signup-error">{{ error }}</p>
			<button class="pricing-action" type="submit" :disabled="ready === false">{{ working ? "Signing up…" : "Sign up" }}</button>
		</form>
		<button v-else class="pricing-action" type="button" @click="opened = true">Sign up</button>
	</div>
</template>

<style>
/* takes the place of the button, so it takes the button's place at the bottom of the shared row */
.pricing-signup {
	display: flex;
	flex-direction: column;
	margin-top: auto;
}

.pricing-signup-form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.pricing-signup-field {
	background: var(--vp-c-bg);
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	color: var(--vp-c-text-1);
	font-size: 15px;
	padding: 10px 12px;
}

.pricing-signup-field:focus {
	border-color: var(--vp-c-brand-1);
	outline: none;
}

.pricing-signup .pricing-action {
	cursor: pointer;
	font-family: inherit;
}

.pricing-signup .pricing-action:disabled {
	cursor: default;
	opacity: 0.5;
}

.pricing-signup-done {
	color: var(--vp-c-text-1);
	font-size: 15px;
	line-height: 1.5;
	margin: 0;
}

.pricing-signup-error {
	color: var(--vp-c-danger-1);
	font-size: 14px;
	line-height: 1.5;
	margin: 0;
}
</style>
