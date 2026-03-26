<template>
  <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:scale-[0.98] text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-150 cursor-pointer select-none" v-bind="$attrs">
    <el-icon v-if="icon" class="text-[14px]"><component :is="icon" /></el-icon>
    <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" class="shrink-0 transition-transform duration-200 group-hover:rotate-90">
      <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span v-if="label">{{ label }}</span>
  </button>
</template>
<script lang="ts" setup>
import { type Component } from 'vue';
defineProps<{ label?: string; icon?: Component }>();
</script>
