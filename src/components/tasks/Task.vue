<template>
  <el-form v-model="task">
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
      <el-input class="mb-4" v-model="task.description" autosize type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

import UserSelect from "@/components/UserSelect.vue";
import { put, url } from "@/helpers/http";
import { watch } from "vue";

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
</script>