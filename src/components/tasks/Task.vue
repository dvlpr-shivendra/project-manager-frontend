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
      <user-select v-model="task.user" class="w-full" />
    </div>
  </div>

  <el-input
    class="mb-4"
    v-model="task.description"
    autosize
    type="textarea"
    placeholder="Task description"
  />

  <!-- <tags-list :tags="task.tags" /> -->
</template>

<script lang="ts" setup>

import TagsList from './TagsList.vue';
import UserSelect from "@/components/UserSelect.vue";

const props = defineProps<{
  task: Task
}>()
</script>