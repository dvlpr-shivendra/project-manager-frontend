<template>
  <div class="flex items-center gap-2 group/row w-full">
    <el-tooltip :content="'Mark ' + (task.is_complete ? 'Incomplete' : 'Complete')" placement="bottom">
      <pimped-checkbox v-model="task.is_complete" theme="green" @update:model-value="() => updateTask(task)" />
    </el-tooltip>
    <div v-if="updatingTitle" class="flex-1 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    <input v-else :id="`taskTitleInput${task.id}`" v-model="task.title" type="text"
      class="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
      :class="task.is_complete ? 'line-through text-gray-400 dark:text-gray-600' : ''"
      placeholder="Task title" @keypress.enter="emit('add')" />
    <el-dropdown class="opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0">
      <button class="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"><el-icon :size="14"><MagicStick /></el-icon></button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="task.title" @click="rephrase">Rephrase title</el-dropdown-item>
          <el-dropdown-item v-if="task.description" @click="generateTitle">Generate from description</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-tooltip content="Open details" placement="right">
      <button class="opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer shrink-0" @click="emit('open', modelValue)">
        <el-icon :size="14"><Right /></el-icon>
      </button>
    </el-tooltip>
  </div>
</template>
<script setup lang="ts">
import { MagicStick, Right } from '@element-plus/icons-vue';
import PimpedCheckbox from '@/components/ui/PimpedCheckbox.vue';
import { post, url } from '@/helpers/http';
import { inject, ref, type ModelRef } from 'vue';
const emit = defineEmits(['add', 'open']);
const task = defineModel<Task>() as ModelRef<Task>;
const updateTask = inject<(task: Task) => void>('updateTask')!;
const updatingTitle = ref(false);
async function rephrase() { updatingTitle.value = true; try { const { result }: { result: string } = await post(url('llm/rephrase'), { text: task.value.title }); task.value.title = result; updateTask(task.value); } catch (e) { console.error(e); } finally { updatingTitle.value = false; } }
async function generateTitle() { updatingTitle.value = true; try { const { result }: { result: string } = await post(url('llm/generate-title'), { description: task.value.description }); task.value.title = result; updateTask(task.value); } catch (e) { console.error(e); } finally { updatingTitle.value = false; } }
</script>
