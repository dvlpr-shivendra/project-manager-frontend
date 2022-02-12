<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/navigation/Navbar.vue'
import Sidebar from './components/navigation/Sidebar.vue'
</script>

<template>
  <div class="grid grid-cols-12">
    <aside class="hidden lg:block lg:col-span-2">
      <Sidebar />
    </aside>
    <main class="col-span-12 lg:col-span-10">
      <Navbar />

      <div class="content p-4">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.content {
  height: calc(100vh - 60px);
  overflow-y: scroll;
}
</style>