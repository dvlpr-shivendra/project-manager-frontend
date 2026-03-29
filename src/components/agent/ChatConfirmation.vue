<template>
  <div
    class="mt-1.5 max-w-[85%] rounded-[10px] border border-[var(--el-border-color-light)] bg-[var(--el-fill-color-light)] p-[12px_14px]"
  >
    <p
      class="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--el-text-color-placeholder)]"
    >
      Confirm action
    </p>
    <p class="mb-2.5 text-[13px] text-[var(--el-text-color-regular)]">
      {{ message }}
    </p>
    <div class="flex gap-2">
      <el-button size="small" type="primary" @click="$emit('confirm')">
        Confirm
      </el-button>
      <el-button size="small" @click="$emit('cancel')">Cancel</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits(["confirm", "cancel"]);
</script>
