<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import Navbar from './components/navigation/Navbar.vue'
import Sidebar from './components/navigation/Sidebar.vue'
import { getLoggedIn } from './helpers/auth';
import { useTags } from './stores/tags';

const loggedIn = getLoggedIn()

onMounted(() => {
  useTags().getAll()
})
</script>

<template>
  <Navbar />
  <div class="grid grid-cols-12">
    <aside class="hidden lg:block lg:col-span-2" v-if="loggedIn">
      <Sidebar />
    </aside>
    <main class="col-span-12" :class="loggedIn ? 'lg:col-span-10' : 'lg:col-span-12'">
      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
aside, .content {
  height: calc(100vh - 3rem);
  overflow-y: scroll;
}
</style>