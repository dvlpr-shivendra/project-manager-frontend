<template>
  <div class="fixed right-8 bottom-8">
    <el-tooltip class="box-item" effect="dark" content="New Project" placement="top-start">
      <el-button type="primary" :icon="Plus" size="large" @click="dialogVisible = true" circle />
    </el-tooltip>
  </div>

  <el-dialog v-model="dialogVisible" title="New project" width="40%" :before-close="handleClose">

    <form @submit.prevent="handleSubmit">
      <el-input class="mb-4" v-model="data.name" placeholder="Project title" required />

      <el-input v-model="data.description" :rows="2" type="textarea" placeholder="Project description" required />

      <div class="my-4 flex justify-end">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" native-type="submit">Add</el-button>
      </div>

    </form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { ref, type Ref } from 'vue';

const initialData: ProjectForm = {
  name: "",
  description: ""
}

let dialogVisible: Ref<boolean> = ref(false)
let data: Ref<ProjectForm> = ref(initialData)

const emit = defineEmits(['submit'])

function handleClose() {
  dialogVisible.value = false
  data.value = initialData
}

function handleSubmit() {
  emit('submit', data.value)
  dialogVisible.value = false
  data.value = initialData
}
</script>