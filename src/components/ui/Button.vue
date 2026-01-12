<template>
  <button
    class="group relative overflow-hidden rounded-xl px-6 py-3 font-medium
           bg-gray-200 text-gray-900
           dark:bg-gray-800 dark:text-white"
  >
    <span
      class="pointer-events-none absolute inset-0
             bg-gradient-to-r from-indigo-400 to-pink-400
             dark:from-indigo-500 dark:to-pink-500
             transition-[clip-path] duration-500 ease-out
             [clip-path:circle(0%_at_50%_50%)]
             group-hover:[clip-path:circle(150%_at_50%_50%)]"
    ></span>

    <span class="relative z-10">Button</span>
  </button>
</template>
