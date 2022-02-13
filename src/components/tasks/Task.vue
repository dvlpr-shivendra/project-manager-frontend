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
      <el-select class="w-full ml-2" v-model="task.user.id" placeholder="Select">
        <el-option v-for="item in 15" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-col>
  </el-row>

  <el-input class="mb-4" v-model="task.description" autosize type="textarea" placeholder="Task description" />

  <tags-list :tags="task.tags" />

</template>

<script lang="ts" setup>

import TagsList from './TagsList.vue';

const props = defineProps<{
  task: Task
}>()
</script>