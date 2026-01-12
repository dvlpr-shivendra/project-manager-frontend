<template>
  <div
    class="group relative h-full overflow-hidden rounded-2xl bg-white text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white"
  >
    <!-- Animated overlay -->
    <div
    v-if="showHoverOverlay"
      class="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 transition-[clip-path] duration-500 ease-out [clip-path:circle(0%_at_100%_0%)] group-hover:[clip-path:circle(150%_at_100%_0%)]"
    ></div>

    <!-- Content -->
    <div class="relative p-6 space-y-3">
      <h3 class="text-xl font-semibold"><slot name="title"></slot></h3>
      <div><slot></slot></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: "Card",
});
defineProps<{
  showHoverOverlay?: boolean;
}>();
</script>
