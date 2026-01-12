<template>
  <div>
    <pimped-heading>All projects</pimped-heading>

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
import PimpedHeading from "@/components/ui/PimpedHeading.vue";

const projects = useProjects();

onMounted(() => {
  projects.getAll();
});
</script>
