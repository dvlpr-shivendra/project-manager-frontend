<template>
  <button
    class="flex h-[52px] w-[52px] items-center justify-center rounded-full border-none bg-[var(--el-color-primary)] text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_24px_rgba(0,0,0,0.22)] ml-auto cursor-pointer"
    :class="{ 'opacity-90': isOpen }"
    @click="$emit('toggle')"
  >
    <svg
      v-if="!isOpen"
      class="h-[22px] w-[22px]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
    <svg
      v-else
      class="h-[22px] w-[22px]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits(["toggle"]);
</script>
