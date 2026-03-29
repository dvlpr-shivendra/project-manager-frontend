<template>
  <div
    class="flex flex-col"
    :class="message.role === 'user' ? 'items-end' : 'items-start'"
  >
    <div
      class="max-w-[85%] break-words rounded-[14px] px-3.5 py-[9px] text-[13.5px] leading-[1.55] whitespace-pre-wrap"
      :class="
        message.role === 'user'
          ? 'bg-[var(--el-color-primary)] text-white rounded-br-[4px]'
          : 'bg-[var(--el-fill-color-light)] text-[var(--el-text-color-primary)] rounded-bl-[4px] flex items-start gap-[7px]'
      "
    >
      <span
        v-if="message.role === 'assistant'"
        class="mt-0.5 shrink-0 text-[12px] text-[var(--el-color-primary)]"
      >
        ✦
      </span>
      {{ message.text }}
    </div>

    <!-- Confirmation Card Slot (if needed) -->
    <slot name="confirmation" />
  </div>
</template>

<script setup lang="ts">
import type { Message } from "./types";

defineProps<{
  message: Message;
}>();
</script>
