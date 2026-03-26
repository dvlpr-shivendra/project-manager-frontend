<template>
  <span class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide cursor-pointer transition-opacity hover:opacity-80" :style="{ color, backgroundColor }">
    {{ text }}
    <span v-if="closable" @click.stop="emit('close')" class="inline-flex items-center">
      <Close style="width:10px;height:10px;" />
    </span>
  </span>
</template>
<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue';
defineProps({ text: { type: String, required: true }, color: { type: String, required: true }, backgroundColor: { type: String, required: true }, closable: { type: Boolean, default: false } });
const emit = defineEmits(['close']);
</script>
