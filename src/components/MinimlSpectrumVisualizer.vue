<script setup lang="ts">
import { watch, useTemplateRef, onMounted } from 'vue';

const canvas = useTemplateRef<HTMLCanvasElement>("canvas")
let ctx: CanvasRenderingContext2D;

let myReq: number;
let dataArray: Uint8Array;
let barWidth: number;
let bufferLength: number;

const { analyser } = defineProps<{ analyser: AnalyserNode }>()

/**
 * MDN: FFT represents the window size in samples that is used when performing
 * a Fast Fourier Transform (FFT) to get frequency domain data.
 */
const createAnalyserData = () => {
    /* eslint-disable */
    analyser.fftSize = 128;
    /* eslint-enable */
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
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
            analyser.getByteFrequencyData(dataArray);
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

//Watch for analyser to be defined (we have to wait for user to interact with page)
watch(() => analyser, () => {
    if (analyser.fftSize) createAnalyserData();
})

onMounted(() => {
    if (canvas.value) ctx = canvas.value.getContext("2d")!;
})

defineExpose({
    startAnimRequest,
    cancelAnimRequest
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