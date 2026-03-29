<template>
  <header
    class="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 lg:px-5"
  >
    <router-link
      to="/"
      class="group flex items-center gap-2.5 shrink-0 no-underline"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          class="text-white"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
          <path
            d="M2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <span
        class="font-['Syne'] text-[17px] font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
      >
        {{ companyName() }}
      </span>
    </router-link>

    <div class="flex items-center gap-1.5">
      <search-drawer v-if="loggedIn" />
      <dark-mode-toggle />

      <template v-if="!loggedIn">
        <router-link
          to="/signup"
          class="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 no-underline"
        >
          Sign up
        </router-link>
        <router-link
          to="/login"
          class="rounded-lg border border-gray-200 px-4 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-indigo-400 no-underline"
        >
          Log in
        </router-link>
      </template>

      <el-dropdown v-if="loggedIn" trigger="click" placement="bottom-end">
        <button
          class="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5 transition-colors hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700"
        >
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-['Syne'] text-[10px] font-bold text-white"
          >
            {{ initials }}
          </div>
          <span
            class="hidden text-[13px] font-medium text-gray-700 sm:block dark:text-gray-300"
          >
            {{ user?.name }}
          </span>
          <el-icon class="text-xs text-gray-400"><arrow-down /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <div
              class="mb-1 border-b border-gray-100 px-3 py-2 dark:border-gray-800"
            >
              <p
                class="font-['Syne'] text-[13px] font-semibold text-gray-900 dark:text-white"
              >
                {{ user?.name }}
              </p>
            </div>
            <el-dropdown-item @click="logout" style="color: #ef4444"
              >Log out</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <button
        v-if="loggedIn"
        @click="mobileOpen = !mobileOpen"
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect
            x="1"
            y="3.5"
            width="14"
            height="1.5"
            rx="0.75"
            fill="currentColor"
          />
          <rect
            x="1"
            y="7.25"
            width="14"
            height="1.5"
            rx="0.75"
            fill="currentColor"
          />
          <rect
            x="1"
            y="11"
            width="14"
            height="1.5"
            rx="0.75"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileOpen"
          class="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm lg:hidden"
          @click="mobileOpen = false"
        />
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-250 ease-out"
        leave-active-class="transition-transform duration-250 ease-in"
        enter-from-class="-translate-x-full"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="mobileOpen"
          class="fixed bottom-0 left-0 top-0 z-[201] w-64 shadow-2xl lg:hidden"
        >
          <Sidebar @navigate="mobileOpen = false" />
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { getLoggedIn, logout } from "@/helpers/auth";
import SearchDrawer from "@/components/ui/SearchDrawer.vue";
import DarkModeToggle from "@/components/ui/DarkModeToggle.vue";
import Sidebar from "@/components/navigation/Sidebar.vue";
import { useMeStore } from "@/stores/me";

const meStore = useMeStore();
const user = computed(() => meStore.user);
const loggedIn = ref(getLoggedIn());
const mobileOpen = ref(false);
const initials = computed(
  () =>
    user.value?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?"
);

function companyName() {
  return import.meta.env.VITE_APP_TITLE;
}
</script>
