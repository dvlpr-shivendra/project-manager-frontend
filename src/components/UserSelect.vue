<template>
  <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="Search for a user"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { get, url } from '@/helpers/http';
import { ref } from 'vue'

interface ListItem {
  value: string
  label: string
}

const options = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)

type option = { value: string, label: string }

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true

    get(url(`users?name=${query}`))
      .then(res => res.json())
      .then((users: User[]) => {
        options.value = users.map((user: User): option => ({
          value: user.id.toString(),
          label: user.name
        }));
      })
      .catch(e => console.log(e))
      .finally(() => {
        loading.value = false;
      })
  } else {
    options.value = []
  }
}
</script>