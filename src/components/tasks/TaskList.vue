<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <task-form @submit="tasks.add" />
      </div>
      <el-dropdown @command="handleMenuCommand">
        <el-button :icon="MoreFilled" text />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="import">
              <span class="flex items-center gap-2"><Upload />Import</span>
            </el-dropdown-item>
            <el-dropdown-item command="export">
              <span class="flex items-center gap-2"><Download />Export</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <div v-if="tasks.list.length === 0 && tasks.loading">
        <el-skeleton :rows="5" animated />
      </div>
      <el-table v-else :data="tasks.list" :style="{width: '100%'}" @cell-click="handleCellClick" highlight-current-row
        :border="true">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="Title" width="360" />
        <el-table-column prop="tags" label="Tags" width="240">
          <template #header>
            <Filter routeKey="tag" placeholder="Filter by tags"
              @change="(keyword: string) => handleFilterChange('tag', keyword)" />
          </template>
          <template #default="scope">
            <tags-preview :tags="scope.row.tags" />
          </template>
        </el-table-column>
        <el-table-column prop="assignee.name" label="Assignee">
          <template #header>
            <Filter routeKey="assignee" placeholder="Filter by assignee"
              @change="(keyword: string) => handleFilterChange('assignee', keyword)" />
          </template>
        </el-table-column>
        <template #append>
          <div class="p-4">
            <el-pagination :default-current-page="tasks.pagination.current_page" :disabled="tasks.loading"
              layout="prev, pager, next, jumper" :total="tasks.pagination.total"
              @update:current-page="updateCurrentPage" />

          </div>
        </template>
      </el-table>
    </div>

    <Transition name="fade">
      <div v-if="activeTask"
        class="bg-white absolute w-screen h-screen z-10 left-0 top-0 md:w-full md:h-full md:right-0 md:left-auto"
        :class="{ 'md:w-1/2 lg:w-4/12 2xl:w-3/12': activeTask }">
        <task :task="activeTask" @close="closeTask" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>

import Task from './Task.vue';
import TaskForm from './TaskForm.vue'
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useTasks } from '@/stores/tasks';
import TagsPreview from './TagsPreview.vue';
import { url } from '@/helpers/http';
import Filter from '@/components/ui/table/Filter.vue';
import { Download, Upload, MoreFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  projectId: number
}>()

const router = useRouter()

const route = useRoute()

const tasks = useTasks()

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

async function handleFilterChange(type: 'tag' | 'assignee', keyword: string) {
  await router.replace({ ...router.currentRoute.value, query: { ...route.query, page: undefined, [type]: keyword === "" ? undefined : keyword } })

  const query = new URLSearchParams(route.query as Record<string, string>).toString()
  tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`))
}

function updateCurrentPage(pageNumber: number) {

  router.push({ ...router.currentRoute.value, query: { page: pageNumber } })
}

function handleMenuCommand(command: string) {
  if (command === 'import') {
    importTasks()
  } else if (command === 'export') {
    exportTasks()
  }
}

function importTasks() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv'
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event: any) => {
      try {
        const csv = event.target.result
        const lines = csv.split('\n').filter((line: string) => line.trim())
        
        if (lines.length < 2) {
          ElMessage.warning('CSV file must contain headers and at least one task')
          return
        }

        // Skip header row and process task rows
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i]
          const [id, title, tags, assignee] = parseCSVLine(line)

          if (!title || !title.trim()) continue

          const taskData: TaskForm = {
            title: title.trim(),
            project_id: props.projectId,
            tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
            assignee_id: assignee ? parseInt(assignee) : null
          }

          tasks.add(taskData)
        }

        ElMessage.success(`Successfully imported ${lines.length - 1} tasks`)
      } catch (error) {
        console.error('Error importing tasks:', error)
        ElMessage.error('Failed to import tasks. Please check the CSV format.')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function exportTasks() {
  if (tasks.list.length === 0) {
    console.warn('No tasks to export')
    return
  }

  // Prepare CSV data
  const headers = ['ID', 'Title', 'Tags', 'Assignee']
  const rows = tasks.list.map(task => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`, // Escape quotes in CSV
    `"${(task.tags?.map((tag: any) => tag.name).join(', ') || '').replace(/"/g, '""')}"`,
    task.assignee?.name || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url_link = URL.createObjectURL(blob)
  
  link.setAttribute('href', url_link)
  link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>
