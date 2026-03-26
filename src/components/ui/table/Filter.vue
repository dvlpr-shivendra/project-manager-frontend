<template>
  <el-input :placeholder="placeholder" v-model="model" @keypress.enter="emit('change', model)" size="small" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps<{ placeholder: string; routeKey: string }>();
const emit = defineEmits(['change']);
const route = useRoute();
const model = ref(route.query[props.routeKey] as string || '');
</script>
<style>
.el-table .el-input__wrapper { box-shadow: none !important; background: transparent !important; padding-left: 0 !important; }
.el-table .el-input__wrapper:hover { box-shadow: 0 0 0 1px #e5e7eb inset !important; background: #f9fafb !important; border-radius: 6px !important; }
.dark .el-table .el-input__wrapper:hover { box-shadow: 0 0 0 1px #374151 inset !important; background: #1f2937 !important; }
</style>
