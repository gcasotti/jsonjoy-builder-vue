<script setup lang="ts">
import PSelect from "primevue/select";
import { useOverlayContainer } from "../../hooks/use-overlay-container.ts";

const { overlayContainer } = useOverlayContainer();

const model = defineModel<string>();

defineProps<{
  options: { label: string; value: string }[];
  placeholder?: string;
  id?: string;
  class?: string;
}>();
</script>

<template>
  <PSelect
    v-model="model"
    :options="options"
    optionLabel="label"
    optionValue="value"
    :placeholder="placeholder"
    :id="id"
    :class="$props.class"
    :appendTo="overlayContainer"
    fluid
  />
</template>
