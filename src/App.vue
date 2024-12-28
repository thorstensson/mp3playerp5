<script setup lang="ts">
import MinimlAudioPlayer from '@/components/MinimlAudioPlayer.vue'
import WhatAbout from '@/components/WhatAbout.vue';
import NoiseBackgroundFx from './components/NoiseBackgroundFx.vue';
</script>

<template>
  <div class="app-wrapper">
    <MinimlAudioPlayer />
    <WhatAbout>
      <template #title>Miniml Vue Audio Player</template>
      <template #text>Vue 3.5 / TypeScript / Web Audio API / Santa</template>
      <template #link><a target='_blank' href='https://github.com/thorstensson'>GitHub</a><br></template>
    </WhatAbout>
    <NoiseBackgroundFx />
  </div>
</template>

<style lang="scss">
html,
body {
  background-color: $clr-primary;
  margin: 0;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -o-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
