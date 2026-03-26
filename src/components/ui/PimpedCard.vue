<template>
  <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200"
    :class="interactive ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''">
    <div v-if="$slots.title" class="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 font-['Syne'] font-bold text-[14px] text-gray-900 dark:text-white">
      <slot name="title" />
    </div>
    <div class="p-5"><slot /></div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'Card' });
defineProps<{ interactive?: boolean; showHoverOverlay?: boolean }>();
</script>
