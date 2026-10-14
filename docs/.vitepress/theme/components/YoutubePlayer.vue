<script setup>
import { withBase } from "vitepress"
import { onBeforeUnmount, onMounted, ref } from "vue"

// A film on YouTube. Until it is clicked it is our own poster image, so the page loads nothing from
// Google and needs no cookie notice. The click is the viewer asking for the film: only then is the
// player made, from youtube-nocookie.com, and the line on the poster says beforehand where it plays
// from. Our films carry their subtitles burned in, so YouTube's own captions are turned off.
const props = defineProps({
	video: { type: String, required: true },
	poster: { type: String, required: true },
	title: { type: String, required: true },
	// the click that asked for the film was elsewhere (a story card's Play), so the player starts at once
	start: { type: Boolean, default: false },
})

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com"
const PLAYING = 1

const playing = ref(false)
const frame = ref(null)

onMounted(function () {
	if (props.start) {
		play()
	}
})

function play() {
	playing.value = true
	window.addEventListener("message", on_player_message)
}

function player_address() {
	const origin = encodeURIComponent(window.location.origin)
	return `${PLAYER_ORIGIN}/embed/${props.video}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0&iv_load_policy=3&enablejsapi=1&origin=${origin}`
}

function send_to_player(message) {
	if (frame.value && frame.value.contentWindow) {
		frame.value.contentWindow.postMessage(JSON.stringify({ ...message, channel: "widget", id: props.video }), PLAYER_ORIGIN)
	}
}

// asks the player to report its events; without it no onReady or onStateChange comes back
function on_player_load() {
	send_to_player({ event: "listening" })
}

// cc_load_policy=0 is not honoured when the viewer has captions on in their YouTube settings, and
// the captions module loads again with each play, so it is unloaded whenever playing starts
function on_player_message(event) {
	if (event.origin === PLAYER_ORIGIN && frame.value && event.source === frame.value.contentWindow && typeof event.data === "string") {
		const data = JSON.parse(event.data)
		const state = data.event === "onStateChange" ? data.info : data.info?.playerState
		if (data.event === "onReady" || state === PLAYING) {
			send_to_player({ event: "command", func: "unloadModule", args: ["captions"] })
			send_to_player({ event: "command", func: "unloadModule", args: ["cc"] })
		}
	}
}

onBeforeUnmount(function () {
	window.removeEventListener("message", on_player_message)
})
</script>

<template>
	<iframe
		v-if="playing"
		ref="frame"
		class="youtube-player"
		:src="player_address()"
		:title="title"
		allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
		allowfullscreen
		@load="on_player_load"
	></iframe>
	<button v-else class="youtube-player-poster" type="button" @click="play" aria-label="Play the film">
		<img class="youtube-player" :src="withBase(poster)" alt="" />
		<span class="youtube-player-play">
			<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
		</span>
		<span class="youtube-player-notice">Plays from YouTube; their privacy policy applies.</span>
	</button>
</template>

<style>
.youtube-player {
	border: 0;
	display: block;
	height: 100%;
	object-fit: cover;
	width: 100%;
}

.youtube-player-poster {
	background: none;
	border: 0;
	cursor: pointer;
	display: block;
	height: 100%;
	padding: 0;
	position: relative;
	width: 100%;
}

.youtube-player-play {
	align-items: center;
	background: var(--brand);
	border-radius: 50%;
	box-shadow: 0 0 0 10px var(--brand-soft), 0 18px 40px -16px var(--brand-glow);
	color: var(--brand-text);
	display: flex;
	height: 66px;
	justify-content: center;
	left: 50%;
	padding-left: 3px;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	transition: transform 0.2s ease;
	width: 66px;
}

.youtube-player-poster:hover .youtube-player-play {
	transform: translate(-50%, -50%) scale(1.06);
}

.youtube-player-notice {
	background: rgba(0, 0, 0, 0.55);
	border-radius: 6px;
	bottom: 10px;
	color: #fff;
	font-size: 12px;
	left: 50%;
	line-height: 1.5;
	padding: 3px 10px;
	position: absolute;
	transform: translateX(-50%);
	white-space: nowrap;
}
</style>
