<template>
  <div class="fixed right-8 bottom-8">
    <el-tooltip class="box-item" effect="dark" content="New Project" placement="top-start">
      <el-button type="primary" :icon="Plus" size="large" @click="dialogVisible = true" circle />
    </el-tooltip>
  </div>

  <el-dialog v-model="dialogVisible" title="New project" width="40%" :before-close="handleClose">
    <el-form label-position="top" label-width="100px" v-model="data" @submit.prevent="handleSubmit">
      <el-form-item label="Name">
        <el-input v-model="data.name" required />
      </el-form-item>

      <el-form-item label="Description">
        <el-input v-model="data.description" :rows="2" type="textarea" required />
      </el-form-item>

      <div class="flex justify-end">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" native-type="submit">Add</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { ref, type Ref } from 'vue';

let dialogVisible: Ref<boolean> = ref(false)
let data: Ref<ProjectForm> = ref({
  name: "",
  description: ""
})

const emit = defineEmits(['submit'])

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function handleSubmit() {
  emit('submit', data.value)
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  data.value = {
    name: "",
    description: ""
  }
}
</script>