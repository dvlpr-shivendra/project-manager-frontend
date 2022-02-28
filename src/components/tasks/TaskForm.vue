<template>
  <el-dialog v-model="dialogVisible" title="New task" width="40%" :before-close="handleClose">
    <el-form v-model="formData" label-position="top" ref="form" @submit.prevent="handleSubmit">
      <el-form-item label="Title">
        <el-input
          ref="taskTitleInput"
          placeholder="Enter task title"
          v-model="formData.title"
          required
        />
      </el-form-item>

      <div class="flex justify-end">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" native-type="submit">Add</el-button>
      </div>
    </el-form>
  </el-dialog>

  <div class="my-4">
    <el-button type="success" :icon="Plus" @click="dialogVisible = true">Add task</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { nextTick, ref, watch, type Ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'

let dialogVisible: Ref<boolean> = ref(false)

const route = useRoute()

type inputRef = HTMLInputElement | null

const formData: Ref<TaskForm> = ref({
  title: "",
  project_id: parseInt(route.params.id as string),
})

const taskTitleInput: Ref<inputRef> = ref(null)

const emit = defineEmits(['submit'])

watch(dialogVisible, function (newValue) {
  if (!newValue) return

  nextTick(() => {
    taskTitleInput.value?.focus()
  })
})

function handleClose() {
  dialogVisible.value = false
  formData.value.title = ""
}

function handleSubmit() {
  emit('submit', formData.value)
  dialogVisible.value = false
  formData.value.title = ""
}
</script>