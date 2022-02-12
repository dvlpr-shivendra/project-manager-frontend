<template>
  <div class="grid grid-cols-12 gap-4">
    <project-card
      :project="project"
      v-for="project in projects.list"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProjects } from "@/stores/projects";
import ProjectCard from "../components/projects/ProjectCard.vue";

const projects = useProjects()

onMounted(() => {
  projects.getAll()
})
</script>