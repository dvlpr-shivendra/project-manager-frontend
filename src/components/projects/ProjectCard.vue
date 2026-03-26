<template>
  <router-link class="col-span-12 md:col-span-6 lg:col-span-4 no-underline block" :to="`/${project.id}`">
    <div class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 h-full flex flex-col gap-3 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-200 cursor-pointer">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-['Syne'] font-bold text-[15px] text-gray-900 dark:text-white leading-snug flex-1">{{ project.name }}</h3>
        <div @click.prevent>
          <el-dropdown trigger="click" placement="bottom-end">
            <button class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"><MoreFilled style="width:14px;height:14px;" /></button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.prevent="updateDialogVisible = true">Edit project</el-dropdown-item>
                <el-dropdown-item @click.prevent="handleDelete" style="color:#ef4444">Delete project</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <p class="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{{ description }}</p>
      <div class="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span class="text-[12px] font-semibold text-indigo-500 dark:text-indigo-400">Open project</span>
        <span class="text-indigo-400 text-xs opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5">→</span>
      </div>
    </div>
  </router-link>
  <project-update-form v-model="updateDialogVisible" :project="project" @submit="(data) => projects.update(project.id, data)" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import truncate from '@/helpers/string';
import { ElMessageBox } from 'element-plus';
import { useProjects } from '@/stores/projects';
import { MoreFilled } from '@element-plus/icons-vue';
import ProjectUpdateForm from './ProjectUpdateForm.vue';
const props = defineProps<{ project: Project }>();
const projects = useProjects();
const description = computed(() => truncate(props.project.description, 130));
const updateDialogVisible = ref(false);
function handleDelete() { ElMessageBox.confirm('Delete this project? This cannot be undone.', 'Delete project', { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }).then(() => projects.remove(props.project.id)).catch(() => {}); }
</script>
