<template>
  <div class="py-6 text-center text-[13px] text-[var(--el-text-color-secondary)]">
    <p>Ask me to manage your tasks.</p>
    <div class="mt-3 flex flex-wrap justify-center gap-1.5">
      <button
        v-for="s in suggestions"
        :key="s"
        class="cursor-pointer rounded-[20px] border border-[var(--el-border-color-light)] bg-[var(--el-fill-color-light)] px-3 py-1 text-[12px] text-[var(--el-text-color-regular)] transition-colors duration-150 hover:bg-[var(--el-fill-color)]"
        @click="$emit('select', s)"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const suggestions = [
  "Create a task to review the API docs",
  "Show my open tasks",
  "Mark task 12 as complete",
];

defineEmits(["select"]);
</script>
