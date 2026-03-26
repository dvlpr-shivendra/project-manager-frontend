<template>
  <h3 class="flex items-center gap-2 font-['Syne'] font-semibold text-[14px] text-gray-900 dark:text-white mb-3" :class="noMargin ? '!mb-0' : ''">
    <span v-if="showDot" class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
    <component v-if="icon" :is="icon" class="w-4 h-4 text-indigo-500 shrink-0" />
    <slot />
    <span v-if="count !== undefined" class="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">{{ count }}</span>
    <span v-if="badge" class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-semibold">{{ badge }}</span>
  </h3>
</template>
<script lang="ts" setup>
import { type Component } from 'vue';
defineProps<{ icon?: Component; badge?: string; count?: number; showDot?: boolean; theme?: string; size?: 'sm'|'md'|'lg'; noMargin?: boolean }>();
</script>
