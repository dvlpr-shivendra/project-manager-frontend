<template>
  <h1
    class="group mb-5 text-4xl font-extrabold tracking-tight relative cursor-default"
  >
    <!-- Animated background gradient -->
    <span
      class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-size-200 animate-gradient blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
    ></span>
    
    <!-- Main text with gradient -->
    <span
      class="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent bg-size-200 animate-gradient group-hover:tracking-wide transition-all duration-300"
    >
      <slot></slot>
    </span>
    
    <!-- Shimmer effect overlay -->
    <span
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
    ></span>
    
    <!-- Subtle glow dots -->
    <span
      class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"
    ></span>
    <span
      class="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping animation-delay-150"
    ></span>
  </h1>
</template>

<style scoped>
.bg-size-200 {
  background-size: 200%;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  animation: gradient 8s ease infinite;
}

.animation-delay-150 {
  animation-delay: 150ms;
}
</style>