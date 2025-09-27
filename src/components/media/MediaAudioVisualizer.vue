<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from "vue"
import { useEventListener } from "@vueuse/core"
// @ts-expect-error - p5 types issue with package.json exports
import p5 from "p5"
import type { Ref } from "vue"

// Inject audio element from parent
const audioEl = inject<Ref<HTMLAudioElement | null>>("audioElement")

const canvasContainer = ref<HTMLDivElement>()
const analyser = ref<AnalyserNode>()

let p5Instance: p5 | null = null
let audioCtx: AudioContext
let dataArray: Uint8Array
let bufferLength: number
let isPlaying = false

/**
 * Create Web Audio API analyser for frequency data
 */
const createAnalyserData = () => {
  if (!audioEl?.value) return

  audioCtx = new AudioContext()
  const audioSrc = audioCtx.createMediaElementSource(audioEl.value)

  analyser.value = audioCtx.createAnalyser()
  audioSrc.connect(analyser.value)
  analyser.value.connect(audioCtx.destination)
  analyser.value.fftSize = 256 // Higher resolution for smoother wave

  bufferLength = analyser.value.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)

  if (audioCtx.state === "suspended") {
    audioCtx.resume()
  }
}

/**
 * p5.js sketch for sinus wave visualization
 */
const sketch = (p: p5) => {
  let waveOffset = 0

  p.setup = () => {
    // Create canvas with exact Winamp dimensions
    p.createCanvas(164, 30)
    p.clear() // Transparent background
  }

  p.draw = () => {
    // Clear with transparent background
    p.clear() // Fully transparent background

    if (isPlaying && analyser.value) {
      // Get frequency data
      analyser.value.getByteFrequencyData(dataArray)

      // Calculate average amplitude for wave intensity
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const avgAmplitude = sum / bufferLength / 255 // Normalize to 0-1

      // Draw main sinus wave
      p.stroke(132, 166, 165)
      p.strokeWeight(1.5)
      p.noFill()

      p.beginShape()
      for (let x = 0; x < p.width; x += 2) {
        // Create sinus wave with audio-reactive amplitude
        const baseWave = p.sin(x * 0.02 + waveOffset) * (5 + avgAmplitude * 10)

        // Add frequency-based modulation
        const freqIndex = Math.floor((x / p.width) * bufferLength)
        const freqModulation = ((dataArray[freqIndex] || 0) / 255) * 3

        const y = p.height / 2 + baseWave + freqModulation
        p.vertex(x, y)
      }
      p.endShape()

      // Draw secondary wave with different phase
      p.stroke(77, 88, 95, 150)
      p.strokeWeight(1)

      p.beginShape()
      for (let x = 0; x < p.width; x += 3) {
        const baseWave =
          p.sin(x * 0.015 + waveOffset + p.PI / 3) * (3 + avgAmplitude * 6)
        const freqIndex = Math.floor((x / p.width) * bufferLength)
        const freqModulation = ((dataArray[freqIndex] || 0) / 255) * 2

        const y = p.height / 2 + baseWave - freqModulation
        p.vertex(x, y)
      }
      p.endShape()

      // Increment wave offset for animation
      waveOffset += 0.05 + avgAmplitude * 0.1
    } else {
      // Static wave when not playing
      p.stroke(77, 88, 95, 100)
      p.strokeWeight(1)
      p.noFill()

      p.beginShape()
      for (let x = 0; x < p.width; x += 2) {
        const y = p.height / 2 + p.sin(x * 0.02 + waveOffset * 0.2) * 2
        p.vertex(x, y)
      }
      p.endShape()

      waveOffset += 0.01
    }
  }
}

const startVisualization = () => {
  isPlaying = true
}

const stopVisualization = () => {
  isPlaying = false
}

onMounted(() => {
  if (canvasContainer.value) {
    // Create p5 instance
    p5Instance = new p5(sketch, canvasContainer.value)
  }

  if (audioEl?.value) {
    audioEl.value.addEventListener("playing", startVisualization)
    audioEl.value.addEventListener("pause", stopVisualization)
    audioEl.value.addEventListener("ended", stopVisualization)
  }

  // One time event to create AudioContext
  const cleanup = useEventListener(document, "mousedown", () => {
    cleanup()
    createAnalyserData()
  })
})

onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove()
  }

  if (audioEl?.value) {
    audioEl.value.removeEventListener("playing", startVisualization)
    audioEl.value.removeEventListener("pause", stopVisualization)
    audioEl.value.removeEventListener("ended", stopVisualization)
  }
})
</script>

<template>
  <div class="canvas-wrapper" ref="canvasContainer">
    <!-- p5.js will create the canvas here -->
  </div>
</template>

<style scoped lang="scss">
.canvas-wrapper {
  display: flex;
  justify-content: center;
  user-select: none;
  position: absolute;
  top: 29px;
  width: 164px;
  height: 30px;
  left: 50%;
  transform: translateX(-50%);
  margin-left: 1px; /* Fine-tune horizontal position */
}

// Target the p5.js canvas
.canvas-wrapper :deep(canvas) {
  user-select: none;
}
</style>
