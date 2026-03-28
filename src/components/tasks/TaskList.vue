<template>
  <div class="relative">
    <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
      <pimped-button label="Add Task" @click="addNewTask" />
      <el-dropdown @command="handleMenuCommand">
        <button class="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"><MoreFilled style="width:14px;height:14px;" /></button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="import"><span class="flex items-center gap-2"><Upload class="w-3.5 h-3.5" /> Import tasks</span></el-dropdown-item>
            <el-dropdown-item command="export"><span class="flex items-center gap-2"><Download class="w-3.5 h-3.5" /> Export all tasks</span></el-dropdown-item>
            <el-dropdown-item v-if="selectedTaskIds.length" command="exportSelectedTasks"><span class="flex items-center gap-2"><Download class="w-3.5 h-3.5" /> Export {{ selectedTaskIds.length }} {{ pluralize('task', selectedTaskIds.length) }}</span></el-dropdown-item>
            <el-dropdown-item v-if="selectedTaskIds.length" command="deleteSelectedTasks"><span class="flex items-center gap-2 text-red-500"><Delete class="w-3.5 h-3.5" /> Delete {{ selectedTaskIds.length }} {{ pluralize('task', selectedTaskIds.length) }}</span></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div v-if="tasks.list.length === 0 && tasks.loading" class="p-6"><el-skeleton :rows="5" animated /></div>
      <el-table v-else :data="tasks.list" style="width:100%" highlight-current-row :border="false" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="title" label="Title" min-width="360">
          <template #default="scope: { row: Task }"><task-title-cell v-model="scope.row" @add="addNewTask" @open="openTask" /></template>
        </el-table-column>
        <el-table-column prop="tags" label="Tags" width="300">
          <template #header><Filter routeKey="tag" placeholder="Filter by tag" @change="(k: string) => handleFilterChange('tag', k)" /></template>
          <template #default="scope: { row: Task }"><TagForm v-if="allTags.length > 0" :task-id="scope.row.id" :tags="allTags" v-model="scope.row.tags" /></template>
        </el-table-column>
        <el-table-column prop="assignee.name" label="Assignee" min-width="180">
          <template #header><Filter routeKey="assignee" placeholder="Filter by assignee" @change="(k: string) => handleFilterChange('assignee', k)" /></template>
          <template #default="scope: { row: Task }">
            <user-select class="w-full" :user="scope.row.assignee" @change="(user: User) => { scope.row.assignee = user; scope.row.assignee_id = user.id; updateTask(scope.row); }" />
          </template>
        </el-table-column>
        <template #append>
          <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <el-pagination :default-current-page="tasks.pagination.current_page" :disabled="tasks.loading" layout="prev, pager, next, jumper" :total="tasks.pagination.total" @update:current-page="updateCurrentPage" />
          </div>
        </template>
      </el-table>
      <div v-if="!tasks.loading && tasks.list.length === 0" class="flex flex-col items-center gap-3 py-16 text-gray-400 dark:text-gray-600">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="text-center"><p class="font-['Syne'] font-bold text-[15px] text-gray-600 dark:text-gray-400 mb-1">No tasks yet</p><p class="text-[13px]">Click "Add Task" to create your first one</p></div>
      </div>
    </div>
    <Transition name="task-panel">
      <div v-if="activeTask" class="fixed top-14 right-0 bottom-0 w-full md:w-[520px] z-10 shadow-2xl border-l border-gray-200 dark:border-gray-800 rounded-r-xl overflow-hidden">
        <task :task="activeTask" @close="closeTask" />
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import Task from './Task.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, onMounted, provide, ref } from 'vue';
import { useTasks } from '@/stores/tasks';
import { get, getBlob, postMultipart, url } from '@/helpers/http';
import Filter from '@/components/ui/table/Filter.vue';
import UserSelect from '@/components/ui/UserSelect.vue';
import TaskTitleCell from './TaskTitleCell.vue';
import { Download, Upload, MoreFilled, Delete } from '@element-plus/icons-vue';
import { pluralize } from '@/helpers/string';
import PimpedButton from '@/components/ui/PimpedButton.vue';
import TagForm from '@/components/ui/TagForm.vue';
const props = defineProps<{ projectId: number }>();
const router = useRouter(); const route = useRoute(); const tasks = useTasks(); const selectedTaskIds = ref<number[]>([]); const allTags = ref<Tag[]>([]);
onMounted(() => { fetchTasks(); fetchTags(); });
function fetchTags() { get(url('tags')).then(tags => (allTags.value = tags)).catch(console.log); }
const fetchTasks = () => { const query = new URLSearchParams(route.query as Record<string, string>).toString(); tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`)); };
const activeTask = computed(() => { if (!router.currentRoute.value.query.task) return; return tasks.list.find(t => t.id.toString() === router.currentRoute.value.query.task) as Task; });
function openTask(task: Task) { router.replace({ ...router.currentRoute.value, query: { ...route.query, task: task.id } }); }
function closeTask() { router.replace({ ...router.currentRoute.value, query: {} }); }
async function handleFilterChange(type: 'tag' | 'assignee', keyword: string) { await router.replace({ ...router.currentRoute.value, query: { ...route.query, page: undefined, [type]: keyword === '' ? undefined : keyword } }); const query = new URLSearchParams(route.query as Record<string, string>).toString(); tasks.getAll(url(`tasks?project_id=${props.projectId}&${query}`)); }
function updateCurrentPage(pageNumber: number) { router.push({ ...router.currentRoute.value, query: { page: pageNumber } }); }
function handleMenuCommand(command: string) { if (command === 'import') importTasks(); else if (command === 'export') exportTasks(); else if (command === 'exportSelectedTasks') exportSelectedTasks(); else if (command === 'deleteSelectedTasks') deleteSelectedTasks(); }
async function exportTasks() { const blob = await getBlob(url(`projects/${props.projectId}/tasks/export`)); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tasks.xlsx'; a.click(); URL.revokeObjectURL(a.href); }
async function importTasks(): Promise<void> { const input = document.createElement('input'); input.type = 'file'; input.accept = '.xlsx'; const file = await new Promise<File | null>(resolve => { input.onchange = () => resolve(input.files?.[0] ?? null); input.click(); }); if (!file) return; const fd = new FormData(); fd.append('file', file); await postMultipart(url(`projects/${props.projectId}/tasks/import`), fd); fetchTasks(); }
function exportSelectedTasks() { if (!tasks.list.length) return; const headers = ['ID','Title','Tags','Assignee']; const rows = tasks.list.map(t => [t.id,`"${t.title.replace(/"/g,'""')}"`,`"${(t.tags?.map((tg:any)=>tg.name).join(', ')||'').replace(/"/g,'""')}"`,t.assignee?.name||'']); const csv = [headers.join(','),...rows.map(r=>r.join(','))].join('\n'); const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link); }
function handleSelectionChange(selection: any[]) { selectedTaskIds.value = selection.map(t => t.id); }
async function deleteSelectedTasks() { await ElMessageBox.confirm('Delete these tasks? This cannot be undone.','Delete tasks',{confirmButtonText:'Delete',cancelButtonText:'Cancel',type:'warning'}); await tasks.removeMany(selectedTaskIds.value); selectedTaskIds.value = []; ElMessage.success('Tasks deleted'); }
async function addNewTask() { const task: Task = await tasks.add({ title: '', project_id: props.projectId, tags: [] }); await nextTick(); openTask(task); const input: HTMLInputElement | null = document.querySelector(`input#taskTitleInput${task.id}`); input?.focus(); }
async function updateTask(task: Task) { try { await tasks.update(task); ElMessage({ message: 'Task updated.', type: 'success', grouping: true }); } catch (e: any) { ElMessage.error(e?.message || 'Could not update task.'); } }
provide('updateTask', updateTask);
</script>
<style scoped>
.el-table :deep(.el-select__wrapper) { box-shadow: none !important; }
.el-table :deep(.el-select__wrapper:hover) { box-shadow: 0 0 0 1px #c0c4cc inset !important; }
.el-table :deep(.el-select__suffix) { opacity: 0; }
.el-table :deep(.el-select__wrapper:hover .el-select__suffix) { opacity: 1; }
.task-panel-enter-active { animation: panelIn 220ms cubic-bezier(0.16,1,0.3,1); }
.task-panel-leave-active { animation: panelOut 160ms ease-in; }
@keyframes panelIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
@keyframes panelOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(20px)} }
</style>
