<template>
  <h2
    class="group relative inline-block cursor-default"
    :class="[sizeClasses, marginClasses]"
  >
    <!-- Icon (optional) -->
    <component 
      v-if="icon"
      :is="icon" 
      class="inline-block mr-2 transition-transform duration-300 group-hover:rotate-12"
      :class="[iconSizeClasses, themeClasses.icon]"
    />
    
    <!-- Main text with gradient -->
    <span
      class="relative font-bold tracking-tight transition-all duration-300 group-hover:tracking-normal"
      :class="themeClasses.text"
    >
      <slot></slot>
      
      <!-- Animated accent line -->
      <span 
        v-if="animated"
        class="absolute -bottom-1 left-0 h-1 rounded-full transition-all duration-300"
        :class="[
          themeClasses.accent,
          'w-12 group-hover:w-full'
        ]"
      ></span>
    </span>
    
    <!-- Badge (optional) -->
    <span 
      v-if="badge"
      class="ml-3 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200"
      :class="themeClasses.badge"
    >
      {{ badge }}
    </span>
  </h2>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue';

const props = defineProps<{
  icon?: Component;
  badge?: string;
  animated?: boolean;
  theme?: 'purple' | 'green' | 'blue' | 'orange' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  noMargin?: boolean;
}>();

const currentTheme = computed(() => props.theme || 'purple');
const currentSize = computed(() => props.size || 'md');

const themeClasses = computed(() => {
  const themes = {
    purple: {
      text: 'text-gray-800 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text',
      icon: 'text-purple-600 dark:text-purple-400',
      accent: 'bg-gradient-to-r from-purple-600 to-pink-600',
      badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    green: {
      text: 'text-gray-800 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text',
      icon: 'text-green-600 dark:text-green-400',
      accent: 'bg-gradient-to-r from-green-600 to-emerald-600',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    },
    blue: {
      text: 'text-gray-800 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text',
      icon: 'text-blue-600 dark:text-blue-400',
      accent: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
    orange: {
      text: 'text-gray-800 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text',
      icon: 'text-orange-600 dark:text-orange-400',
      accent: 'bg-gradient-to-r from-orange-600 to-red-600',
      badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    },
    gray: {
      text: 'text-gray-800 dark:text-gray-100',
      icon: 'text-gray-600 dark:text-gray-400',
      accent: 'bg-gray-600 dark:bg-gray-400',
      badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  };
  
  return themes[currentTheme.value];
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
  return sizes[currentSize.value];
});

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
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
