<template>
  <el-table
    :data="tasks.list"
    style="width: 100%"
    :border="true"
    :row-class-name="tableRowClassName"
  >
    <el-table-column label="Title">
      <template #default="scope">
        <el-button @click="openTask(scope.row)" type="text">{{ scope.row.title }}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="Assignee" prop="assignee.name" />
  </el-table>

  <task-form @submit="tasks.add" />

  <task-drawer :task="activeTask" @close="activeTask = null" />
  
</template>

<script lang="ts" setup>

import { ref, type Ref } from 'vue';
import TaskForm from './TaskForm.vue'
import { useTasks } from '@/stores/tasks';
import TaskDrawer from '@/components/tasks/TaskDrawer.vue'

const props = defineProps<{
  projectId: number
}>()

const tasks = useTasks()

let activeTask: Ref<Task | null> = ref(<Task | null>null)

tasks.getAll(props.projectId.toString())

function openTask(task: Task) {
  activeTask.value = task
}

const tableRowClassName = ({ row }: { row: Task}) => {
  return row.is_complete ? 'success-row' : ''
}

</script>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-lighter);
}
</style>