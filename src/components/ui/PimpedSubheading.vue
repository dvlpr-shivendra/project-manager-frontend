<template>
  <h2 class="font-['Syne'] font-bold text-lg text-gray-900 dark:text-white tracking-tight mb-4" :class="noMargin ? '!mb-0' : ''">
    <component v-if="icon" :is="icon" class="inline-block w-4 h-4 mr-2 text-indigo-500 align-middle" />
    <slot />
    <span v-if="badge" class="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[11px] font-semibold">{{ badge }}</span>
  </h2>
</template>
<script lang="ts" setup>
import { type Component } from 'vue';
defineProps<{ icon?: Component; badge?: string; animated?: boolean; theme?: string; size?: string; noMargin?: boolean }>();
</script>
