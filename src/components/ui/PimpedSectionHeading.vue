<template>
  <h3
    class="group relative flex items-center gap-2 cursor-default"
    :class="[sizeClasses, marginClasses]"
  >
    <!-- Decorative dot -->
    <span 
      v-if="showDot"
      class="w-2 h-2 rounded-full transition-all duration-300"
      :class="[
        themeClasses.dot,
        'group-hover:w-8 group-hover:h-2 group-hover:rounded-full'
      ]"
    ></span>
    
    <!-- Icon (optional) -->
    <component 
      v-if="icon"
      :is="icon" 
      class="transition-transform duration-300 group-hover:scale-110"
      :class="[iconSizeClasses, themeClasses.icon]"
    />
    
    <!-- Main text -->
    <span
      class="font-semibold tracking-tight transition-all duration-300 group-hover:tracking-normal"
      :class="themeClasses.text"
    >
      <slot></slot>
    </span>
    
    <!-- Count/Number badge (optional) -->
    <span 
      v-if="count !== undefined"
      class="px-2 py-0.5 text-xs font-bold rounded-full transition-all duration-200"
      :class="themeClasses.countBadge"
    >
      {{ count }}
    </span>
    
    <!-- Small badge (optional) -->
    <span 
      v-if="badge"
      class="px-2 py-0.5 text-xs font-medium rounded transition-all duration-200"
      :class="themeClasses.badge"
    >
      {{ badge }}
    </span>
  </h3>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue';

const props = defineProps<{
  icon?: Component;
  badge?: string;
  count?: number;
  showDot?: boolean;
  theme?: 'purple' | 'green' | 'blue' | 'orange' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  noMargin?: boolean;
}>();

const currentTheme = computed(() => props.theme || 'purple');
const currentSize = computed(() => props.size || 'md');

const themeClasses = computed(() => {
  const themes = {
    purple: {
      text: 'text-gray-800 dark:text-gray-100',
      icon: 'text-purple-600 dark:text-purple-400',
      dot: 'bg-gradient-to-r from-purple-600 to-pink-600',
      countBadge: 'bg-purple-600 text-white',
      badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    green: {
      text: 'text-gray-800 dark:text-gray-100',
      icon: 'text-green-600 dark:text-green-400',
      dot: 'bg-gradient-to-r from-green-600 to-emerald-600',
      countBadge: 'bg-green-600 text-white',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    },
    blue: {
      text: 'text-gray-800 dark:text-gray-100',
      icon: 'text-blue-600 dark:text-blue-400',
      dot: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      countBadge: 'bg-blue-600 text-white',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
    orange: {
      text: 'text-gray-800 dark:text-gray-100',
      icon: 'text-orange-600 dark:text-orange-400',
      dot: 'bg-gradient-to-r from-orange-600 to-red-600',
      countBadge: 'bg-orange-600 text-white',
      badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    },
    gray: {
      text: 'text-gray-800 dark:text-gray-100',
      icon: 'text-gray-600 dark:text-gray-400',
      dot: 'bg-gray-600',
      countBadge: 'bg-gray-600 text-white',
      badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  };
  
  return themes[currentTheme.value];
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };
  return sizes[currentSize.value];
});

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  return sizes[currentSize.value];
});

const marginClasses = computed(() => {
  if (props.noMargin) return '';
  const margins = {
    sm: 'mb-2',
    md: 'mb-3',
    lg: 'mb-4'
  };
  return margins[currentSize.value];
});
</script>