<template>
  <button @click="openSearch" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-gray-600 dark:hover:text-gray-300 text-[13px] transition-all cursor-pointer">
    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
      <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zm-.5 3.293 2.854 2.853-.707.707L8.793 9.5A4.5 4.5 0 1 1 9.5 8.793z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
    </svg>
    <span class="hidden sm:inline">Search</span>
    <kbd class="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600">⌘K</kbd>
  </button>

  <el-drawer v-model="drawer" direction="rtl" :with-header="false" size="400px">
    <div class="flex flex-col h-full p-5 gap-4">
      <h2 class="font-['Syne'] font-bold text-xl text-gray-900 dark:text-white">Search</h2>
      <el-input ref="searchInput" v-model="query" placeholder="Search projects and tasks…" :prefix-icon="Search" size="large" clearable @input="debounceSearch" />
      <el-skeleton v-if="searching" :rows="4" animated />
      <div v-else-if="query.length >= 2 && !result.projects.length && !result.tasks.length" class="flex flex-col items-center gap-3 py-12 text-gray-400 dark:text-gray-500">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <p class="text-[14px]">No results for "{{ query }}"</p>
      </div>
      <div v-else class="flex flex-col gap-5 overflow-y-auto flex-1">
        <div v-if="result.projects.length">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 px-1">Projects</p>
          <TransitionGroup name="list">
            <button v-for="p in result.projects" :key="p.id" @click="openProject(p)" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors group mb-1">
              <span class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.5"/></svg>
              </span>
              <span class="text-[13px] font-medium text-gray-800 dark:text-gray-200 flex-1 truncate">{{ p.name }}</span>
              <span class="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </TransitionGroup>
        </div>
        <div v-if="result.tasks.length">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 px-1">Tasks</p>
          <TransitionGroup name="list">
            <button v-for="t in result.tasks" :key="t.id" @click="openTask(t)" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors group mb-1">
              <span class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="flex flex-col min-w-0">
                <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ t.project?.name }}</span>
                <span class="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">{{ t.title }}</span>
              </span>
              <span class="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0">→</span>
            </button>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref, type Ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { get, url } from '@/helpers/http';
import { Search } from '@element-plus/icons-vue';
import { debounce } from 'lodash';

const router = useRouter();
const drawer = ref(false);
const searching = ref(false);
const query = ref('');
type SearchResult = { projects: Project[]; tasks: Task[] };
const result: Ref<SearchResult> = ref({ projects: [], tasks: [] });
const searchInput = ref();

function openSearch() { drawer.value = true; setTimeout(() => searchInput.value?.focus(), 300); }
function debounceSearch() { result.value = { projects: [], tasks: [] }; if (query.value.length < 2) return; searching.value = true; debounce(search, 500)(); }
function search() { get(url(`search/${query.value}`)).then(d => { result.value = d; }).finally(() => { searching.value = false; }); }
function openTask(t: Task) { drawer.value = false; result.value = { projects: [], tasks: [] }; query.value = ''; router.push({ name: 'Project', params: { id: t.project_id }, query: { task: t.id } }); }
function openProject(p: Project) { drawer.value = false; result.value = { projects: [], tasks: [] }; query.value = ''; router.push({ name: 'Project', params: { id: p.id } }); }

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
