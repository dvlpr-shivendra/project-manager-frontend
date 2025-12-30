<template>
  <el-scrollbar>
    <el-menu
      default-active="1"
      @open="handleOpen"
      @close="handleClose"
      class="h-[calc(100vh-48px)]"
      :router="true"
    >
      <el-menu-item index="1" route="/">
        <el-icon>
          <setting />
        </el-icon>
        <span>Dashboard</span>
      </el-menu-item>
      
      <el-menu-item index="2" route="/projects">
        <el-icon>
          <menu-icon />
        </el-icon>
        <span>Projects</span>
      </el-menu-item>

      <el-menu-item index="3" route="/users">
        <el-icon>
          <user-filled />
        </el-icon>
        <span>Users</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {
  Menu as MenuIcon,
  Setting,
  UserFilled,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>