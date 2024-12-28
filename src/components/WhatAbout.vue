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
    font-family: $sans-head;
    font-size: 20px;
    color:$clr-quarternary;
    margin-top:20px;
}

.text,
.link {
    font-family: $sans-text;
    font-variation-settings: $sans-text-variation-reg;
    font-size: 12px;
    color:$clr-secondary;
}
.link{
    text-decoration:underline;
}
</style>