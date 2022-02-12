<template>
  <div>
    <el-collapse>
      <el-collapse-item :title="project.name" name="1">
        {{ project.description }}
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { get, url } from '@/helpers/http';
import { onMounted, ref, type Ref } from 'vue';

const props = defineProps<{
  id: string
}>()


let project: Ref<Project> = ref(<Project>{})

onMounted(() => {
  get(url(`projects/${props.id}`))
    .then(res => res.json())
    .then(data => project.value = data)
    .catch(e => console.log(e))
})
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
