<template>
  <div
    class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <Navbar />
    <div class="flex flex-1 overflow-hidden" style="height: calc(100vh - 56px)">
      <aside
        v-if="loggedIn"
        class="hidden lg:flex w-[220px] flex-shrink-0 h-full overflow-y-auto"
      >
        <Sidebar />
      </aside>
      <main class="flex-1 overflow-y-auto min-w-0">
        <div class="p-6 lg:p-8">
          <RouterView :key="route.path" v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>
    <Chat />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import Navbar from "./components/navigation/Navbar.vue";
import Sidebar from "./components/navigation/Sidebar.vue";
import Chat from "./components/agent/Chat.vue";
import { getLoggedIn } from "./helpers/auth";
import { fetchMe } from "./services/meService";
import { useMeStore } from "./stores/me";

const loggedIn = getLoggedIn();
const route = useRoute();
const meStore = useMeStore();

onMounted(async () => {
  if (loggedIn) {
    await meStore.fetchData().catch((e) => {
      console.error("Failed to load user data on app mount:", e);
    });
  }
});
</script>
