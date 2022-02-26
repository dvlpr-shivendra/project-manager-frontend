<template>
  <el-input v-model="task.title" class="mb-4" placeholder="Task title" clearable />

  <div class="grid grid-cols-2 gap-4 mb-4">
    <div class="col-span-1">
      <el-date-picker
        style="width: 100%;"
        v-model="task.deadline"
        type="datetime"
        placeholder="Task deadline"
      />
    </div>

    <div class="col-span-1">
      <user-select :user="task.user" @change="assignTo" class="w-full" />
    </div>
  </div>

  <el-input
    class="mb-4"
    v-model="task.description"
    autosize
    type="textarea"
    placeholder="Task description"
  />
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

function assignTo(user:User) {
  props.task.user = user
  props.task.user_id = user.id
}
</script>