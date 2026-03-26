<template>
  <div class="flex flex-col gap-6">
    <pimped-heading>All Projects</pimped-heading>
    <project-form @submit="projects.add" />
    <div class="grid grid-cols-12 gap-4">
      <template v-if="projects.loading && projects.list.length === 0"><project-card-skeleton v-for="i in 6" :key="i" /></template>
      <template v-else>
        <div v-if="projects.list.length === 0" class="col-span-12 flex flex-col items-center gap-4 py-20 text-gray-400 dark:text-gray-600">
          <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.5"/></svg></div>
          <div class="text-center"><p class="font-['Syne'] font-bold text-[16px] text-gray-700 dark:text-gray-300 mb-1">No projects yet</p><p class="text-[13px]">Click "New Project" above to get started</p></div>
        </div>
        <project-card v-for="project in projects.list" :key="project.id" :project="project" />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjects } from '@/stores/projects';
import ProjectCard from '@/components/projects/ProjectCard.vue';
import ProjectForm from '@/components/projects/ProjectForm.vue';
import ProjectCardSkeleton from '@/components/projects/ProjectCardSkeleton.vue';
import PimpedHeading from '@/components/ui/PimpedHeading.vue';
const projects = useProjects();
onMounted(() => projects.getAll());
</script>
