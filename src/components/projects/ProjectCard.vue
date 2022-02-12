<template>
  <el-card class="col-span-12 md:col-span-6 lg:col-span-4">
    <template #header>
      <div class="card-header">
        <strong>{{ project.name }}</strong>
      </div>
    </template>
    <div>{{ description }}</div>
  </el-card>
</template>

<script lang="ts" setup>
import truncate from "@/helpers/string";
import { computed } from "vue";

const props = defineProps({
  project: { type: Object, required: true },
})

const description = computed(() => {
  return truncate(props.project.description, 150)
})

</script>