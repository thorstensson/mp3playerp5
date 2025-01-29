<script setup lang="ts">
import { ref, useTemplateRef, reactive, watch, onMounted, computed } from 'vue'
import { useEventListener, type MaybeRef } from '@vueuse/core'
import { gsap } from 'gsap'
import { PlayIcon, PauseIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'

import MinimlSpectrumVisualizer from './MinimlSpectrumVisualizer.vue'
import { useStoreRef } from '@/composable/useStoreRef'

const spectrum = useTemplateRef('spectrum')
const audioEl = useTemplateRef('audio-element')
const progressBar = useTemplateRef('progress-bar')
const progressBarFilled = useTemplateRef('progress-bar-filled')
const panelTrack = useTemplateRef('panel-track')

const trackTime = ref<string>("00:00")
const trackDuration = ref<string>("00.00")
const trackIndex = ref<number>(0)
const currentTrack = ref<string>("")
const isPlaying = ref<boolean>(false)

// Add mp3 path here, note if you are testing on Vite with localhost metadata events wont fire (next , previous)
const PATH = import.meta.env.VITE_MP3_URL

// The panel width, if track text wider then GSAP yoyo
const TRACK_WIDTH = 160

//Add tracks here; no plans to make a DOM playlist
const playlist = reactive([
  { artist: "Ernes Guevara", track: "Ernes Guevara - Lost (Original Mix).mp3" },
  { artist: "Stockholm Syndrome, Young Squage", track: "EMPHI - Stockholm Syndrome (Original Mix).mp3" },
  { artist: "EMPHI", track: "EMPHI - Pair of Dice (Original Mix).mp3" }
])

// Check for remaining tracks
const ifTrackNext = computed(() => {
  return trackIndex.value < playlist.length - 1
})

const ifTrackPrev = computed(() => {
  return trackIndex.value > 0
})

// Check for current track
const currTrack = computed(() => {
  return playlist[trackIndex.value].track
})

const doScrub = (e: MouseEvent) => {
  if (progressBar.value && audioEl.value) {
    const scrubTime = (e.offsetX / progressBar.value!.offsetWidth) * audioEl.value.duration
    audioEl.value.currentTime = scrubTime
  }
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value && audioEl.value) {
    playTrack()
  } else if (audioEl.value) {
    audioEl.value.pause()
  }
}

// For previous and next we need to know if track is playing when we press them
const nextTrack = () => {
  if (ifTrackNext.value && !isPlaying.value) {
    trackIndex.value++
    currentTrack.value = currTrack.value
  } else if (ifTrackNext.value) {
    isPlaying.value = true
    trackIndex.value++
    playTrack()
  }
}

const prevTrack = () => {
  if (ifTrackPrev.value && !isPlaying.value) {
    trackIndex.value--
    currentTrack.value = currTrack.value
  } else if (ifTrackPrev.value) {
    isPlaying.value = true
    trackIndex.value--
    playTrack()
  }
}

const playTrack = () => {
  const cancelcan = useEventListener(audioEl.value as unknown as MaybeRef, 'loadedmetadata', () => {
    audioEl.value?.play()
    cancelcan()
  })
  // Synchronous, so we do this after adding event
  isPlaying.value = true
  audioEl.value!.currentTime = 0
  currentTrack.value = currTrack.value
  audioEl.value?.load()
}

// E from v-on listener
const timeUpdate = () => {
  progressUpdate()
  setTimes()
}

const progressUpdate = () => {
  const percent = (audioEl.value!.currentTime / audioEl.value!.duration) * 100
  progressBarFilled.value!.style.flexBasis = `${percent}%`
}

const setTimes = () => {
  const m = ('0' + Math.floor(audioEl.value!.currentTime / 60 % 60)).slice(-2)
  const s = ('0' + Math.floor(audioEl.value!.currentTime % 60)).slice(-2)
  trackTime.value = `${m}:${s}`
}

// E from v-on listener
const durationUpdate = () => {
  const m = ('0' + Math.floor(audioEl.value!.duration / 60 % 60)).slice(-2)
  const s = ('0' + Math.floor(audioEl.value!.duration % 60)).slice(-2)
  trackDuration.value = `${m}:${s}`
}

const onTrackEnded = () => {
  progressBarFilled.value!.style.flexBasis = "0%"
  if (ifTrackNext.value && spectrum.value) {
    trackIndex.value++
    playTrack()
  } else if (audioEl.value && spectrum.value) {
    isPlaying.value = false
    trackIndex.value = 0
    audioEl.value.pause()
    audioEl.value.currentTime = 0
    currentTrack.value = currTrack.value
  }
}

// GSAP, yoyo text left to right if title wider than display
watch(
  [isPlaying, trackIndex],
  () => {
    const { width } = panelTrack.value?.getBoundingClientRect() || {}
    const trackAnim = gsap.timeline()
    if (isPlaying.value && (width && width > TRACK_WIDTH)) {
      const remWidth = width - TRACK_WIDTH + 10
      trackAnim.fromTo(".panel__box__track", { x: 0 }, {
        duration: width / 100, x: -remWidth, repeat: -1, yoyo: true, ease: "sine.inOut"
      })
    } else {
      trackAnim.to(".panel__box__track", { x: 0, duration: 1, ease: "sine.inOut", overwrite: 'auto' })
    }
  }, { flush: 'post' }
)

onMounted(() => {
  const { addElem } = useStoreRef()
  addElem('audioEl', audioEl)

  currentTrack.value = currTrack.value
  let mousedown = false

  if (audioEl.value && progressBar.value) {
    progressBar.value.addEventListener('click', doScrub)
    progressBar.value.addEventListener('mousemove', (e) => mousedown && doScrub(e))
    progressBar.value.addEventListener('mousedown', () => (mousedown = true))
    progressBar.value.addEventListener('mouseup', () => (mousedown = false))
  }
})
</script>

<template>
  <div class="player-wrapper">
    <audio :src="`${PATH}/${currentTrack}`" type="audio/mp3" preload="auto" v-on:timeupdate="timeUpdate"
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
    <div class="controls">
      <div class="controls__pause-txt" :class="{ 'controls__pause-txt--show': !isPlaying }">PAUSE</div>
      <PlayIcon @click="togglePlay" class="controls__play" :class="{ 'controls__play--show': !isPlaying }" />
      <PauseIcon @click="togglePlay" class="controls__pause" :class="{ 'controls__pause--show': isPlaying }" />
      <ChevronLeftIcon @click="prevTrack" class="controls__prev" :class="{ 'controls__prev--end': !ifTrackPrev }">
      </ChevronLeftIcon>
      <ChevronRightIcon @click="nextTrack" class="controls__next" :class="{ 'controls__next--end': !ifTrackNext }">
      </ChevronRightIcon>
    </div>
    <div v-if="audioEl">
      <MinimlSpectrumVisualizer ref="spectrum" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/**
 * Please note that I use a variable Typekit font, update SCSS files as you need *
 */

.currstate {
  color: white;
  /* margin-top: 100px; */
  position: fixed;
  width: 100px;
  top: 100px;
  left: 0px;
  z-index: 900;
  font-size: 20px;
}

body {
  -webkit-overflow-scrolling: none;
  overflow: hidden;
  overscroll-behavior: none;
}

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
  font-size: 12px;
  font-weight: 600;
}

.panel {
  display: flex;
  justify-content: center;
  color: $primary;
  height: 100%;
  background-color: $secondary;
  border-radius: 25px;

  &__box {
    position: relative;
    top: 8px;
    height: 25px;
    width: 165px;
    border-radius: 4px;
    padding: 0 5px 0 5px;
    overflow: hidden;
    background-color: $shade1;
    user-select: none;

    &__track {
      position: relative;
      top: 5px;
      white-space: nowrap;
      text-align: center;
      width: fit-content;
      margin: auto;
    }

    &__track--paused {
      color: $secondary;
    }
  }
}

.time {
  position: absolute;
  top: 0;
  height: inherit;
  width: inherit;
  color: $primary;
  user-select: none;

  &__current {
    position: absolute;
    left: 15px;
    top: 61px;
    text-align: right;
  }

  &__duration {
    position: absolute;
    right: 16px;
    top: 61px;
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

  &__bar {
    display: flex;
    position: relative;
    top: 30px;
    height: 4px;
    width: 200px;
    background: #dddddd;
    border-radius: 25px;
    margin: 0 5px;
    /* flex: 10; */
    flex-basis: 100%;
    overflow: hidden;
    z-index: 100;
    cursor: pointer;

    &__filled {
      height: 4px;
      background: $primary;
      flex: 0;
      flex-basis: 0%;
      border-radius: 25px;
    }
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
    color: $shade1;
    cursor: pointer;
    transition: color 0.3s ease-in-out;

    &--show {
      display: block;
    }
  }

  &__play:hover,
  &__play:focus,
  &__pause:hover,
  &__pause:active {
    color: $accent;
  }

  &__prev,
  &__next {
    position: absolute;
    width: 31px;
    height: auto;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    color: $shade1;
    cursor: pointer;
    opacity: 1;
    transition: color 0.3s ease-in-out;

    &--end {
      opacity: .5;
    }
  }

  &__next {
    right: 5px;
  }

  &__next:hover,
  &__next:focus,
  &__prev:hover,
  &__prev:active {
    color: $accent;
  }

  &__pause-txt {
    position: relative;
    top: 45px;
    opacity: 0;
    color: $primary;
    transition: opacity 0.3s ease-in;
    user-select: none;

    &--show {
      opacity: 1;
    }
  }

}
</style>
