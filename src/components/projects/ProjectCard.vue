<template>
  <router-link class="col-span-12 md:col-span-6 lg:col-span-4 w-full" :to="`/${project.id}`">
    <card class="relative">
      <div class="absolute top-0 -right-3">
        <el-dropdown class="mr-2">
          <el-button :text="true">
            <MoreFilled class="text-black w-4 h-4" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click.prevent="handleDelete">Delete</el-dropdown-item>
              <el-dropdown-item @click.prevent="updateDialogVisible = true">Update</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <template #title>{{ project.name }}</template>
      <div class="mb-5">{{ description }}</div>
    </card>
  </router-link>

  <project-update-form
  v-model="updateDialogVisible"
  :project="project"
  @submit="(data) => projects.update(project.id, data)"
/>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import truncate from "@/helpers/string";
import { ElMessageBox } from "element-plus";
import { useProjects } from "@/stores/projects";
import { MoreFilled } from "@element-plus/icons-vue";
import Card from "@/components/ui/PimpedCard.vue";

import ProjectUpdateForm from './ProjectUpdateForm.vue';

const props = defineProps<{
  project: Project;
}>();

const projects = useProjects();

const description = computed(() => {
  return truncate(props.project.description, 150);
});

const updateDialogVisible = ref(false);

function handleDelete() {
  ElMessageBox.confirm("Do you really want to delete this project?")
    .then(() => {
      projects.remove(props.project.id);
    })
    .catch(() => {});
}
</script>
