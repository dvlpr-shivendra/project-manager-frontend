<template>
  <div class="px-4">
    <!-- <el-collapse>
      <el-collapse-item :title="project.name" name="1">
        {{ project.description }}
      </el-collapse-item>
    </el-collapse> -->

    <task-list :projectId="parseInt(props.id)" :key="updateTriggerKey" />
  </div>
</template>

<script lang="ts" setup>
import { get, url } from '@/helpers/http';
import { onMounted, ref, watch, type Ref } from 'vue';
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


// let project: Ref<Project> = ref(<Project>{})

// onMounted(() => {
//   get(url(`projects/${props.id}`))
//     .then(data => project.value = data)
//     .catch(e => console.log(e))
// })
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
