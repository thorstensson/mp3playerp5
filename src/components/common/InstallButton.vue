<script setup lang="ts">
import { ref, onMounted } from "vue"

const deferredPrompt = ref<any>(null)
const showInstallButton = ref(false)

onMounted(() => {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallButton.value = true
  })

  window.addEventListener("appinstalled", () => {
    showInstallButton.value = false
    deferredPrompt.value = null
  })
})

const install = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === "accepted") {
    showInstallButton.value = false
  }
  deferredPrompt.value = null
}
</script>

<template>
  <button
    v-if="showInstallButton"
    class="install-button"
    @click="install"
    title="Install for offline playback"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="install-icon"
    >
      <path
        d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"
      />
      <path
        d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"
      />
    </svg>
    Install
  </button>
</template>

<style lang="scss" scoped>
.install-button {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  color: $secondary;
  font-family: $sans-text;
  font-size: 13px;
  font-weight: 500;
  transition: all 300ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: $accent2;
  }
}

.install-icon {
  width: 16px;
  height: 16px;
}
</style>
