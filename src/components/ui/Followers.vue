<template>
  <div>
    <el-button class="w-full mb-2 !justify-start" text bg :icon="User" @click="openDrawer = true">
      <span v-if="followers.length === 0">Add followers</span>
      <span v-else>{{ followers.length }} {{ pluralize('follower', followers.length) }}</span>
    </el-button>
  </div>

  <el-drawer v-model="openDrawer" direction="rtl" :with-header="false" size="40%">
    <user-select label="Add follower" @change="addFollower" />

    <div class="grid grid-cols-2 col-span-2 lg:col-span-1 gap-2">
      <div class="flex items-center p-2 bg-slate-200 justify-between rounded hover:bg-slate-300"
        v-for="follower in followers" :key="follower.id">
        <div class="flex items-center rounded cursor-pointer">
          <div class="mr-3">
            <avatar :name="follower.name" />
          </div>
          <p class="font-medium">{{ follower.name }}</p>
        </div>
        <el-button type="danger" :icon="Close" circle size="small" @click="handleDelete(follower)"
          :loading="!!deletingWithIds[follower.id]" />
      </div>
    </div>
  </el-drawer>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Avatar from './Avatar.vue'
import UserSelect from './UserSelect.vue';
import { pluralize } from '@/helpers/string';
import { Close, User } from '@element-plus/icons-vue'

defineProps<{
  followers: User[]
}>()

const deletingWithIds = ref<{ [key: string]: boolean }>({})

const emit = defineEmits(['remove', 'add'])

const openDrawer = ref(false)

function handleDelete(follower: User) {
  deletingWithIds.value[follower.id] = true;
  emit('remove', follower.id)
}

function addFollower(user: User) {
  emit('add', user)
}

</script>

<style>
.el-upload {
  width: 100%;
}

.el-upload-dragger {
  width: 100%;
}
</style>