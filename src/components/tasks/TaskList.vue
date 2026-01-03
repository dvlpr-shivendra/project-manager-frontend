<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <el-button type="success" :icon="Plus" @click="addNewTask"
          >Add task</el-button
        >
      </div>
      <div class="flex flex-col items-end gap-2">
        <el-dropdown @command="handleMenuCommand">
          <el-button :icon="MoreFilled" text />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="import">
                <span class="flex items-center gap-2"><Upload />Import</span>
              </el-dropdown-item>
              <el-dropdown-item command="export">
                <span class="flex items-center gap-2"
                  ><Download />Export All tasks</span
                >
              </el-dropdown-item>
              <el-dropdown-item
                v-if="selectedTaskIds.length"
                command="importSelectedTasks"
              >
                <span class="flex items-center gap-2">
                  <Delete />Export {{ selectedTaskIds.length }}
                  {{ pluralize("task", selectedTaskIds.length) }}
                </span>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="selectedTaskIds.length"
                command="deleteSelectedTasks"
              >
                <span class="flex items-center gap-2 text-red-500">
                  <Delete />Delete {{ selectedTaskIds.length }}
                  {{ pluralize("task", selectedTaskIds.length) }}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div>
      <div v-if="tasks.list.length === 0 && tasks.loading">
        <el-skeleton :rows="5" animated />
      </div>
      <el-table
        v-else
        :data="tasks.list"
        :style="{ width: '100%' }"
        @cell-click="handleCellClick"
        highlight-current-row
        :border="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="Title" width="360">
          <template #default="scope">
            <input
              :id="`taskTitleInput${scope.row.id}`"
              v-model="scope.row.title"
              type="text"
              class="block w-full outline-none focus:outline-none border-0 focus:border-0 focus:ring-0"
              placeholder="Task title"
              @keypress.enter="addNewTask"
            />
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="Tags" width="240">
          <template #header>
            <Filter
              routeKey="tag"
              placeholder="Filter by tags"
              @change="(keyword: string) => handleFilterChange('tag', keyword)"
            />
          </template>
          <template #default="scope">
            <tags-preview :tags="scope.row.tags" />
          </template>
        </el-table-column>
        <el-table-column prop="assignee.name" label="Assignee">
          <template #header>
            <Filter
              routeKey="assignee"
              placeholder="Filter by assignee"
              @change="
                (keyword: string) => handleFilterChange('assignee', keyword)
              "
            />
          </template>
        </el-table-column>
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

    <Transition name="fade">
      <div
        v-if="activeTask"
        class="bg-white absolute w-screen h-screen z-10 left-0 top-0 md:w-full md:h-full md:right-0 md:left-auto"
        :class="{ 'md:w-1/2 lg:w-4/12 2xl:w-3/12': activeTask }"
      >
        <task :task="activeTask" @close="closeTask" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import Task from "./Task.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, nextTick, onMounted, ref } from "vue";
import { useTasks } from "@/stores/tasks";
import TagsPreview from "./TagsPreview.vue";
import { getBlob, postMultipart, url } from "@/helpers/http";
import Filter from "@/components/ui/table/Filter.vue";
import {
  Download,
  Upload,
  MoreFilled,
  Delete,
  Plus,
} from "@element-plus/icons-vue";
import { pluralize } from "@/helpers/string";

const props = defineProps<{
  projectId: number;
}>();

const router = useRouter();

const route = useRoute();

const tasks = useTasks();
const selectedTaskIds = ref<number[]>([]);

onMounted(() => {
  fetchTasks();
});

const fetchTasks = () => {
  const query = new URLSearchParams(
    route.query as Record<string, string>,
  ).toString();

  tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`));
};

const activeTask = computed(() => {
  if (!router.currentRoute.value.query.task) return;

  return tasks.list.find(
    (task) => task.id.toString() === router.currentRoute.value.query.task,
  ) as Task;
});

function handleCellClick(task: Task) {
  openTask(task);
}

function openTask(task: Task) {
  router.replace({
    ...router.currentRoute.value,
    query: { ...route.query, task: task.id },
  });
}

function closeTask() {
  router.replace({ ...router.currentRoute.value, query: {} });
}

async function handleFilterChange(type: "tag" | "assignee", keyword: string) {
  await router.replace({
    ...router.currentRoute.value,
    query: {
      ...route.query,
      page: undefined,
      [type]: keyword === "" ? undefined : keyword,
    },
  });

  const query = new URLSearchParams(
    route.query as Record<string, string>,
  ).toString();
  tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`));
}

function updateCurrentPage(pageNumber: number) {
  router.push({ ...router.currentRoute.value, query: { page: pageNumber } });
}

function handleMenuCommand(command: string) {
  if (command === "import") {
    importTasks();
  } else if (command === "export") {
    exportTasks();
  } else if (command === "exportSelectedTasks") {
    exportSelectedTasks();
  } else if (command === "deleteSelectedTasks") {
    deleteSelectedTasks();
  }
}

async function exportTasks() {
  const blob = await getBlob(url(`projects/${props.projectId}/tasks/export`));

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tasks.xlsx";
  a.click();

  URL.revokeObjectURL(a.href);
}

async function importTasks(): Promise<void> {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx";

  const file = await new Promise<File | null>((resolve) => {
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });

  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  await postMultipart(url(`projects/${props.projectId}/tasks/import`), fd);

  fetchTasks();
}

function exportSelectedTasks() {
  if (tasks.list.length === 0) {
    console.warn("No tasks to export");
    return;
  }

  // Prepare CSV data
  const headers = ["ID", "Title", "Tags", "Assignee"];
  const rows = tasks.list.map((task) => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`, // Escape quotes in CSV
    `"${(task.tags?.map((tag: any) => tag.name).join(", ") || "").replace(/"/g, '""')}"`,
    task.assignee?.name || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url_link = URL.createObjectURL(blob);

  link.setAttribute("href", url_link);
  link.setAttribute(
    "download",
    `tasks-export-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleSelectionChange(selection: any[]) {
  selectedTaskIds.value = selection.map((task) => task.id);
}

async function deleteSelectedTasks() {
  await ElMessageBox.confirm("Are you sure to delete these tasks?");

  await tasks.removeMany(selectedTaskIds.value);

  selectedTaskIds.value = [];

  ElMessage.success("Selected tasks deleted");
}

async function addNewTask() {
  const task: Task = await tasks.add({
    title: "",
    project_id: props.projectId,
    tags: [],
  });

  await nextTick();

  openTask(task);

  const titleInput: HTMLInputElement | null = document.querySelector(
    `input#taskTitleInput${task.id}`,
  );

  titleInput?.focus();
}
</script>
