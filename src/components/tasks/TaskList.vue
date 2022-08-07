<template>
  <div class="flex">
    <div class="grow">
      <task-form @submit="tasks.add" />
      <div v-if="tasks.list.length === 0 && tasks.loading" class="w-9/12">
        <el-skeleton :rows="5" animated />
      </div>
      <ul v-else>
        <li class="grid grid-cols-[auto,8rem] m-3">
          <p class="font-bold">Title</p>
          <p class="font-bold">Assignee</p>
        </li>
        <li v-for="task in tasks.list" :key="task.id" class="grid grid-cols-[auto,8rem] px-1 py-2 border-b cursor-pointer items-center"
          :class="{'bg-green-100': activeTask && task.id === activeTask.id}"
          @click="openTask(task)">
          <p class=" ml-3">{{ task.title }}</p>
          <avatar :name="task.assignee.name" />
        </li>
      </ul>
    </div>

    <div class="transition-all" :class="activeTask ? 'basis-96' : 'basis-0'">
      <task v-if="activeTask" :task="activeTask" @close="closeTask" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import Task from './Task.vue';
import TaskForm from './TaskForm.vue'
import Avatar from '../ui/Avatar.vue';
import { useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useTasks } from '@/stores/tasks';

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

function openTask(task: Task) {
  router.push({ ...router.currentRoute.value, query: { task: task.id } })
}

function closeTask() {
  router.push({ ...router.currentRoute.value, query: {} })
}

</script>
