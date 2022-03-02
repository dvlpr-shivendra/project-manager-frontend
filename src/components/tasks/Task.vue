<template>
  <div class="p-4 shadow h-[calc(100vh-3rem)]">
    <div class="h-10 w-full flex justify-between">
      <div>
        <el-button
          @click="markComplete"
          type="success"
          :loading-icon="Eleme"
          :loading="markingComplete"
          :plain="task.is_complete"
        >Mark {{ task.is_complete ? 'Incomplete' : 'Complete' }}</el-button>
      </div>

      <div></div>
    </div>

    <el-form v-model="task" label-position="top">
      <input
        class="mb-4 w-full h-14 text-2xl px-2 hover:border rounded"
        v-model="task.title"
        placeholder="Task title"
      />

      <el-form-item label="Deadline">
        <el-date-picker
          placeholder="Click to set deadline"
          v-model="task.deadline"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <user-select label="Assign to" :user="task.assignee" @change="assignTo" class="w-full" />

      <el-form-item label="Description">
        <el-input class="mb-4" v-model="task.description" :rows="2" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>

import UserSelect from "@/components/UserSelect.vue";
import { put, url } from "@/helpers/http";
import { ref, watch, type Ref } from "vue";

import { Eleme } from '@element-plus/icons-vue'

const props = defineProps<{
  task: Task
}>()

watch(props.task, updateTask)

function updateTask() {
  put(url(`tasks/${props.task.id}`), props.task)
    .catch(e => console.log(e))
}

function assignTo(user: User) {
  props.task.assignee = user
  props.task.assignee_id = user.id
}

const markingComplete: Ref<boolean> = ref(false)

function markComplete() {
  markingComplete.value = true
  props.task.is_complete = !props.task.is_complete
  put(url(`tasks/${props.task.id}`), props.task)
    .catch(e => {
      props.task.is_complete = !props.task.is_complete
      console.log(e)
    })
    .finally(() => markingComplete.value = false)
}
</script>