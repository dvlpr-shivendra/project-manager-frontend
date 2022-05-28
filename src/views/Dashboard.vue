<template>
  <div class="p-4 grid grid-cols-12 gap-4">
    <h1>Welcome, {{ user.name }}</h1>
  </div>
</template>

<script setup lang="ts">

import { ref, type Ref } from 'vue'
import { getUser } from '@/helpers/auth';

const user: Ref<User> = ref(getUser() as User)

</script>