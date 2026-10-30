<script setup>
import { computed, ref } from "vue"

// The partner page (docs/partner.md, out of the navigation and the sitemap): a new partner's code
// added on objectexplorer.com, and the QR code of their link with the "e" in the middle. The
// password is checked by the server, never here; the server refuses a code already taken, keeps
// the code, and seals the partner's name so only the owner's machine reads it.
const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
const codePattern = /^[0-9A-HJKMNP-TV-Z]{4}$/

const password = ref("")
const code = ref("")
const name = ref("")
const working = ref(false)
const status = ref("")
const made = ref(undefined)

const ready = computed(() => password.value !== "" && codePattern.test(code.value) && name.value.trim() !== "" && working.value === false)

// typed in upper case, the letters a code never has left out
function typed(event) {
	code.value = event.target.value.toUpperCase().replace(/[^0-9A-HJKMNP-TV-Z]/g, "").slice(0, 4)
	event.target.value = code.value
	status.value = ""
}

function suggest() {
	const picked = new Uint8Array(4)
	crypto.getRandomValues(picked)
	code.value = Array.from(picked, (value) => alphabet[value % 32]).join("")
	status.value = ""
}

async function post(path, body) {
	const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
	return await response.json()
}

async function check() {
	if (password.value !== "" && codePattern.test(code.value)) {
		working.value = true
		try {
			const answer = await post("/affiliate/check", { password: password.value, code: code.value })
			if (answer.error) {
				status.value = answer.error.message
			}
			else if (answer.taken) {
				status.value = `${answer.code} is taken`
			}
			else {
				status.value = `${answer.code} is free`
			}
		}
		catch (error) {
			status.value = "objectexplorer.com did not answer"
		}
		working.value = false
	}
	else {
		status.value = "The password and a code of four are needed"
	}
}

async function add() {
	working.value = true
	status.value = ""
	try {
		const answer = await post("/affiliate/add", { password: password.value, code: code.value, name: name.value.trim() })
		if (answer.error) {
			status.value = answer.error.message
		}
		else {
			made.value = { code: answer.code, link: answer.link, image: `data:image/png;base64,${answer.png}` }
		}
	}
	catch (error) {
		status.value = "objectexplorer.com did not answer"
	}
	working.value = false
}

function another() {
	made.value = undefined
	code.value = ""
	name.value = ""
	status.value = ""
}
</script>

<template>
	<div class="partner-qr">
		<form v-if="made === undefined" class="partner-qr-form" @submit.prevent="add">
			<label>
				<span>Password</span>
				<input v-model="password" type="password" autocomplete="current-password" />
			</label>
			<label>
				<span>Code</span>
				<span class="partner-qr-code">
					<input :value="code" maxlength="4" spellcheck="false" autocomplete="off" placeholder="K7QM" @input="typed" @blur="check" />
					<button type="button" @click="suggest">Suggest</button>
					<button type="button" :disabled="working" @click="check">Check</button>
				</span>
			</label>
			<label>
				<span>Partner</span>
				<input v-model="name" maxlength="200" autocomplete="off" placeholder="Their name, kept sealed" />
			</label>
			<button class="partner-qr-add" type="submit" :disabled="!ready">{{ working ? "Adding…" : "Add and make the QR code" }}</button>
			<p v-if="status" class="partner-qr-status">{{ status }}</p>
		</form>
		<div v-else class="partner-qr-made">
			<img :src="made.image" :alt="`The QR code of ${made.link}`" width="360" height="360" />
			<p><code>{{ made.link }}</code></p>
			<p>
				<a :href="made.image" :download="`objectexplorer-${made.code}.png`">Download the PNG</a>
				<button type="button" @click="another">Another partner</button>
			</p>
		</div>
	</div>
</template>

<style src="./partner-qr.css"></style>
