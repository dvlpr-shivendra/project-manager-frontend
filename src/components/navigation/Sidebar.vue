<template>
  <div class="h-[calc(100vh-48px)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
    <div class="flex-1 p-4">
      <!-- Navigation Items -->
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.index"
          :to="item.route"
          class="group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer"
          :class="isActive(item.route) 
            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        >
          <!-- Active indicator -->
          <div 
            class="absolute left-0 w-1 rounded-r-full transition-all duration-200"
            :class="isActive(item.route) 
              ? 'h-8 bg-gradient-to-b from-purple-600 to-pink-600' 
              : 'h-0 bg-purple-400'"
          ></div>
          
          <!-- Icon with animation -->
          <component 
            :is="item.icon" 
            class="w-5 h-5 transition-transform duration-200"
            :class="isActive(item.route) 
              ? '' 
              : 'group-hover:scale-110'"
          />
          
          <!-- Label -->
          <span 
            class="font-medium transition-all duration-200"
            :class="isActive(item.route) ? 'font-semibold' : ''"
          >
            {{ item.label }}
          </span>
          
          <!-- Hover glow effect -->
          <div 
            v-if="!isActive(item.route)"
            class="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"
          ></div>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import {
  Menu as MenuIcon,
  Setting,
  UserFilled,
  PriceTag
} from '@element-plus/icons-vue';

const route = useRoute();

const menuItems = [
  { index: '1', route: '/', label: 'Dashboard', icon: Setting },
  { index: '2', route: '/projects', label: 'Projects', icon: MenuIcon },
  { index: '3', route: '/tags', label: 'Tags', icon: PriceTag },
  { index: '4', route: '/users', label: 'Users', icon: UserFilled },
];

const isActive = (itemRoute: string) => {
  if (itemRoute === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(itemRoute);
};
</script>

<style scoped>
/* Ensure smooth animations */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>