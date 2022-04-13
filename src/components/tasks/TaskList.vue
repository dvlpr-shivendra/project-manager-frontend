<template>
  <div class="flex">
    <div class="grow">
      <task-form @submit="tasks.add" />
      <ul>
        <li class="grid grid-cols-[2rem,auto,8rem]">
          <p></p>
          <p class="font-bold">Title</p>
          <p class="font-bold">Assignee</p>
        </li>
        <li v-for="task in tasks.list" :key="task.id" class="grid grid-cols-[2rem,auto,8rem] px-1 py-2 border-b"
          @click="openTask(task)">
          <clock class="w-6 h-6" />
          <p>{{ task.title }}</p>
          <p>{{ task.assignee.name }}</p>
        </li>
      </ul>
    </div>

    <div class="transition-all" :class="activeTask ? 'basis-96' : 'basis-0'">
      <task v-if="activeTask" :task="activeTask" @close="activeTask = null" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import { onMounted, ref, type Ref } from 'vue';
import TaskForm from './TaskForm.vue'
import { useTasks } from '@/stores/tasks';
import { Clock } from '@element-plus/icons-vue'
import Task from './Task.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  projectId: number
}>()

const router = useRouter()

const tasks = useTasks()

let activeTask: Ref<Task | null> = ref(<Task | null>null)

onMounted(async () => {
  await tasks.getAll(props.projectId.toString())

  if (router.currentRoute.value.query.task) {
    activeTask.value = tasks.list.find(
      task => task.id.toString() === router.currentRoute.value.query.task
    ) as Task
  }
})

function openTask(task: Task) {
  activeTask.value = task

  router.push({ ...router.currentRoute.value, query: { task: task.id } })

}

</script>
