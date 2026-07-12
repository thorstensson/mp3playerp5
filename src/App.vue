<script setup lang="ts">
import ViewDemoPage from "@/components/view/ViewDemoPage.vue"
import InstallButton from "@/components/common/InstallButton.vue"
</script>

<template>
  <InstallButton />
  <ViewDemoPage />
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
  overscroll-behavior: none;
}

body {
  font-family: "Inter Variable", sans-serif;
  min-height: 100vh;
}
</style>
