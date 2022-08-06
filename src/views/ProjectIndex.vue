<template>

  <div class="p-4">
    <h1 class="font-bold mb-5">All projects</h1>

    <div class="grid grid-cols-12 gap-4">
      <project-card :project="project" v-for="project in projects.list" />
    </div>

    <project-form @submit="projects.add" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProjects } from "@/stores/projects";
import ProjectCard from "@/components/projects/ProjectCard.vue"
import ProjectForm from "@/components/projects/ProjectForm.vue"

const projects = useProjects()

onMounted(() => {
  projects.getAll()
})
</script>