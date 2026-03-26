<template>
  <pimped-button label="New Project" class="mb-6" @click="dialogVisible = true" />
  <el-dialog v-model="dialogVisible" title="New project" width="480px" :before-close="handleClose" align-center>
    <el-form label-position="top" v-model="data" @submit.prevent="handleSubmit">
      <el-form-item label="Project name"><el-input v-model="data.name" placeholder="e.g. Website Redesign" required /></el-form-item>
      <el-form-item label="Description"><el-input v-model="data.description" :rows="3" type="textarea" placeholder="What is this project about?" required /></el-form-item>
      <div class="flex justify-end gap-2 mt-1"><el-button @click="handleClose">Cancel</el-button><el-button type="primary" native-type="submit">Create project</el-button></div>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import PimpedButton from '../ui/PimpedButton.vue';
let dialogVisible: Ref<boolean> = ref(false);
let data: Ref<ProjectForm> = ref({ name: '', description: '' });
const emit = defineEmits(['submit']);
function handleClose() { dialogVisible.value = false; resetForm(); }
function handleSubmit() { emit('submit', data.value); dialogVisible.value = false; resetForm(); }
function resetForm() { data.value = { name: '', description: '' }; }
</script>
