<template>
  <div class="flex">
    <div class="grow">
      <task-form @submit="tasks.add" />
      <el-skeleton :rows="5" animated v-if="tasks.list.length === 0" />
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
      <task v-if="activeTask" :task="activeTask" @close="activeTask = null" />
    </div>
  </div>
</template>

<script lang="ts" setup>

import { onMounted, ref, type Ref } from 'vue';
import TaskForm from './TaskForm.vue'
import { useTasks } from '@/stores/tasks';
import Task from './Task.vue';
import { useRouter } from 'vue-router';
import Avatar from '../ui/Avatar.vue';

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
