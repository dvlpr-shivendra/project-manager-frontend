<script setup lang="ts">
</script>

<template>
  <el-card class="box-card" :body-style="{ margin: '1rem' }">
    <div v-for="o in 14" :key="o" class="text item">{{ 'List item ' + o }}</div>
  </el-card>
</template>
