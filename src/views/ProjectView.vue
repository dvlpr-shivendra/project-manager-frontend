<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <router-link to="/projects" class="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors no-underline shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </router-link>
      <pimped-heading class="!mb-0">{{ project.name }}</pimped-heading>
    </div>
    <task-list :projectId="parseInt(props.id)" :key="updateTriggerKey" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from 'vue';
import TaskList from '@/components/tasks/TaskList.vue';
import { useRoute } from 'vue-router';
import { get, url } from '@/helpers/http';
import PimpedHeading from '@/components/ui/PimpedHeading.vue';
const props = defineProps<{ id: string }>();
const route = useRoute();
const updateTriggerKey = ref(0);
watch(() => route.query.page, val => { if (val) updateTriggerKey.value++; });
const project: Ref<Project> = ref(<Project>{});
onMounted(() => { get(url(`projects/${props.id}`)).then(data => (project.value = data)).catch(e => console.log(e)); });
</script>
