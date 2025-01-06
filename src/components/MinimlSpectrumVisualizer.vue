<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue';
import { useEventListener } from "@vueuse/core";
import { useStoreRef } from '@/composable/useStoreRef';

const canvas = useTemplateRef<HTMLCanvasElement>("canvas")
const analyser = ref<AnalyserNode>();

let ctx: CanvasRenderingContext2D;
let myReq: number;
let barWidth: number;
let audioCtx: AudioContext;
let dataArray: Uint8Array;
let bufferLength: number;

// Use our Composable to get the audio element from the Record
const { getElem } = useStoreRef();
const { sRef: audioEl } = getElem('audioEl')

/**
 * Use web audio API to get the total number of data points 
 * available to the AudioContext sampleRate.
 * I could not make this method a composable, can't see how when on mouse down is needed first (async, await?)
 */
const createAnalyserData = () => {
    audioCtx = new AudioContext();
    const audioSrc = audioCtx.createMediaElementSource(audioEl.value as HTMLMediaElement);

    analyser.value = audioCtx.createAnalyser();
    audioSrc.connect(analyser.value);
    analyser.value.connect(audioCtx.destination);
    analyser.value.fftSize = 128;

    bufferLength = analyser.value.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    barWidth = (canvas.value!.width / bufferLength);
}

/**
 * Animate bars based on Uint8 Array
 */
const startAnimRequest = () => {
    function doBars() {
        let x = 0;
        if (canvas.value && ctx) {
            ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
            analyser.value?.getByteFrequencyData(dataArray);
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
                ctx.fillStyle = "#000102";
                ctx.fillRect(x, canvas.value.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
        myReq = requestAnimationFrame(doBars);
    }
    myReq = requestAnimationFrame(doBars);
}

const cancelAnimRequest = () => {
    setTimeout(() => {
        cancelAnimationFrame(myReq);
    }, 800);
}

onMounted(() => {
    if (canvas.value) ctx = canvas.value.getContext("2d")!

    audioEl.value?.addEventListener('playing', startAnimRequest);
    audioEl.value?.addEventListener('paused', cancelAnimRequest);

    // One time event to create onetime AudioContext
    const cleanup = useEventListener(document, 'mousedown', () => {
        cleanup();
        createAnalyserData();
    })
})

</script>

<template>
    <div class="canvas-wrapper">
        <canvas id="canvas" ref="canvas"></canvas>
    </div>
</template>

<style scoped lang="scss">
.canvas-wrapper {
    display: flex;
    justify-content: center;
    user-select: none;
}

#canvas {
    top: 38px;
    position: absolute;
    width: 160px;
    height: 25px;
    user-select: none;
}
</style>