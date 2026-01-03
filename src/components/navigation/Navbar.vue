<template>
  <div class="flex justify-between items-center px-6 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
    <!-- Logo -->
    <router-link 
      to="/" 
      class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
      style="font-family: cursive;"
    >
      {{ companyName() }}
    </router-link>

    <!-- Right Side Actions -->
    <div class="flex items-center gap-3">
      <!-- Search Drawer (when logged in) -->
      <search-drawer v-if="loggedIn" class="mr-1" />
      
      <!-- Dark Mode Toggle -->
      <div class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <dark-mode-toggle />
      </div>

      <!-- Auth Buttons (when not logged in) -->
      <template v-if="!loggedIn">
        <router-link to="/signup">
          <el-button 
            color="#626aef" 
          >
            Sign up
          </el-button>
        </router-link>
        
        <router-link to="/login">
          <el-button plain>
            Log in
          </el-button>
        </router-link>
      </template>

      <!-- User Dropdown (when logged in) -->
      <el-dropdown v-if="loggedIn" trigger="click">
        <el-button text>
          <span>{{ user.name }}</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item 
              @click="logout"
            >
              Logout
            </el-dropdown-item>
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
import SearchDrawer from '@/components/ui/SearchDrawer.vue';
import DarkModeToggle from '@/components/ui/DarkModeToggle.vue';

const user: Ref<User> = ref(getUser() as User)
const loggedIn: Ref<boolean> = ref(getLoggedIn())

function logout() {
  localStorage.clear()
  location.replace('/login')
}

function companyName() {
  return import.meta.env.VITE_APP_TITLE
}
</script>