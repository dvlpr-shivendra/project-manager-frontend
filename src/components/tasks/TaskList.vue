<template>
  <div class="flex">
    <div :class="activeTask ? 'w-1/2 xl:w-9/12' : 'w-full'">
      <task-form @submit="tasks.add" />
      <div v-if="tasks.list.length === 0 && tasks.loading" class="w-full xl:w-9/12">
        <el-skeleton :rows="5" animated />
      </div>
      <el-table v-else :data="tasks.list" style="width: 100%" @cell-click="handleCellClick" highlight-current-row
        :border="true">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="Title" width="360" />
        <el-table-column prop="tags" label="Tags" width="240">
          <template #header>
            <el-dropdown @command="handleTagFilterDropdownCommand">
              <span class="el-dropdown-link">
                Tags
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="tag in tags.list" :command="tag.id" :key="tag.id">{{ tag.name }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <tags-preview :tags="scope.row.tags" />
          </template>
        </el-table-column>
        <el-table-column prop="assignee.name" label="Assignee" />
        <!-- <el-table-column prop="timeSpent" label="Hours spent">
          <template #default="scope">
            {{ scope.row.timeSpent > 0 ? dayjs.duration({
                seconds: scope.row.timeSpent
              }).asHours().toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '-'
            }}
          </template>
        </el-table-column> -->
        <template #append>
          <div class="p-4">
            <el-pagination
              :default-current-page="tasks.pagination.current_page"
              :disabled="tasks.loading"
              layout="prev, pager, next, jumper"
              :total="tasks.pagination.total"
              @update:current-page="updateCurrentPage"
            />

          </div>
        </template>
      </el-table>
    </div>

    <Transition name="slide-fade">
      <div v-if="activeTask" class="absolute w-screen h-screen bg-white z-10 left-0 top-0 md:sticky md:w-full md:h-full"
        :class="{ 'md:w-1/2 xl:w-3/12': activeTask }">
        <task :task="activeTask" @close="closeTask" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>

import Task from './Task.vue';
import TaskForm from './TaskForm.vue'
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, watch } from 'vue';
import { useTasks } from '@/stores/tasks';
import TagsPreview from './TagsPreview.vue';
import dayjs from 'dayjs';
import { useTags } from '@/stores/tags';
import { ArrowDown } from '@element-plus/icons-vue'
import { url } from '@/helpers/http';

const props = defineProps<{
  projectId: number
}>()

const router = useRouter()

const route = useRoute()

const tasks = useTasks()

const tags = useTags()

onMounted(() => {
  /** @ts-ignore */
  const query = new URLSearchParams(route.query).toString()
  
  tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`))
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
  router.replace({ ...router.currentRoute.value, query: { ...route.query, task: task.id } })
}

function closeTask() {
  router.replace({ ...router.currentRoute.value, query: {} })
}

async function handleTagFilterDropdownCommand(tagId: number) {
  await router.replace({ ...router.currentRoute.value, query: { ...route.query, page: undefined, tag_id: tagId} })
  
  const query = new URLSearchParams(route.query as Record<string, string>).toString()
  tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`))
}

function updateCurrentPage(pageNumber: number) {

  router.push({ ...router.currentRoute.value, query: { page: pageNumber } })
}

</script>
