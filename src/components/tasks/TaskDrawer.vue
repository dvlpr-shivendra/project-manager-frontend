<template>
  <el-drawer v-model="open" title="" :with-header="false" :direction="'rtl'" size="50%" />
</template>

<script lang="ts" setup>

import { computed, type WritableComputedRef } from 'vue';



const props = defineProps<{
  task: Task | null
}>()

const emit = defineEmits(['close'])

const open: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return !!props.task
  },
  set(): void {
    handleClose()
  },
});

function handleClose() {
  emit('close')
}

</script>