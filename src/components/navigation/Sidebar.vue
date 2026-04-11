<template>
  <nav class="flex flex-col w-full h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 py-3 px-2 transition-colors duration-300">
    <div class="lg:hidden flex items-center gap-2.5 px-2 pb-3 mb-1 border-b border-gray-100 dark:border-gray-800">
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-white">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="font-['Syne'] font-bold text-[15px] text-gray-900 dark:text-white">Menu</span>
    </div>

    <div class="flex flex-col gap-0.5 flex-1">
      <router-link
        v-for="item in visibleMenuItems" :key="item.index" :to="item.route" @click="emit('navigate')"
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium no-underline transition-all duration-150 group"
        :class="isActive(item.route)
          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] shrink-0 transition-transform duration-150"
          :class="isActive(item.route) ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:scale-110'" />
        <span>{{ item.label }}</span>
        <span v-if="isActive(item.route)" class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
      </router-link>
    </div>

    <div class="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 px-2">
      <p class="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-widest">v1.0</p>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { Odometer, Folder, PriceTag, Avatar } from '@element-plus/icons-vue';
import { useCan } from '@/composables/useCan';
import { computed } from 'vue';

const emit = defineEmits(['navigate']);
const route = useRoute();
const { hasRole } = useCan();

const menuItems = [
  { index: '1', route: '/',         label: 'Dashboard', icon: Odometer },
  { index: '2', route: '/projects', label: 'Projects',  icon: Folder   },
  { index: '3', route: '/tags',     label: 'Tags',      icon: PriceTag },
  { index: '4', route: '/users',    label: 'Users',     icon: Avatar,   requiredRole: 'admin' },
];

const visibleMenuItems = computed(() => {
  return menuItems.filter(item => {
    if (item.requiredRole && !hasRole(item.requiredRole)) return false;
    return true;
  });
});

const isActive = (r: string) => r === '/' ? route.path === '/' : route.path.startsWith(r);
</script>
