<template>
  <span class="rounded-full text-xs px-2 py-1 cursor-pointer"
    :style="{ color: color, backgroundColor: backgroundColor }"
    >
    {{ text }}
    <el-tooltip class="box-item" effect="dark" content="Remove tag">
      <div class="inline" @click="emit('close')">
        <Close v-if="closable" class="w-4 h-4 inline" />
        </div>
    </el-tooltip>
  </span>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import {  Close } from '@element-plus/icons-vue'

defineProps({
  text: { type: String, required: true },
  color: { type: String, required: true },
  backgroundColor: { type: String, required: true },
  closable: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

</script>

