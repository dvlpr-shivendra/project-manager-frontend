<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none w-fit group">
    <input type="checkbox" :checked="modelValue" @change="handleChange" class="sr-only" />
    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
      :class="modelValue
        ? (theme === 'green' ? 'border-emerald-500 bg-emerald-500' : 'border-indigo-500 bg-indigo-500')
        : (theme === 'green' ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-emerald-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-indigo-400')">
      <svg class="w-3 h-3 text-white transition-all duration-200" :class="modelValue ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
    <span v-if="label" class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
    <slot />
  </label>
</template>
<script lang="ts" setup>
const props = defineProps<{ modelValue?: boolean; label?: string; theme?: 'purple'|'green' }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
function handleChange(e: Event) { emit('update:modelValue', (e.target as HTMLInputElement).checked); }
</script>
