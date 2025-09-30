<script setup lang="ts">
import { ref, onMounted } from "vue"
import { gsap } from "gsap"
import CommonFooter from "@/components/common/CommonFooter.vue"
import MediaAudioPlayer from "@/components/media/MediaAudioPlayer.vue"
import { HeadphonesIcon } from "@sidekickicons/vue/24/solid"

const showIntro = ref(true)

onMounted(() => {
  const tl = gsap.timeline()

  // Start with intro text visible, player hidden
  gsap.set(".player-container", { opacity: 0 })

  tl
    // Animate intro text in
    .from(".intro-icon", {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: "power2.out",
    })
    // Hold for a moment
    .to({}, { duration: 1.5 })
    // Fade out intro text
    .to(".intro-icon", {
      duration: 0.8,
      opacity: 0,
      y: -30,
      ease: "power2.in",
    })
    // Hide intro text and show player
    .call(() => {
      showIntro.value = false
    })
    .to(".player-container", {
      duration: 1.2,
      opacity: 1,
      ease: "power2.out",
    })
})
</script>

<template>
  <div class="page-container">
    <div class="lab-wrapper">
      <div v-if="showIntro" class="intro-icon"><HeadphonesIcon /></div>

      <div class="player-container">
        <MediaAudioPlayer />
      </div>
    </div>
    <CommonFooter />
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Using dynamic viewport height for better mobile support */
  min-height: 100dvh;
}

.lab-wrapper {
  display: flex;
  flex: 1;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 50px);
  min-height: calc(100dvh - 50px);
}

.intro-icon {
  width: 100px;
  height: 100px;
  color: $accent1;
  user-select: none;
}
</style>
