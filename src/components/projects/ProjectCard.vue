<template>
  <el-card class="col-span-12 md:col-span-6 lg:col-span-4">

    <template #header>
      <div class="flex justify-end">
        <el-dropdown class="mr-2">
          <el-button type="text">
            <MoreFilled class="text-black w-4 h-4" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDelete">Delete</el-dropdown-item>
              <el-dropdown-item>Update</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <p class="font-bold text-xl mb-5">
      <router-link :to="`/${project.id}`">{{ project.name }}</router-link>
    </p>

    <div class="mb-5">{{ description }}</div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import truncate from "@/helpers/string";
import { ElMessageBox } from "element-plus";
import { useProjects } from "@/stores/projects";
import { MoreFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  project: Project
}>()

const projects = useProjects()

const description = computed(() => {
  return truncate(props.project.description, 150)
})

function handleDelete() {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      projects.remove(props.project.id)
    })
    .catch(() => {})

}

</script>