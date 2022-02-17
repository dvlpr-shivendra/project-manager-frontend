<template>
  <el-input v-model="task.title" class="mb-4" placeholder="Task title" clearable />
  <el-row align="middle" class="mb-4">
    <el-col :span="12">
      <el-date-picker
        style="width: 100%;"
        v-model="task.deadline"
        type="datetime"
        placeholder="Task deadline"
      />
    </el-col>
    <el-col :span="12">
      <user-select v-model.number="task.user_id" />
    </el-col>
  </el-row>

  <el-input class="mb-4" v-model="task.description" autosize type="textarea" placeholder="Task description" />

  <tags-list :tags="task.tags" />

</template>

<script lang="ts" setup>

import TagsList from './TagsList.vue';
import UserSelect from "@/components/UserSelect.vue";

const props = defineProps<{
  task: Task
}>()
</script>