<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <router-link to="/projects">
        <back />
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
import Back from '@/components/ui/Back.vue';
const props = defineProps<{ id: string }>();
const route = useRoute();
const updateTriggerKey = ref(0);
watch(() => route.query.page, val => { if (val) updateTriggerKey.value++; });
const project: Ref<Project> = ref(<Project>{});
onMounted(() => { get(url(`projects/${props.id}`)).then(data => (project.value = data)).catch(e => console.log(e)); });
</script>
