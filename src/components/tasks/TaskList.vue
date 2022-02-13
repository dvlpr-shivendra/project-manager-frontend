<template>
  <el-table :data="tasks.list" style="width: 100%" :border="true">
    <el-table-column type="selection" width="55" />
    <el-table-column label="Title">
      <template #default="scope">
        <el-button @click="openTask(scope.row)" type="text">{{ scope.row.title }}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="Assignee" prop="user.name" />
    <el-table-column label="Tags">
      <template #default="scope">
        <el-tag
          v-for="tag in scope.row.tags"
          :key="tag.pivot.id"
          class="mx-1"
          :type="tag.type"
          closable
        >{{ tag.title }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>

import { useTasks } from '@/stores/tasks';

const props = defineProps<{
  projectId: number
}>()

const tasks = useTasks()

tasks.getAll(props.projectId.toString())

function openTask(task: Task) {
  alert(task.title);
}

</script>