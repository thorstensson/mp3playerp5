<script setup lang="ts">
import { useSlots } from 'vue';
const slots = useSlots();
</script>

<template>
  <div v-if="slots.title" class="title">
    <slot name="title"></slot>
  </div>
  <div v-if="slots.text" class="text">
    <slot name="text"></slot>
  </div>
  <div v-if="slots.link" class="link">
    <slot name="link"></slot>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-family: $sans-text;
  font-optical-sizing: $sans-text-optic;
  color: $clr-secondary;
  font-size: 20px;
  margin-top: 20px;
  user-select: none;
}

.text,
.link {
  font-family: $sans-text;
  font-optical-sizing: $sans-text-optic;
  color: $clr-secondary;
  font-size: 12px;
}

.link {
  text-decoration: underline;
}
</style>
