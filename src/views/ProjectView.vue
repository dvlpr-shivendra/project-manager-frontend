<template>
  <div>
    <task-list :projectId="parseInt(props.id)" :key="updateTriggerKey" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import TaskList from '@/components/tasks/TaskList.vue';
import { useRoute } from 'vue-router';

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

</script>
