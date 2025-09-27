<script setup lang="ts">
import CommonFooterLayout from "@/components/common/CommonFooterLayout.vue"
</script>

<template>
  <div class="footer-wrapper">
    <CommonFooterLayout>
      <template #info> Vue3 + S3 + Web Audio API + P5.js </template>
      <template #link
        ><a href="https://github.com/thorstensson/mp3player" target="_blank"
          >GitHub repo</a
        ></template
      >
    </CommonFooterLayout>
  </div>
</template>

<style lang="scss" scoped>
a {
  text-decoration: underline;
}
.footer-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 32px;
  flex-shrink: 0; /* Prevent footer from shrinking */

  // Ensure footer is always visible on mobile
  @media (max-width: 768px) {
    position: relative;
    z-index: 100;
    background-color: $primary;
  }
}
</style>
