<template>
  <div class="p-4">
    <h1 class="font-bold mb-4">Welcome, {{ user.name }} 😊</h1>

    <el-button type="success" :icon="ArrowRight">Start my day</el-button>
  </div>
</template>

<script setup lang="ts">

import { ref, type Ref } from 'vue'
import { getUser } from '@/helpers/auth';
import { ArrowRight } from '@element-plus/icons-vue'

const user: Ref<User> = ref(getUser() as User)

</script>