<template>
  <div class="px-4">
    <pimped-heading>{{ project.name }}</pimped-heading>
    
    <task-list :projectId="parseInt(props.id)" :key="updateTriggerKey" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from 'vue';
import TaskList from '@/components/tasks/TaskList.vue';
import { useRoute } from 'vue-router';
import { get, url } from '@/helpers/http';
import PimpedHeading from '@/components/ui/PimpedHeading.vue';

const props = defineProps<{
  id: string
}>()

const route = useRoute()

const updateTriggerKey = ref(0)

watch(
  () => route.query.page,
  (value) => {
    if (value) updateTriggerKey.value++
  }
)


let project: Ref<Project> = ref(<Project>{})

onMounted(() => {
  get(url(`projects/${props.id}`))
    .then(data => project.value = data)
    .catch(e => console.log(e))
})
</script>
