<template>
  <div class="grid grid-cols-12">
    <div :class="activeTask ? 'col-span-8' : 'col-span-12'">
      <task-form @submit="tasks.add" />
      <div v-if="tasks.list.length === 0 && tasks.loading" class="w-9/12">
        <el-skeleton :rows="5" animated />
      </div>
      <el-table v-else :data="tasks.list" style="width: 100%" @cell-click="handleCellClick" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="Title" width="360" />
        <el-table-column prop="tags" label="Tags" width="240">
          <template #default="scope">
            <tags-preview :tags="scope.row.tags" />
          </template>
        </el-table-column>
        <el-table-column prop="assignee.name" label="Assignee" />
      </el-table>
    </div>

    <div class="transition-all" :class="{'col-span-4' : activeTask}">
      <task v-if="activeTask" :task="activeTask" @close="closeTask" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import Task from './Task.vue';
import TaskForm from './TaskForm.vue'
import { useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useTasks } from '@/stores/tasks';
import TagsPreview from './TagsPreview.vue';

const props = defineProps<{
  projectId: number
}>()

const router = useRouter()

const tasks = useTasks()

onMounted(() => {
  tasks.getAll(props.projectId.toString())
})

const activeTask = computed(() => {
  if (!router.currentRoute.value.query.task) return

  return tasks.list.find(
    task => task.id.toString() === router.currentRoute.value.query.task
  ) as Task
})

function handleCellClick(task: Task) {
  openTask(task);
}

function openTask(task: Task) {
  router.push({ ...router.currentRoute.value, query: { task: task.id } })
}

function closeTask() {
  router.push({ ...router.currentRoute.value, query: {} })
}

</script>
