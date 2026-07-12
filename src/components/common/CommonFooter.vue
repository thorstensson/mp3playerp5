<script setup lang="ts">
import GitHubIcon from "@/components/common/GitHubIcon.vue"

interface Props {
  info: string
  link: string
  linkLabel: string
}

const props = withDefaults(defineProps<Props>(), {
  info: "Thomas Thorstensson",
  link: "https://mp3playerp5.thomasthorstensson.com/",
  linkLabel: "GitHub",
})
</script>

<template>
  <div class="footer">
    <div>
      {{ props.info }} &nbsp;
      <a :href="props.link" target="_blank" rel="noopener noreferrer">{{
        props.linkLabel
      }}</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  padding: 0 32px;
  flex-shrink: 0;
  font-family: $sans-ui;
  font-weight: 400;
  font-variation-settings: "wght" 400;
  font-size: clamp-calc(480px, 1920px, 12px, 14px);
  color: $secondary;
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}

.github-icon {
  margin-top: 4px;
}
</style>
