<template>
  <div class="border-t border-[var(--el-border-color-lighter)] p-3">
    <el-input
      :model-value="modelValue"
      placeholder="e.g. Create a task to review the API docs..."
      :disabled="loading"
      size="large"
      @update:model-value="$emit('update:modelValue', $event)"
      @keydown.enter.prevent="$emit('send')"
    >
      <template #append>
        <el-button
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
            stroke-width="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  loading: boolean;
}>();

defineEmits(["update:modelValue", "send"]);
</script>
