<template>
  <div class="grid grid-cols-12 gap-4">
    <div :class="activeTask ? 'col-span-8' : 'col-span-12'">
    <task-form @submit="tasks.add" />
      <ul>
        <li class="grid grid-cols-[2rem,auto,8rem]">
          <p></p>
          <p class="font-bold">Title</p>
          <p class="font-bold">Assignee</p>
        </li>
        <li
          v-for="task in tasks.list"
          :key="task.id"
          class="grid grid-cols-[2rem,auto,8rem] px-1 py-2 border-b"
          @click="activeTask = task"
        >
          <clock class="w-6 h-6" :class="task.id === 3 && 'animate-bounce text-green-600'" />
          <p>{{ task.title }}</p>
          <p>{{ task.assignee.name }}</p>
        </li>
      </ul>
    </div>

    <div class="col-span-4" v-if="activeTask">
      <task :task="activeTask" @close="activeTask = null" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, type Ref } from 'vue';
import TaskForm from './TaskForm.vue'
import { useTasks } from '@/stores/tasks';
import { Clock } from '@element-plus/icons-vue'
import Task from './Task.vue';

const props = defineProps<{
  projectId: number
}>()

const tasks = useTasks()

let activeTask: Ref<Task | null> = ref(<Task | null>null)

tasks.getAll(props.projectId.toString())

function openTask(task: Task) {
  activeTask.value = task
}

</script>
