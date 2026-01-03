<template>
  <el-switch v-model="dark" @change="apply" />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { localStorageRef } from '@/composables/localStorageRef'

const dark = localStorageRef<boolean>('darkMode', false)

function apply() {
  document.documentElement.classList.toggle('dark', dark.value)
}

watch(dark, apply, { immediate: true })
</script>
