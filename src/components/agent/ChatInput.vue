<template>
  <div class="border-t border-[var(--el-border-color-lighter)] p-3">
    <div class="flex items-end gap-2">
      <el-input
        :model-value="modelValue"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 6 }"
        placeholder="e.g. Create a task to review the API docs..."
        :disabled="loading"
        resize="none"
        class="flex-1 chat-textarea"
        @update:model-value="$emit('update:modelValue', $event)"
        @keydown.enter.exact.prevent="$emit('send')"
      />
      <el-button
        type="primary"
        circle
        class="shrink-0 mb-[1px]"
        :disabled="loading || !modelValue.trim()"
        @click="$emit('send')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          class="translate-x-[0.5px]"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  loading: boolean;
}>();

defineEmits(["update:modelValue", "send"]);
</script>

<style scoped>
.chat-textarea :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 8px 12px;
  line-height: 1.5;
  transition: all 0.2s;
  background-color: var(--el-fill-color-lighter);
  border-color: transparent;
}
.chat-textarea :deep(.el-textarea__inner:focus) {
  background-color: var(--el-bg-color);
  border-color: var(--el-color-primary-light-3);
  box-shadow: 0 0 0 1px var(--el-color-primary-light-3);
}
</style>
