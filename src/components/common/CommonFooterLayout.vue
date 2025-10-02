<script setup lang="ts">
import { useSlots } from "vue"

const slots = useSlots()
</script>

<template>
  <div v-if="slots.info" class="info">
    <slot name="info"></slot>
    <slot name="link"></slot>
  </div>
</template>

<style scoped lang="scss">
.info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-family: $sans-ui;
  font-weight: $sans-ui-wgt;
  font-size: clamp-calc(480px, 1920px, 12px, 14px);
  color: $accent1;
  user-select: none;
}
</style>
