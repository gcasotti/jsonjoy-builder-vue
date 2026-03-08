<script setup lang="ts">
import PButton from "primevue/button";
import { cn } from "../../lib/utils.ts";

defineProps<{
  class?: string;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <PButton
    type="button"
    :class="cn('text-xs px-2 py-1 min-w-[80px] whitespace-nowrap', $props.class)"
    size="small"
    text
    @click="emit('click', $event)"
  >
    <slot />
  </PButton>
</template>
