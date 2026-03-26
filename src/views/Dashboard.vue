<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-['Syne'] font-extrabold text-2xl lg:text-3xl tracking-tight text-gray-900 dark:text-white mb-1">Good {{ timeOfDay }}, {{ firstName }} 👋</h1>
        <p class="text-gray-500 dark:text-gray-400 text-[14px]">Here's what's happening with your projects today.</p>
      </div>
      <router-link to="/projects" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold no-underline transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/25 shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Go to projects
      </router-link>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="stat.iconBg"><component :is="stat.icon" class="w-4 h-4 text-white" /></div>
        <div><p class="font-['Syne'] font-bold text-xl text-gray-900 dark:text-white leading-none mb-0.5">—</p><p class="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{{ stat.label }}</p></div>
      </div>
    </div>
    <div class="grid sm:grid-cols-3 gap-4">
      <router-link v-for="link in quickLinks" :key="link.label" :to="link.to" class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-3 no-underline hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="link.iconBg"><component :is="link.icon" class="w-4 h-4 text-white" /></div>
        <div><p class="font-['Syne'] font-bold text-[14px] text-gray-900 dark:text-white mb-0.5">{{ link.label }}</p><p class="text-[12px] text-gray-500 dark:text-gray-400">{{ link.desc }}</p></div>
        <span class="text-[12px] font-semibold text-indigo-500 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">Open <span>→</span></span>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import { getUser } from '@/helpers/auth';
import { Folder, List, Check, Clock, PriceTag, Avatar } from '@element-plus/icons-vue';
const user: Ref<User> = ref(getUser() as User);
const firstName = computed(() => user.value?.name?.split(' ')[0] || 'there');
const timeOfDay = computed(() => { const h = new Date().getHours(); if (h < 12) return 'morning'; if (h < 17) return 'afternoon'; return 'evening'; });
const stats = [
  { label: 'Projects',   icon: Folder, iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { label: 'Open tasks', icon: List,   iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500' },
  { label: 'Completed',  icon: Check,  iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
  { label: 'Overdue',    icon: Clock,  iconBg: 'bg-gradient-to-br from-orange-500 to-red-500' },
];
const quickLinks = [
  { label: 'Projects', desc: 'View and manage all your projects', to: '/projects', icon: Folder,   iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { label: 'Tags',     desc: 'Organise tasks with custom labels', to: '/tags',     icon: PriceTag, iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500' },
  { label: 'Users',    desc: 'Manage team members and roles',    to: '/users',    icon: Avatar,   iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
];
</script>
