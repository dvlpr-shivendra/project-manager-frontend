<template>
  <el-form-item :label="label">
    <el-select
    class="w-full"
      v-model="selected"
      filterable
      remote
      reserve-keyword
      placeholder="Search for a user"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="emit('change', selected)"
    >
      <el-option v-for="user in options" :key="user.id" :label="user.name" :value="user" />
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import { get, url } from '@/helpers/http';
import { ref } from 'vue'

const props = defineProps<{
  user: User
  label: string
}>()

let options = ref<User[]>([props.user])
const loading = ref<boolean>(false)
const selected = ref<User>(props.user)

const emit = defineEmits(['change'])

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true

    get(url(`users?name=${query}`))
      .then(res => res.json())
      .then((users: User[]) => {
        options.value = [...users, props.user]
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