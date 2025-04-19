<template>

  <el-button :icon="Search" circle @click="openSearchDrawer" />

  <el-drawer v-model="drawer" direction="rtl" :with-header="false">
    <el-input ref="searchInput" v-model="query" placeholder="Enter 2 or more characters" :prefix-icon="Search"
      @input="debounceSearch" />

    <div class="my-8">

      <el-skeleton v-if="searching" :rows="5" animated />

      <p class="font-bold text-lg mb-2" v-if="result.projects.length > 0">Projects</p>
      <TransitionGroup name="list">
        <p class="cursor-pointer text-blue-800 rounded p-2 mb-1" v-for="project in result.projects"
          :key="project.id" @click="openProject(project)">
          {{ project.name }}
        </p>
      </TransitionGroup>
    </div>

    <div class="my-8">
      <p class="font-bold text-lg mb-2" v-if="result.tasks.length > 0">Tasks</p>
      <TransitionGroup name="list">
        <p class="cursor-pointer rounded p-2 mb-1" v-for="task in result.tasks" @click="openTask(task)"
          :key="task.id">
          {{ task.project?.name }} <span class=" text-blue-800 ">{{ task.title }}</span>
        </p>
      </TransitionGroup>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { get, url } from '@/helpers/http';
import { Search } from '@element-plus/icons-vue';
import { debounce } from 'lodash';

const router = useRouter()

const drawer = ref(false)
const searching = ref(false)
const query = ref("")

type SearchResult = {
  projects: Project[],
  tasks: Task[],
}

const result: Ref<SearchResult> = ref({
  projects: [],
  tasks: [],
})

const searchInput = ref()

function openSearchDrawer() {
  drawer.value = true

  setTimeout(() => {
    searchInput.value.focus()
  }, 550);
}

function debounceSearch() {

  result.value = result.value = {
    projects: [],
    tasks: [],
  }

  if (query.value.length < 2) {
    return
  }

  searching.value = true

  debounce(search, 750)()
}

function search() {
  get(url(`search/${query.value}`))
    .then(data => {
      result.value = data
    })
    .finally(() => {
      searching.value = false
    })
}

function openTask(task: Task) {

  drawer.value = false

  result.value = {
    projects: [],
    tasks: [],
  }

  query.value = ""

  router.push({
    name: 'Project',
    params: { id: task.project_id },
    query: { task: task.id }
  })
}

function openProject(project: Project) {
  drawer.value = false

  result.value = {
    projects: [],
    tasks: [],
  }

  query.value = ""

  router.push({
    name: 'Project',
    params: { id: project.id }
  })
}
</script>