<template>
  <label class="group flex items-center gap-3 cursor-pointer select-none w-fit p-1">
    <!-- Hidden native checkbox -->
    <input
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
      class="sr-only"
    />
    
    <!-- Custom checkbox -->
    <div class="relative flex items-center justify-center">
      <!-- Checkbox container -->
      <div
        class="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
        :class="[
          modelValue
            ? themeClasses.checked
            : `border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 ${themeClasses.hover}`
        ]"
      >
        <!-- Checkmark icon with animation -->
        <svg
          class="w-3 h-3 text-white transition-all duration-300"
          :class="modelValue ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <!-- Ripple effect on click -->
      <div
        v-if="showRipple"
        class="absolute inset-0 rounded-full animate-ping pointer-events-none"
        :class="themeClasses.ripple"
        @animationend="showRipple = false"
      ></div>
    </div>
    
    <!-- Label text -->
    <span
      v-if="label"
      class="text-gray-700 dark:text-gray-200 font-medium transition-all duration-200"
      :class="modelValue ? themeClasses.labelChecked : themeClasses.labelHover"
    >
      {{ label }}
    </span>
    
    <!-- Slot for custom label content -->
    <slot></slot>
  </label>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue?: boolean;
  label?: string;
  theme?: 'purple' | 'green';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const showRipple = ref(false);

const currentTheme = computed(() => props.theme || 'purple');

const themeClasses = computed(() => {
  const themes = {
    purple: {
      checked: 'border-purple-500 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600',
      hover: 'group-hover:border-purple-400',
      ripple: 'bg-purple-400',
      labelChecked: 'text-purple-600 dark:text-purple-400',
      labelHover: 'group-hover:text-purple-500'
    },
    green: {
      checked: 'border-green-500 bg-gradient-to-br from-green-600 via-emerald-600 to-green-600',
      hover: 'group-hover:border-green-400',
      ripple: 'bg-green-400',
      labelChecked: 'text-green-600 dark:text-green-400',
      labelHover: 'group-hover:text-green-500'
    }
  };
  
  return themes[currentTheme.value];
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  
  // Trigger ripple effect
  showRipple.value = true;
};
</script>

<style scoped>
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 0.5s cubic-bezier(0, 0, 0.2, 1);
}
</style>