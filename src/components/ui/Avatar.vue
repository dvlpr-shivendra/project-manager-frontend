<template>
  <el-tooltip class="box-item" effect="dark" :content="name" placement="top-start">
    <img :src="url" :alt="name" class="w-8 rounded-full cursor-pointer">
  </el-tooltip>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  name: string
}>()

const url = computed(() => `https://avatars.dicebear.com/v2/initials/${props.name}.svg`)
</script>