<template>
  <el-tooltip :content="name" placement="top-start">
    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold cursor-pointer border-2 border-white dark:border-gray-900 shrink-0">
      {{ name?.[0]?.toUpperCase() }}
    </div>
  </el-tooltip>
</template>
<script lang="ts" setup>
defineProps<{ name: string }>();
</script>
