<template>
  <el-dialog v-model="dialogVisible" title="New task" width="40%" :before-close="handleClose">
    <form ref="form" @submit.prevent="handleSubmit">
      <el-input placeholder="Enter task title" v-model="formData.title" required />

      
      <div class="my-4 flex justify-end">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" native-type="submit">Add</el-button>
      </div>
    </form>
  </el-dialog>

  <div class="my-4">
    <el-button type="success" :icon="Plus" @click="dialogVisible = true">Add task</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

let dialogVisible: Ref<boolean> = ref(false)

const route = useRoute()

const intialData = {
  title: "",
  project_id: parseInt(route.params.id as string),
}

let formData: Ref<TaskForm> = ref(intialData)

const emit = defineEmits(['submit'])

function handleClose() {
  dialogVisible.value = false;
  formData.value = intialData;
}

function handleSubmit() {
  emit('submit', formData.value)
  dialogVisible.value = false
  formData.value = intialData
}
</script>