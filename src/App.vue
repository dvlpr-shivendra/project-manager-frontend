<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/navigation/Navbar.vue'
import Sidebar from './components/navigation/Sidebar.vue'
</script>

<template>
  <Navbar />

  <div class="content">
    <aside>
      <Sidebar />
    </aside>
    <main style="padding: 1rem;">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.content {
  height: calc(100vh - 59px);
  display: grid;
  grid-template-columns: 215px auto;
}

aside {
  height: 100%;
}

main {
  min-height: 100%;
  overflow-y: scroll;
}
</style>