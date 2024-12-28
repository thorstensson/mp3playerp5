<script setup lang="ts">
import { ref, useTemplateRef, reactive, watch, onMounted, computed } from "vue";
import { useEventListener } from "@vueuse/core";
import type { MaybeRef } from "@vueuse/core";
import { gsap } from "gsap";
import { PlayIcon, PauseIcon } from "@heroicons/vue/24/solid";
import MinimlSpectrumVisualizer from "./MinimlSpectrumVisualizer.vue";

let audioCtx: AudioContext;
let analyser: AnalyserNode;
//let gainNode: GainNode;

const firstRun = ref<boolean>(true);

const spectrum = useTemplateRef("spectrum");
const volume = useTemplateRef("volume");
const audioEl = useTemplateRef("audio-element");
const progressBar = useTemplateRef("progress-bar");
const progressBarFilled = useTemplateRef("progress-bar-filled");
const panelTrack = useTemplateRef("panel-track");

const trackTime = ref<string>("00:00");
const trackDuration = ref<string>("00.00");
const trackIndex = ref<number>(0);
const currentTrack = ref<string>("");
const isPlaying = ref<boolean>(false);

// Add mp3 path here, local or online, but use your own S3 bucket or local path
const PATH = "https://audio-tt.s3.amazonaws.com";

// The panel width, if track text wider then GSAP yoyo
const TRACK_WIDTH = 160;


//Add tracks here; no plans to make a DOM playlist at the moment (see Roadmap)
const playlist = reactive([
    { artist: "Ernes Guevara", track: "Ernes Guevara - Lost (Original Mix).mp3" },
    { artist: "Stockholm Syndrome, Young Squage", track: "Stockholm Syndrome, Young Squage - Hysteria (feat. Stockholm Syndrome) (Radio Edit).mp3" },
    { artist: "EMPHI", track: "EMPHI - Pair of Dice (Original Mix).mp3" }
]);

// Check for remaining tracks 
const playlistLen = computed(() => {
    return trackIndex.value < playlist.length - 1;
})

const currTrack = computed(() => {
    return playlist[trackIndex.value].track;
})

/**
 * We create an AudioContext after user interaction. 
 * TODO: Make this a composable, also when that is done, it should be in MinimlSpectrumVisualizer
 */
const createAudioContext = () => {
    console.log("CONTEXT")
    audioCtx = new AudioContext();
    const audioSrc = audioCtx.createMediaElementSource(audioEl.value!)
    analyser = audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);

    /* leaving gain node out of the code for the moment, many report 0 as not 0 on gain, using regular volume
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(audioCtx.destination);
    audioSrc.connect(gainNode);
    */

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    firstRun.value = false;
}

const doScrub = (e: MouseEvent) => {
    if (progressBar.value && audioEl.value) {
        const scrubTime = (e.offsetX / progressBar.value!.offsetWidth) * audioEl.value.duration;
        audioEl.value.currentTime = scrubTime;
    }
}

// Turns out that AudioContext too needs user interaction before instantiation
const togglePlay = () => {
    if (firstRun.value) createAudioContext()
    isPlaying.value = !isPlaying.value;
    if (isPlaying.value && audioEl.value) {
        audioEl.value.play()
        spectrum.value?.startAnimRequest();
    } else if (audioEl.value) {
        audioEl.value.pause();
        spectrum.value?.cancelAnimRequest()
    }
}

const playNext = () => {
    // provides a way to cancel event, needed if end of last track in playlist
    const cancelcan = useEventListener(audioEl.value as unknown as MaybeRef, 'canplaythrough', () => {
        spectrum.value?.startAnimRequest();
        audioEl.value?.play();
        cancelcan();
    })
}

// E from v-on listener
const timeUpdate = () => {
    progressUpdate();
    setTimes();
}

const progressUpdate = () => {
    const percent = (audioEl.value!.currentTime / audioEl.value!.duration) * 100;
    progressBarFilled.value!.style.flexBasis = `${percent}%`;
}

const setTimes = () => {
    const m = ('0' + Math.floor(audioEl.value!.currentTime / 60 % 60)).slice(-2);
    const s = ('0' + Math.floor(audioEl.value!.currentTime % 60)).slice(-2);
    trackTime.value = `${m}:${s}`;
}

// E from v-on listener
const durationUpdate = () => {
    const m = ('0' + Math.floor(audioEl.value!.duration / 60 % 60)).slice(-2);
    const s = ('0' + Math.floor(audioEl.value!.duration % 60)).slice(-2);
    trackDuration.value = `${m}:${s}`;
}

const onTrackEnded = () => {
    progressBarFilled.value!.style.flexBasis = "0%";
    if (playlistLen.value && audioEl.value) {
        audioEl.value.pause();
        spectrum.value?.cancelAnimRequest()
        audioEl.value.currentTime = 0;
        trackIndex.value++;
        currentTrack.value = currTrack.value;
        playNext();
    } else if (audioEl.value) {
        spectrum.value?.cancelAnimRequest()
        isPlaying.value = false;
        trackIndex.value = 0;
        audioEl.value?.pause();
        audioEl.value.currentTime = 0;
        currentTrack.value = currTrack.value;
    }
}

// GSAP, yoyo text left to right if title wider than display
watch(
    [isPlaying, trackIndex],
    () => {
        const { width } = panelTrack.value?.getBoundingClientRect() || {};
        const trackAnim = gsap.timeline();
        if (isPlaying.value && (width && width > TRACK_WIDTH)) {
            const remWidth = width - TRACK_WIDTH;
            trackAnim.fromTo(".panel__box__track", { x: 0 }, {
                duration: width / 100, x: -remWidth, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
        } else {
            trackAnim.to(".panel__box__track", { x: 0, duration: 1, ease: "sine.inOut", overwrite: 'auto' })
        }
    }, { flush: 'post' }
)

onMounted(() => {
    currentTrack.value = currTrack.value;
    let mousedown = false;

    if (audioEl.value && volume.value) {
        progressBar.value?.addEventListener("click", doScrub)
        progressBar.value?.addEventListener("mousemove", (e) => mousedown && doScrub(e))
        progressBar.value?.addEventListener("mousedown", () => (mousedown = true))
        progressBar.value?.addEventListener("mouseup", () => (mousedown = false))
        volume.value.addEventListener("change", () => {
            // grr at 0 it was not zero gainNode.gain.value = Number(volume.value?.value);
            audioEl.value!.volume = Number(volume.value?.value);
        })
        volume.value.addEventListener("touchmove", () => {
            audioEl.value!.volume = Number(volume.value?.value);
        })
    }
});
</script>

<template>
    <div class="player-wrapper">
        <audio :src="`${PATH}/${currentTrack}`" type="audio/mp3" preload="metadata" v-on:timeupdate="timeUpdate"
            v-on:durationchange="durationUpdate" v-on:ended="onTrackEnded" ref="audio-element" crossorigin="anonymous">
        </audio>
        <div class="panel">
            <div class="panel__box">
                <div :class="{ 'panel__box__track--paused': !isPlaying }" class="panel__box__track" ref="panel-track">{{
                    currentTrack }}</div>
            </div>
        </div>
        <div class="time">
            <div class="time__current" ref="track-time">
                {{ trackTime }}
            </div>
            <div class="time__duration" ref="track-duration">
                {{ trackDuration }}
            </div>
        </div>
        <div class="progress">
            <div class="progress__bar" ref="progress-bar">
                <div class="progress__bar__filled" ref="progress-bar-filled"></div>
            </div>
        </div>
        <div class="volume">
            <input type="range" id="volume" min="0" max="1" value=".1" step="0.1" class="volume__range" ref="volume" />
        </div>
        <div class="controls">
            <div class="controls__pause-txt" :class="{ 'controls__pause-txt--show': !isPlaying }">PAUSE</div>
            <PlayIcon @click="togglePlay" class="controls__play" :class="{ 'controls__play--show': !isPlaying }" />
            <PauseIcon @click="togglePlay" class="controls__pause" :class="{ 'controls__pause--show': isPlaying }" />
        </div>
        <MinimlSpectrumVisualizer :analyser="analyser" ref="spectrum" />
    </div>
</template>

<style lang="scss" scoped>
/** 
 * Please note that I use a variable Typekit font, update SCSS files as you need *
 */
.player-wrapper {
    position: relative;
    width: 280px;
    height: 80px;
    -webkit-overflow-scrolling: none;
    overflow: hidden;
    overscroll-behavior: none;
}

.player-wrapper * {
    font-family: $sans-ui;
    font-variation-settings: $sans-ui-variation-reg;
    font-size: 12px;
}

.panel {
    display: flex;
    justify-content: center;
    color: $clr-secondary;
    height: 100%;
    background-color: $clr-tertiary;
    border-radius: 25px;
    user-select: none;

    &__box {
        position: relative;
        top: 8px;
        height: 25px;
        width: 165px;
        border-radius: 4px;
        padding: 0 5px 0 5px;
        overflow: hidden;
        background-color: $clr-senary;

        &__track {
            position: relative;
            top: 7px;
            white-space: nowrap;
            text-align: center;
            width: fit-content;
            margin: auto;
        }

        &__track--paused {
            color: $clr-quinary;
        }
    }
}

.time {
    position: absolute;
    top: 0;
    height: inherit;
    width: inherit;
    color: $clr-quinary;

    &__current {
        position: absolute;
        left: 22px;
        top: 64px;
        text-align: right;
    }

    &__duration {
        position: absolute;
        right: 22px;
        top: 64px;
        text-align: left;
    }
}

.progress {
    position: absolute;
    top: 0px;
    left: 52px;
    width: 176px;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    &__bar {
        display: flex;
        position: relative;
        top: 29px;
        height: 4px;
        width: 200px;
        background: #dddddd;
        border-radius: 25px;
        margin: 0 5px;
        /* flex: 10; */
        flex-basis: 100%;
        overflow: hidden;
        z-index: 100;

        &__filled {
            height: 4px;
            background: $clr-quarternary;
            flex: 0;
            flex-basis: 0%;
            border-radius: 25px;
        }
    }
}

.volume {

    position: absolute;
    right: 16px;
    top: 6px;
    z-index: 200;

    &__range {
        appearance: none;
        width: 4px;
        height: 50px;
        border-radius: 9999px;
        background: #dddddd;
        writing-mode: vertical-rl;
        direction: rtl;
        cursor: pointer;
    }

    /* Thumb: for Chrome, Safari, Edge */
    &__range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 9999px;
        background: $clr-quinary;
        box-shadow: none;
    }

    /* Thumb: for Firefox */
    &__range::-moz-range-thumb {
        border: none;
        width: 12px;
        height: 12px;
        border-radius: 9999px;
        background: $clr-quinary;
        box-shadow: none;
    }
}

.controls {
    position: absolute;
    top: 0;
    height: inherit;
    width: inherit;
    text-align: center;

    &__play,
    &__pause {
        position: absolute;
        display: none;
        width: 34px;
        height: auto;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: $clr-quinary;
        cursor: pointer;
        filter: brightness(1);
        transition: brightness 0.5s ease-in-out;

        &--show {
            display: block;
            filter: brightness(1);
        }
    }

    &__pause-txt {
        position: relative;
        top: 45px;
        opacity: 0;
        color: $clr-quinary;
        transition: opacity 0.3s ease-in;
        user-select: none;

        &--show {
            opacity: 1;
        }
    }

    &__play:hover,
    &__play:focus,
    &__pause:hover,
    &__pause:active {
        filter: brightness(2);
    }
}
</style>
