<template>
  <el-scrollbar>
    <el-menu
      default-active="1"
      background-color="#27272a"
      text-color="#ffffff"
      @open="handleOpen"
      @close="handleClose"
      class="h-screen"
      style="border: #27272a !important"
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
          <setting />
        </el-icon>
        <span>Projects</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {
  Location,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>