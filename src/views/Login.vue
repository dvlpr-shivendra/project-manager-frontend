<template>
  <div class="h-full w-full grid place-content-center">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">Login</div>
      </template>
      <el-form label-position="top" @submit.prevent="login" @keyup="handleKeyUp">
        <el-form-item label="Email" :error="errors.email">
          <el-input type="email" v-model="credentials.email" required name="email" />
        </el-form-item>

        <el-form-item label="Password" :error="errors.password">
          <el-input v-model="credentials.password" type="password" required name="password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">Login</el-button>
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
  email: string,
  password: string,
}

const route = useRoute()

const credentials: Ref<Credentials> = ref({
  email: "",
  password: "",
})

const errors: Ref<{[key: string]: string}> = ref({})

function login() {
  post(url('login'), credentials.value)
    .then(data => {
      setUserData(data)
      route.query.redirect 
        ? window.location.replace(route.query.redirect as string) 
        : window.location.replace('/')
    })
    .catch(e => handleAPIException(e, errors))
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