<template>
  <el-card class="col-span-12 md:col-span-6 lg:col-span-4">
    <template #header>
      <div class="card-header">
        <router-link tag="div" :to="`/${project.id}`">{{ project.name }}</router-link>
      </div>
    </template>
    <div>{{ description }}</div>
  </el-card>
</template>

<script lang="ts" setup>
import truncate from "@/helpers/string";
import { computed } from "vue";

const props = defineProps<{
  project: Project
}>()


const description = computed(() => {
  return truncate(props.project.description, 150)
})

</script>