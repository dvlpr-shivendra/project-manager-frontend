<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/navigation/Navbar.vue'
import Sidebar from './components/navigation/Sidebar.vue'
import { getLoggedIn } from './helpers/auth';

const loggedIn = getLoggedIn()
</script>

<template>
  <div class="grid grid-cols-12">
    <aside class="hidden lg:block lg:col-span-2" v-if="loggedIn">
      <Sidebar />
    </aside>
    <main class="col-span-12" :class="loggedIn ? 'lg:col-span-10' : 'lg:col-span-12'">
      
      <Navbar />

      <div class="content p-4">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.content {
  height: calc(100vh - 3rem);
  overflow-y: scroll;
}
</style>