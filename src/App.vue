<script setup lang="ts">
import MinimlAudioPlayer from '@/components/MinimlAudioPlayer.vue'
import WhatAbout from '@/components/WhatAbout.vue';
import NoiseBackgroundFx from './components/NoiseBackgroundFx.vue';
</script>

<template>
  <div class="app-wrapper">
    <MinimlAudioPlayer />
    <WhatAbout>
      <template #title>Audio.</template>
    </WhatAbout>
  </div>
</template>

<style lang="scss">
html,
body {
  background-color: $primary;
  margin: 0;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  -o-font-smoothing: antialiased;
  -webkit-overflow-scrolling: none;
  overflow: hidden;
  overscroll-behavior: none;
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
