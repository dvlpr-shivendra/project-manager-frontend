<template>
  <el-menu
    :default-active="'2'"
    class="justify-end"
    mode="horizontal"
    background-color="#0a0a0a"
    text-color="#ffffff"
  >
    <el-sub-menu index="2" v-if="isLoggedIn">
      <template #title>{{ user.name }}</template>
      <el-menu-item index="2-1" @click="logout">Log out</el-menu-item>  
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { getUser, getLoggedIn } from '@/helpers/auth';
import { ref, type Ref } from 'vue';
import { useRouter } from "vue-router"

const router = useRouter()

const user: Ref<User> = ref(getUser() as User)
const isLoggedIn: Ref<boolean> = ref(getLoggedIn())

function logout() {
  localStorage.clear()
  router.push({path: '/login'})
}
</script>