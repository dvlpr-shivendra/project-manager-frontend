<template>
  <div class="flex justify-between items-center px-4 h-12 bg-black">
    <div></div>

    <div>
      <el-button color="#626aef" style="color: white" v-if="!loggedIn">
        <router-link to="/signup">Sign up</router-link>
      </el-button>
      <el-button color="#626aef" plain v-if="!loggedIn">
        <router-link to="/login">Log in</router-link>
      </el-button>

      <el-dropdown v-if="loggedIn">
        <el-button type="text">
          {{ user.name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, type Ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue'
import { getUser, getLoggedIn } from '@/helpers/auth';

const user: Ref<User> = ref(getUser() as User)
const loggedIn: Ref<boolean> = ref(getLoggedIn())

function logout() {
  localStorage.clear()
  location.replace('/login')
}
</script>