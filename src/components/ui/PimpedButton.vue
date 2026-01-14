<template>
  <button
    class="cursor-pointer group relative px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
    ></div>
    <span class="relative flex items-center gap-2">
      <!-- Element Plus Icon -->
      <el-icon 
        v-if="icon" 
        class="group-hover:rotate-90 transition-transform duration-300"
      >
        <component :is="icon" />
      </el-icon>
      <!-- Default SVG Plus icon -->
      <svg 
        v-else
        class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="group-hover:tracking-wider transition-all duration-300">
        {{ label }}
      </span>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { type Component } from 'vue';

defineProps<{
  label?: string;
  icon?: Component;
}>();
</script>

<style scoped>
.bg-size-200 {
  background-size: 200%;
}

.bg-pos-0 {
  background-position: 0%;
}

.hover\:bg-pos-100:hover {
  background-position: 100%;
}
</style>