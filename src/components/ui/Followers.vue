<template>
  <button @click="openDrawer = true" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 hover:border-indigo-300 dark:hover:border-indigo-800 text-gray-600 dark:text-gray-400 text-[13px] font-medium transition-all cursor-pointer">
    <User style="width:14px;height:14px;" class="text-gray-400 shrink-0" />
    <span v-if="followers.length === 0">Add followers</span>
    <span v-else>{{ followers.length }} {{ pluralize('follower', followers.length) }}</span>
    <div v-if="followers.length > 0" class="flex items-center ml-auto -space-x-1.5">
      <div v-for="f in followers.slice(0, 4)" :key="f.id" :title="f.name" class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[9px] font-bold text-white">{{ f.name?.[0]?.toUpperCase() }}</div>
      <div v-if="followers.length > 4" class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[9px] font-bold text-gray-600 dark:text-gray-300">+{{ followers.length - 4 }}</div>
    </div>
  </button>
  <el-drawer v-model="openDrawer" direction="rtl" :with-header="false" size="420px">
    <div class="flex flex-col h-full p-5 gap-5">
      <h2 class="font-['Syne'] font-bold text-xl text-gray-900 dark:text-white">Followers</h2>
      <user-select label="Add follower" @change="addFollower" />
      <div class="flex flex-col gap-2 flex-1 overflow-y-auto">
        <TransitionGroup name="list">
          <div v-for="follower in followers" :key="follower.id" class="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">{{ follower.name?.[0]?.toUpperCase() }}</div>
              <span class="text-[13px] font-medium text-gray-800 dark:text-gray-200">{{ follower.name }}</span>
            </div>
            <button @click="handleDelete(follower)" :disabled="!!deletingWithIds[follower.id]" class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <Close style="width:12px;height:12px;" />
            </button>
          </div>
        </TransitionGroup>
        <div v-if="followers.length === 0" class="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-600 text-[13px]">No followers yet</div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import UserSelect from './UserSelect.vue';
import { pluralize } from '@/helpers/string';
import { Close, User } from '@element-plus/icons-vue';
defineProps<{ followers: User[] }>();
const emit = defineEmits(['remove', 'add']);
const deletingWithIds = ref<{ [key: string]: boolean }>({});
const openDrawer = ref(false);
function handleDelete(follower: User) { deletingWithIds.value[follower.id] = true; emit('remove', follower.id); }
function addFollower(user: User) { emit('add', user); }
</script>
