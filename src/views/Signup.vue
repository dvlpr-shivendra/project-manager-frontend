<template>
  <div class="h-full w-full grid place-content-center">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">Sign Up</div>
      </template>
      <el-form label-position="top" @submit.prevent="signUp" @keyup="handleKeyUp">
        <el-form-item label="Name" :error="errors.name">
          <el-input v-model="credentials.name" required name="name" />
        </el-form-item>
        
        <el-form-item label="Email" :error="errors.email">
          <el-input v-model="credentials.email" required type="email" name="email" />
        </el-form-item>

        <el-form-item label="Password" :error="errors.password">
          <el-input v-model="credentials.password" type="password" required name="password" />
        </el-form-item>
        
        <el-form-item label="Confirm Password" :error="errors.password_confirmation">
          <el-input v-model="credentials.password_confirmation" type="password" required name="password_confirmation" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" loading="loading">Sign Up</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { post, url } from '@/helpers/http';
import { setUserData } from '@/helpers/auth';
import { handleAPIException } from '@/helpers/apiExceptionHandler';

type Credentials = {
  name: string
  email: string,
  password: string,
  password_confirmation: string
}

const route = useRoute()

const credentials: Ref<Credentials> = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: ""
})

const errors: Ref<{[key: string]: string}> = ref({})
const loading: Ref<boolean> = ref(false)

function signUp() {
  loading.value = true
  post(url('signup'), credentials.value)
    .then(data => {
      setUserData(data)
      route.query.redirect 
        ? window.location.replace(route.query.redirect as string) 
        : window.location.replace('/')
    })
    .catch(e => handleAPIException(e, errors))
    .finally(() => loading.value = false)
}

function handleKeyUp(e: any) {
  errors.value[e.target.getAttribute('name')] = ""
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>