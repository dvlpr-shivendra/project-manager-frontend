<template>
  <button @click="toggle" :title="dark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
    <Transition name="icon-swap" mode="out-in">
      <svg v-if="dark" key="moon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else key="sun" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { localStorageRef } from '@/composables/localStorageRef';
const dark = localStorageRef<boolean>('darkMode', false);
function apply() { document.documentElement.classList.toggle('dark', dark.value); }
function toggle() { dark.value = !dark.value; }
watch(dark, apply, { immediate: true });
</script>

<style scoped>
.icon-swap-enter-active, .icon-swap-leave-active { transition: opacity 0.15s, transform 0.15s; }
.icon-swap-enter-from { opacity: 0; transform: rotate(-30deg) scale(0.7); }
.icon-swap-leave-to   { opacity: 0; transform: rotate(30deg) scale(0.7); }
</style>
