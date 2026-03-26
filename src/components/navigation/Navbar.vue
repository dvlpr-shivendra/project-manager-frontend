<template>
  <header class="sticky top-0 z-50 flex items-center justify-between px-4 lg:px-5 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
    <router-link to="/" class="flex items-center gap-2.5 no-underline shrink-0 group">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-white">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="font-['Syne'] font-extrabold text-[17px] tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {{ companyName() }}
      </span>
    </router-link>

    <div class="flex items-center gap-1.5">
      <search-drawer v-if="loggedIn" />
      <dark-mode-toggle />

      <template v-if="!loggedIn">
        <router-link to="/signup" class="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold no-underline transition-colors shadow-sm">Sign up</router-link>
        <router-link to="/login" class="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-[13px] font-medium no-underline transition-colors">Log in</router-link>
      </template>

      <el-dropdown v-if="loggedIn" trigger="click" placement="bottom-end">
        <button class="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-gray-900 transition-colors cursor-pointer">
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white font-['Syne']">{{ initials }}</div>
          <span class="text-[13px] font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{{ user.name }}</span>
          <el-icon class="text-gray-400 text-xs"><arrow-down /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
              <p class="text-[13px] font-semibold text-gray-900 dark:text-white font-['Syne']">{{ user.name }}</p>
            </div>
            <el-dropdown-item @click="logout" style="color:#ef4444">Log out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <button v-if="loggedIn" @click="mobileOpen = !mobileOpen"
        class="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="1" y="11" width="14" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mobileOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] lg:hidden" @click="mobileOpen = false" />
      </Transition>
      <Transition name="slide-left">
        <div v-if="mobileOpen" class="fixed left-0 top-0 bottom-0 w-64 z-[201] lg:hidden shadow-2xl">
          <Sidebar @navigate="mobileOpen = false" />
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { getUser, getLoggedIn } from '@/helpers/auth';
import SearchDrawer from '@/components/ui/SearchDrawer.vue';
import DarkModeToggle from '@/components/ui/DarkModeToggle.vue';
import Sidebar from '@/components/navigation/Sidebar.vue';

const user: Ref<User> = ref(getUser() as User);
const loggedIn: Ref<boolean> = ref(getLoggedIn());
const mobileOpen = ref(false);
const initials = computed(() => user.value?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?');
function logout() { localStorage.clear(); location.replace('/login'); }
function companyName() { return import.meta.env.VITE_APP_TITLE; }
</script>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
