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
      @change="handleChange"
      value-key="id"
    >
      <el-option v-for="user in options" :key="user.id" :label="user.name" :value="user" />
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import { get, url } from '@/helpers/http'
import { ref, watch } from 'vue'

const props = defineProps<{
  user?: User
  label: string
}>()

let options = ref<User[]>(props.user ? [props.user] : [])
const loading = ref<boolean>(false)
const selected = ref<User|undefined>(props.user)

watch(() => props.user, (user) => {
  if (user && !options.value.find(option => option.id === user.id)) {
    options.value.push(user)
  }
  
  selected.value = user
})

const emit = defineEmits(['change'])

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true

    get(url(`users?name=${query}`))
      .then((users: User[]) => {
        if (props.user && !options.value.find(option => option.id === props.user?.id)) {
          options.value = [...users, props.user]
        } else {
          options.value = users
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        loading.value = false
      })
  } else {
    options.value = []
  }
}

function handleChange(user: User) {
  if (user.id !== props.user?.id) {
    emit('change', user)
  }
}
</script>