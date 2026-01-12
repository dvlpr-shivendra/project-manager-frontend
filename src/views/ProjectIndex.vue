<template>
  <div class="p-4">
    <h1
      class="mb-5 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
    >
      All projects
    </h1>

    <div class="grid grid-cols-12 gap-4">
      <project-card-skeleton
        v-for="_ in 5"
        v-if="projects.loading && projects.list.length === 0"
      />
      <project-card
        :project="project"
        v-for="project in projects.list"
        v-else
      />
    </div>

    <project-form @submit="projects.add" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProjects } from "@/stores/projects";
import ProjectCard from "@/components/projects/ProjectCard.vue";
import ProjectForm from "@/components/projects/ProjectForm.vue";
import ProjectCardSkeleton from "@/components/projects/ProjectCardSkeleton.vue";

const projects = useProjects();

onMounted(() => {
  projects.getAll();
});
</script>
